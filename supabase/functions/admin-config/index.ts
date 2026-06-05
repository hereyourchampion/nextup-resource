// Admin config — password-protected read/write of API keys stored in app_config.
// Password is the ADMIN_PASSWORD secret. Send via header `x-admin-password`.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const ALLOWED_KEYS = new Set(["LOVABLE_API_KEY", "DEEPSEEK_API_KEY"]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function mask(v: string | undefined) {
  if (!v) return null;
  if (v.length <= 8) return "•".repeat(v.length);
  return v.slice(0, 4) + "•".repeat(Math.max(0, v.length - 8)) + v.slice(-4);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (!adminPassword) return json({ error: "ADMIN_PASSWORD not configured" }, 500);

  const provided = req.headers.get("x-admin-password") || "";
  if (!provided || !safeEqual(provided, adminPassword)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("app_config").select("key,value,updated_at");
      if (error) throw error;
      const map: Record<string, { masked: string | null; updated_at: string | null }> = {};
      for (const k of ALLOWED_KEYS) map[k] = { masked: null, updated_at: null };
      for (const row of data ?? []) {
        if (ALLOWED_KEYS.has(row.key)) {
          map[row.key] = { masked: mask(row.value), updated_at: row.updated_at };
        }
      }
      // Also surface env-var presence so admin knows if the function has a fallback.
      const env = {
        LOVABLE_API_KEY: !!Deno.env.get("LOVABLE_API_KEY"),
        DEEPSEEK_API_KEY: !!Deno.env.get("DEEPSEEK_API_KEY"),
      };
      return json({ keys: map, env });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const updates = (body?.updates ?? {}) as Record<string, string | null>;
      const ops = [];
      for (const [key, value] of Object.entries(updates)) {
        if (!ALLOWED_KEYS.has(key)) continue;
        if (value === null || value === "") {
          ops.push(supabase.from("app_config").delete().eq("key", key));
        } else if (typeof value === "string" && value.length >= 8 && value.length <= 2000) {
          ops.push(
            supabase
              .from("app_config")
              .upsert({ key, value, updated_at: new Date().toISOString() }),
          );
        }
      }
      for (const op of ops) {
        const { error } = await op;
        if (error) throw error;
      }
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
