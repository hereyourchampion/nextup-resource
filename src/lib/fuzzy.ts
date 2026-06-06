// Small fuzzy matcher used by GlobalSearch.
// Returns a score; 0 means no match. Higher is better.

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

function fieldScore(query: string, text: string): number {
  if (!text) return 0;
  if (text === query) return 1000;
  if (text.startsWith(query)) return 600 - Math.min(text.length - query.length, 400);
  // word-boundary prefix
  const tokens = text.split(/[\s._\-/:|·•,]+/);
  for (const tok of tokens) {
    if (!tok) continue;
    if (tok === query) return 550;
    if (tok.startsWith(query)) return 450;
  }
  const idx = text.indexOf(query);
  if (idx >= 0) return 350 - Math.min(idx, 200);

  // Subsequence match — every char in order
  let qi = 0;
  let last = -1;
  let gaps = 0;
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) {
      if (last >= 0) gaps += i - last - 1;
      last = i;
      qi++;
    }
  }
  if (qi === query.length) {
    return Math.max(20, 220 - gaps * 3 - Math.floor(text.length / 4));
  }
  return 0;
}

export type WeightedFields = {
  title: string;
  category?: string;
  tags?: string;
  description?: string;
};

export function fuzzyScore(rawQuery: string, fields: WeightedFields): number {
  const q = norm(rawQuery.trim());
  if (q.length < 2) return 0;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;

  const t = norm(fields.title ?? "");
  const c = norm(fields.category ?? "");
  const g = norm(fields.tags ?? "");
  const d = norm(fields.description ?? "");

  let total = 0;
  for (const tok of tokens) {
    const best =
      fieldScore(tok, t) * 3 +
      fieldScore(tok, c) * 2 +
      fieldScore(tok, g) * 1.5 +
      fieldScore(tok, d) * 1;
    if (best === 0) return 0; // every token must match somewhere
    total += best;
  }
  return total;
}
