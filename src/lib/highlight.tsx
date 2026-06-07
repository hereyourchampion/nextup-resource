import { Fragment, type ReactNode } from "react";

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

// Highlight every token of `query` that appears in `text` (case/diacritic-insensitive).
// Falls back to a subsequence highlighter when no substring match is found.
export function highlight(text: string | undefined | null, query: string): ReactNode {
  if (!text) return null;
  const q = query.trim();
  if (q.length < 2) return text;

  const lowText = norm(text);
  const tokens = Array.from(new Set(norm(q).split(/\s+/).filter((t) => t.length >= 2)));
  if (tokens.length === 0) return text;

  // Build a mask of which characters in `text` should be highlighted.
  const mask = new Array(text.length).fill(false);
  let anySubstring = false;
  for (const tok of tokens) {
    let from = 0;
    while (from <= lowText.length - tok.length) {
      const idx = lowText.indexOf(tok, from);
      if (idx < 0) break;
      anySubstring = true;
      for (let i = idx; i < idx + tok.length; i++) mask[i] = true;
      from = idx + tok.length;
    }
  }

  // Subsequence fallback for the longest token, so the user still sees *something* highlighted
  if (!anySubstring) {
    const tok = tokens.sort((a, b) => b.length - a.length)[0];
    let qi = 0;
    for (let i = 0; i < text.length && qi < tok.length; i++) {
      if (lowText[i] === tok[qi]) {
        mask[i] = true;
        qi++;
      }
    }
    if (qi !== tok.length) return text;
  }

  // Collapse mask into runs
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    const on = mask[i];
    let j = i + 1;
    while (j < text.length && mask[j] === on) j++;
    const chunk = text.slice(i, j);
    out.push(
      on ? (
        <mark
          key={key++}
          className="bg-tertiary/70 text-tertiary-foreground rounded-[3px] px-0.5 font-bold"
        >
          {chunk}
        </mark>
      ) : (
        <Fragment key={key++}>{chunk}</Fragment>
      ),
    );
    i = j;
  }
  return <>{out}</>;
}
