// Vercel serverless function — proxies chat messages to Sarvam AI.
// Uses SARVAM_API_KEY (server-side only). No streaming for simplicity.

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

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const key = process.env.SARVAM_API_KEY;
    if (!key) {
      res.status(500).json({ error: "Server missing SARVAM_API_KEY" });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const incoming: InMsg[] = Array.isArray(body?.messages) ? body.messages : [];
    if (incoming.length === 0) {
      res.status(400).json({ error: "messages required" });
      return;
    }

    // Strip any client-supplied system prompt; we own it.
    const clean = incoming
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20);

    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": key,
      },
      body: JSON.stringify({
        model: "sarvam-m",
        temperature: 0.6,
        max_tokens: 600,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...clean],
      }),
    });

    const text = await sarvamRes.text();
    if (!sarvamRes.ok) {
      res.status(sarvamRes.status).json({ error: `Sarvam ${sarvamRes.status}`, detail: text.slice(0, 500) });
      return;
    }
    const data = JSON.parse(text);
    const reply: string =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      "Sorry, I couldn't generate a response.";

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ reply });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
