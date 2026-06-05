// Chat edge function — Lovable AI with DeepSeek fallback.
// Keys: per-call override from admin-saved values in app_config, else env.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface InMsg {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are "Nextup Guide", a warm, concise assistant for the Nextup Resources website (https://nextup-resource.vercel.app).

Nextup Resources is a free hub for curated courses, ebooks, AI tools, FOSS Android apps, Shizuku apps, Material You apps, Morphe patched builds, premium fonts, video editing assets, and placement/career material. Visitors are mostly students, creators, and Android enthusiasts.

How to help:
- Answer in 1–4 short paragraphs or a compact bullet list. Use markdown.
- Point users to the right section: Courses, Resources, Ebooks, Apps, AI Tools, FOSS, Shizuku, Material You, Morphe, Telegram, Favorites.
- If a user asks about something the site doesn't cover, say so briefly and suggest the closest section.
- Never make up specific download links — instead, tell them which section to open.
- Be friendly, never robotic. No long disclaimers.`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callLovable(messages: InMsg[], key: string) {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });
}

async function callDeepseek(messages: InMsg[], key: string) {
  return await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });
}

function extractReply(data: any): string {
  return (
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.delta?.content ??
    "Sorry, I couldn't generate a response."
  );
}

async function loadStoredKeys() {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data } = await supabase.from("app_config").select("key,value");
    const map = new Map<string, string>();
    for (const row of data ?? []) map.set(row.key, row.value);
    return map;
  } catch {
    return new Map<string, string>();
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json();
    const incoming: InMsg[] = Array.isArray(body?.messages) ? body.messages : [];
    if (incoming.length === 0)
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    const clean = incoming
      .filter(
        (m) =>
          m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
      )
      .slice(-20);

    const stored = await loadStoredKeys();
    const lovableKey = stored.get("LOVABLE_API_KEY") || Deno.env.get("LOVABLE_API_KEY");
    const deepseekKey = stored.get("DEEPSEEK_API_KEY") || Deno.env.get("DEEPSEEK_API_KEY");

    // ----- Lovable AI: retry only on 429/5xx (400 = bad body, do not retry) -----
    if (lovableKey) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const r = await callLovable(clean, lovableKey);
          const text = await r.text();

          if (r.ok) {
            return new Response(
              JSON.stringify({ reply: extractReply(JSON.parse(text)), provider: "lovable" }),
              { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } },
            );
          }

          const transient = r.status === 429 || r.status >= 500;
          if (transient && attempt === 1) {
            await sleep(600);
            continue;
          }

          if (!deepseekKey) {
            if (r.status === 429)
              return new Response(JSON.stringify({ error: "Rate limit reached. Try again in a moment." }), {
                status: 429,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            if (r.status === 402)
              return new Response(
                JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable workspace settings." }),
                { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
              );
            return new Response(
              JSON.stringify({ error: `Lovable AI ${r.status}`, detail: text.slice(0, 500) }),
              { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
          break; // fall through to DeepSeek
        } catch {
          if (attempt === 1) {
            await sleep(600);
            continue;
          }
          if (!deepseekKey)
            return new Response(JSON.stringify({ error: "Lovable AI unreachable" }), {
              status: 502,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          break;
        }
      }
    }

    // ----- Fallback: DeepSeek -----
    if (deepseekKey) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const r = await callDeepseek(clean, deepseekKey);
          const text = await r.text();
          if (r.ok) {
            return new Response(
              JSON.stringify({ reply: extractReply(JSON.parse(text)), provider: "deepseek" }),
              { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } },
            );
          }
          if ((r.status >= 500 || r.status === 429) && attempt === 1) {
            await sleep(600);
            continue;
          }
          return new Response(
            JSON.stringify({ error: `Deepseek ${r.status}`, detail: text.slice(0, 500) }),
            { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        } catch (e) {
          if (attempt === 1) {
            await sleep(600);
            continue;
          }
          return new Response(
            JSON.stringify({ error: (e as Error)?.message || "Deepseek unreachable" }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ error: "No AI provider configured. Add a key in /admin." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error)?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
