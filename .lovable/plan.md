# Plan

## 1. Settings page for API keys (`/settings`)

New page where you paste/replace `LOVABLE_API_KEY` and `DEEPSEEK_API_KEY` without editing code.

- New route `/settings` (added to `App.tsx`) with a simple form (two masked inputs, Save / Clear / Test buttons, "key is set" indicator).
- Keys saved to `localStorage` under `nextup:lovable_key` and `nextup:deepseek_key`.
- `Resourcly.tsx` reads them and forwards on each `/api/chat` request as headers `X-Lovable-Key` and `X-Deepseek-Key`.
- `api/chat.ts` priority: request header → env var. Lets you override server keys from the browser, and makes the chat work even when Vercel env vars are missing.
- "Test connection" button posts a single `ping` message and shows which provider replied (`lovable` / `deepseek`) plus latency.
- Reachable from Header (small gear icon next to ThemeToggle) and from the chat panel footer.

## 2. Fix Lovable AI

Current symptom: chat still falls back / errors because `LOVABLE_API_KEY` is not set on Vercel and the request header path didn't exist.

- Provision `LOVABLE_API_KEY` in Lovable Cloud secrets via the `ai_gateway--create` tool so the key exists in the project.
- Update `api/chat.ts` to:
  - Accept per-request keys from `X-Lovable-Key` / `X-Deepseek-Key` headers (used by Settings page).
  - Keep the existing `Lovable-API-Key` header + `google/gemini-3-flash-preview` model, plus `X-Lovable-AIG-SDK: vercel-ai-sdk`.
  - On Lovable 400, log the upstream error body (truncated) in the JSON response so we can see *why* gemini rejected the request (most likely the system+history shape) and stop blind-retrying 400s — per gateway rules, 400 means the body is wrong, not transient.
  - Drop the 400 from the retry list (keep retry only for 429 / 5xx); fall through to DeepSeek immediately on 400.
- Surface the chosen provider in the chat UI (small badge under each assistant message) so you can confirm Lovable is actually answering after the fix.

Note: On the Vercel deployment, `LOVABLE_API_KEY` still needs to be present as a Vercel env var for the serverless function. The Settings page is the no-code fallback — paste the key once in the browser and the function will use it via header.

## 3. Replace Placement with Telegram Tweaks in misc bottom nav

`Placement` is already in the secondary nav, so it's removed from `miscLinks` in `BottomNav.tsx` and replaced with a new entry:

- `{ to: "/telegram-tweaks", icon: Send, label: "Telegram" }`
- New page `src/pages/TelegramTweaks.tsx` styled with the existing Playful Geometric system (cream card, 2px border, hard shadow, Outfit headings).
- Content (curated bot list, each as a candy card with copy + open buttons):
  - **Fitsman** — Download PC games from FitGirl Repacks → `https://t.me/Fitsman_bot`
  - **Nextup File Bot** — Store & share files → `https://t.me/nextupfilebot`
  - Import more from  here : [https://telegrambotlist.com/](https://telegrambotlist.com/)"
- Route added to `App.tsx`; SEO meta via `updatePageMeta`.
- Added to sitemap for completeness.

## Technical notes

- No backend schema changes.
- Files touched: `api/chat.ts`, `src/App.tsx`, `src/components/BottomNav.tsx`, `src/components/Header.tsx`, `src/components/Resourcly.tsx`, `src/pages/Settings.tsx` (new), `src/pages/TelegramTweaks.tsx` (new), `public/sitemap.xml`.
- Memory: add a small note that Telegram Tweaks replaces Placement in the misc ring.
- Keys in `localStorage` are device-local; this is acceptable for a personal-tools site (matches the existing "local storage only" core rule). They are sent only to the same-origin `/api/chat` endpoint over HTTPS.make it backend not frontend as my website is public so add a password system for admin to go there