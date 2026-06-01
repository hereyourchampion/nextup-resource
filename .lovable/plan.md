## 1. New Sarvam-powered Chatbot (replaces Resourcly)

- Add `SARVAM_API_KEY` via the secrets tool (you'll paste the key in the secure form).
- Create a Vercel serverless function `api/chat.ts` that proxies to Sarvam's chat completions endpoint (`https://api.sarvam.ai/v1/chat/completions`), passing the key server-side as `api-subscription-key` header. Uses a system prompt scoped to the Nextup site so it answers like a site guide.
- Rebuild `src/components/Resourcly.tsx` from scratch (remove ThinkStack iframe):
  - Floating bubble button (kept consistent with site design — violet primary, 2px border, hard shadow).
  - Expanded panel: header with "Nextup Guide" + Sarvam badge, scrollable message list, streamed-style typing indicator, markdown rendering for assistant replies (`react-markdown`), input + send button.
  - User bubble: primary background, primary-foreground text. Assistant: no bubble background, plain text on card (per chat-agent contract).
  - Conversation kept in component state (one session, no persistence). "Clear chat" button.
  - Polished dark-mode styling using existing tokens.

## 2. Content additions

**Apps** — append to `src/data/content.ts` `apps`:

- **SkyStream** — `https://github.com/akashdh11/skystream/releases/latest`, category "Streaming", short description ("Open-source IPTV/streaming client — latest release"), `dateAdded` = today.

**Courses** — append a single bundle in `src/data/content.ts` `courses`:

- Title: **Premium Course Bundle**, category "Career", description listing the 5 paths (Video Editing, AI & ChatGPT, YouTube Creation, Social Media, Graphic Designing) with the role tags.
- HO'OPONOPONO: `https://t.me/+_WKyz0eY2jAwMTBl` as a separate course entry, category "Mindset/Spiritual".

**GTA bundle (existing)** — locate the existing GTA collection (likely in `featuredCollections` / `apps` with category "GTA") and append:

- **GTA 3** — `https://t.me/nextupfilebot?start=BQADAQADkgcAAvAJ6ET3OazFrGZhKxYE`.

**Resources** — append:

- **5 Premium Fonts (Monument Extended)** — link `https://t.me/nextupfilebot?start=BQADAQADpgcAAvAJ6ER-BNviWb-lehYE`. Upload attached `IMG_20260601_201439_447.jpg` via `lovable-assets` as the poster/thumbnail.

**Ebooks** — append:

- **Clone Training Script** — `https://t.me/nextupfilebot?start=BQADAQADtAcAAvAJ6ETZvw7-lPE7uRYE`
- **AI Tools to Use Daily** — `https://t.me/nextupfilebot?start=BQADAQADuwcAAvAJ6ETI_Rq2h9h_SRYE`
- **Higgsfield Video Prompts** — `https://t.me/nextupfilebot?start=BQADAQADvAcAAvAJ6ESXhnAmq3mRzxYE`
- **Video Sample Prompts** — `https://t.me/nextupfilebot?start=BQADAQADvgcAAvAJ6ERq4ahS54uSGRYE`
- **Gen AI Course (Be Unstoppable with AI — Beginner to Advanced 2025)** — `https://t.me/nextupfilebot?start=BQADAQADoAcAAvAJ8ERgvBx47LIpBhYE`. Upload attached `IMG_20260601_204328_778.jpg` as poster.

All new items get `dateAdded` = today so they surface in the Notification Center / "New" badges.

## 3. Wiring

- Import poster assets where `ResourceCard` / `EbookCard` accept a `poster` / `image` field (extend the type if needed — minimal addition, no behavior change for items without posters).
- Remove ThinkStack iframe usage. No other component changes.
- Update `README.md` with the new Sarvam chatbot note and content additions.

## Technical notes

- Sarvam endpoint: POST `https://api.sarvam.ai/v1/chat/completions` with `{ model: "sarvam-m", messages, temperature, stream: false }` and header `api-subscription-key: ${SARVAM_API_KEY}`. Non-streamed JSON for simplicity (can move to streaming later if you want).
- Assets uploaded via `lovable-assets create --file /mnt/user-uploads/<img>` → `src/assets/<name>.jpg.asset.json`, then imported and rendered.
- One-session chat (no thread sidebar, no DB) — matches the chat-agent contract for "one conversation + no persidatabase, 
- Also fix the morphe apps to bypass duplicate, have a working cache worker and update database. Also fix its ui