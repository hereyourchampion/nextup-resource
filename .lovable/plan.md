## Goal

Site-wide polish keeping the current Playful Geometric (Memphis) style. Focus on real bugs I reproduced in the mobile preview, plus consistency and accessibility nits across pages.

## Issues found (reproduced at 390×844)

1. **Header overflows on mobile** — On `/morphe` (and any page with a longer brand row), the rightmost theme toggle clips past the viewport edge. The header row never shrinks because logo text + 3 icon buttons + 2px borders + hard shadows blow past 360px.
2. **Morphe page crashes with JSON parse error** — `/api/morphe` is a Vercel function; in the dev preview it returns the raw JS file, so `useMorpheReleases` throws `Unexpected token '/', '// Vercel '... is not valid JSON`. Visible as a red "Couldn't load builds" block.
3. **Chat panel layering / composer contrast**
  - Panel sits *above* the bottom nav but the nav still pokes through visually because the panel height + `bottom-[10.5rem]` math leaves the bottom nav overlapping the composer on short screens.
  - Send button uses `bg-primary` over a dark header backdrop, low contrast at the bottom-right edge.
  - The floating X toggle visually collides with the panel's own header close button.
4. **"Install app" floating link** sits mid-hero between the CTA buttons and the Stats card, breaking the visual flow. Should live in the footer / header utility row, not loose in the page body.
5. **Loading state on Morphe** shows "0 apps · 0 releases" + a skeleton card with no label — looks like an empty result, not loading.
6. **Notification bell badge** (`9`) sits half-outside the bell button on small screens; should be inset.
7. **Welcome intro modal** scrollable list of links has no visible scrollbar cue at the bottom — content gets clipped under the screen edge before the "Don't show again" + Help row.
8. **Marquee** intentionally bleeds right but the last visible item gets hard-clipped under the scrollbar; needs a fade mask.
9. **Hero on mobile** — large empty band above the "Welcome to Nextup Resources" pill because the hero canvas reserves desktop height. Tighten vertical padding < md.
10. **Global Search input** uses `text-foreground` on `bg-card` which is fine, but the chip row below wraps awkwardly on 360px (chips overflow vertically with uneven gaps). Make it horizontally scrollable with snap.
11. **A11y** — several icon-only buttons missing `aria-label`: Marquee pause control, NotificationCenter trigger, Footer social icons, BottomNav "More" toggle. Verified by reading the components.
12. **Bottom nav** — active-item underline animates correctly but the "More" expanded sheet has no escape on Esc / outside-click on some pages.

## Fixes

### Bugs (priority)

- **Header (`src/components/Header.tsx`)**: collapse brand text to icon-only below `sm`, reduce gap, drop one shadow level on mobile so the row fits 360px.
- **Morphe API (`src/hooks/useMorpheReleases.ts`)**: detect non-JSON response (`content-type` check + try/catch); on failure, fall back to direct `https://api.github.com/repos/...` fetch using the existing 12h SWR cache. Show a friendly "Using cached builds" notice instead of red error.
- **Resourcly (`src/components/Resourcly.tsx`)**:
  - Cap panel height to `min(560px, calc(100dvh - 9rem))` and lift `bottom` to `calc(env(safe-area-inset-bottom) + 8.5rem)` on mobile so it always clears the bottom nav.
  - Hide the floating bubble while panel is open (keep only the panel-header close).
  - Swap send button to `bg-secondary` for contrast on the card surface; add focus ring.
  - Add `aria-live="polite"` to messages region.
- **Install link**: remove from `Index.tsx` body; move to `Footer.tsx` utility row alongside FAQ / Show intro. Keep the route.
- **Morphe loading state**: in `Morphe.tsx` replace `"0 apps · 0 releases"` with `"Loading latest builds…"` while `isLoading`, and render 3 skeleton cards with shimmer instead of one.
- **NotificationCenter badge**: position `-top-1 -right-1` with `ring-2 ring-background` and clamp count to `9+`.
- **IntroModal**: add a sticky bottom fade + ensure the "Don't show again" / "Help" row sits inside a non-scrolling footer; the scroll container only wraps the link list.
- **Marquee**: add CSS mask `mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent)` to both edges.
- **Hero**: reduce `py` from `py-24` to `py-12 md:py-24`; cap canvas height to `40dvh` on mobile.
- **GlobalSearch chip row**: wrap in `overflow-x-auto snap-x` with `-mx-4 px-4` to bleed-scroll on mobile.
- **A11y**: add `aria-label` to all icon-only buttons listed above. Add Esc handler + outside-click close to BottomNav "More" sheet.

### Visual consistency (small)

- Standardize card border to `border-2 border-foreground/80` across `AppCard`, `FossAppCard`, `CourseCard`, `EbookCard`, `ResourceCard` (some currently use `/70`).
- Standardize section headings to `text-3xl md:text-4xl font-extrabold font-heading` site-wide.
- Replace hard-coded `text-gray-*` / `text-white` (if any) with semantic tokens (`text-foreground`, `text-muted-foreground`).

### Out of scope

- No new features, no new pages, no chatbot rebuild, no design refresh, no data changes.
- Fix chatbot as not working 

## Files to edit

```text
src/components/Header.tsx
src/components/Resourcly.tsx
src/components/IntroModal.tsx
src/components/NotificationCenter.tsx
src/components/Marquee.tsx
src/components/Hero.tsx
src/components/GlobalSearch.tsx
src/components/BottomNav.tsx
src/components/Footer.tsx
src/components/AppCard.tsx
src/components/FossAppCard.tsx
src/components/CourseCard.tsx
src/components/EbookCard.tsx
src/components/ResourceCard.tsx
src/hooks/useMorpheReleases.ts
src/pages/Index.tsx
src/pages/Morphe.tsx
```

## Verification

1. Reload `/`, `/morphe`, `/material-you`, `/foss`, `/apps` at 360, 390, 768, 1280.
2. Confirm header fits on 360, no horizontal scroll anywhere.
3. Confirm `/morphe` either shows builds or "Using cached builds" instead of the red JSON error.
4. Open chat on each route; confirm panel never overlaps the bottom nav, composer remains tappable, send button is visible in both themes.
5. Tab through home page; confirm every interactive control has a visible focus ring and an accessible name.
6. Toggle dark mode on every page; confirm no low-contrast text.