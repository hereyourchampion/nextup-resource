// Vercel serverless function — chat proxy.
// Primary: Lovable AI Gateway (LOVABLE_API_KEY).
// Fallback: DeepSeek (DEEPSEEK_API_KEY) when Lovable key is missing or
// returns a non-recoverable error. Automatic 1x retry on transient failures.

interface InMsg {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are "Nextup Guide", a warm, concise assistant for the Nextup Resources website (https://nextup-resource.vercel.app).

Nextup Resources is a free hub for curated courses, ebooks, AI tools, FOSS Android apps, Shizuku apps, Material You apps, Morphe patched builds, premium fonts, video editing assets, and placement/career material. Visitors are mostly students, creators, and Android enthusiasts.

How to help:
- Answer in 1–4 short paragraphs or a compact bullet list. Use markdown.
- Point users to the right section: Courses, Resources, Ebooks, Apps, AI Tools, FOSS, Shizuku, Material You, Morphe, Favorites.
- If a user asks about something the site doesn't cover, say so briefly and suggest the closest section.
- Never make up specific download links — instead, tell them which section to open.
- Be friendly, never robotic. No long disclaimers.`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callLovable(messages: InMsg[], key: string) {
  return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });
}

async function callDeepseek(messages: InMsg[], key: string) {
  return fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
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

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const incoming: InMsg[] = Array.isArray(body?.messages) ? body.messages : [];
    if (incoming.length === 0) return res.status(400).json({ error: "messages required" });

    const clean = incoming
      .filter(
        (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
      )
      .slice(-20);

    const lovableKey = process.env.LOVABLE_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    // ----- Try Lovable AI (with one automatic retry on transient errors) -----
    if (lovableKey) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const r = await callLovable(clean, lovableKey);
          const text = await r.text();

          if (r.ok) {
            res.setHeader("Cache-Control", "no-store");
            return res.status(200).json({ reply: extractReply(JSON.parse(text)), provider: "lovable" });
          }

          // Retry once on 400/429/5xx (transient/recoverable)
          const retriable = r.status === 400 || r.status === 429 || r.status >= 500;
          if (retriable && attempt === 1) {
            await sleep(600);
            continue;
          }

          // Surface specific rate / credit errors when we have no fallback
          if (!deepseekKey) {
            if (r.status === 429)
              return res.status(429).json({ error: "Rate limit reached. Please try again in a moment." });
            if (r.status === 402)
              return res
                .status(402)
                .json({ error: "AI credits exhausted. Please top up Lovable AI in workspace settings." });
            return res
              .status(r.status)
              .json({ error: `Lovable AI ${r.status}`, detail: text.slice(0, 500) });
          }
          break; // fall through to Deepseek
        } catch {
          if (attempt === 1) {
            await sleep(600);
            continue;
          }
          if (!deepseekKey) return res.status(502).json({ error: "Lovable AI unreachable" });
          break;
        }
      }
    }

    // ----- Fallback: Deepseek -----
    if (deepseekKey) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const r = await callDeepseek(clean, deepseekKey);
          const text = await r.text();
          if (r.ok) {
            res.setHeader("Cache-Control", "no-store");
            return res
              .status(200)
              .json({ reply: extractReply(JSON.parse(text)), provider: "deepseek" });
          }
          if ((r.status >= 500 || r.status === 429) && attempt === 1) {
            await sleep(600);
            continue;
          }
          return res
            .status(r.status)
            .json({ error: `Deepseek ${r.status}`, detail: text.slice(0, 500) });
        } catch (e: any) {
          if (attempt === 1) {
            await sleep(600);
            continue;
          }
          return res.status(502).json({ error: e?.message || "Deepseek unreachable" });
        }
      }
    }

    return res
      .status(500)
      .json({ error: "No AI provider configured. Set LOVABLE_API_KEY or DEEPSEEK_API_KEY." });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
