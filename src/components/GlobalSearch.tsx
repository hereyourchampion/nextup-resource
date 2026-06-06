import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounced } from "@/hooks/useDebounced";
import { courses, resources, ebooks, apps, websites } from "@/data/content";
import { aiTools } from "@/data/aiTools";
import { fossListApps } from "@/data/fossList";
import { shizukuApps } from "@/data/shizukuApps";
import { materialYouApps } from "@/data/materialYouApps";
import { telegramBots } from "@/data/telegramBots";
import { fuzzyScore } from "@/lib/fuzzy";

interface Hit {
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string;
  category?: string;
  url?: string;
  to?: string;
  group: string;
  groupTo: string;
}

const groupAccent: Record<string, string> = {
  Courses: "bg-primary text-primary-foreground",
  Resources: "bg-secondary text-secondary-foreground",
  Ebooks: "bg-tertiary text-tertiary-foreground",
  Apps: "bg-primary text-primary-foreground",
  Websites: "bg-secondary text-secondary-foreground",
  "AI Tools": "bg-tertiary text-tertiary-foreground",
  FOSS: "bg-primary text-primary-foreground",
  Shizuku: "bg-secondary text-secondary-foreground",
  "Material You": "bg-tertiary text-tertiary-foreground",
  Telegram: "bg-primary text-primary-foreground",
};

const buildIndex = (): Hit[] => {
  const out: Hit[] = [];
  for (const c of courses)
    out.push({ title: c.title, subtitle: c.category, category: c.category, url: c.link, group: "Courses", groupTo: "/courses" });
  for (const r of resources)
    out.push({ title: r.title, subtitle: r.category, category: r.category, url: r.link, group: "Resources", groupTo: "/resources" });
  for (const e of ebooks)
    out.push({ title: e.title, subtitle: e.category, category: e.category, url: e.link, group: "Ebooks", groupTo: "/ebooks" });
  for (const a of apps)
    out.push({ title: a.title, subtitle: a.category, category: a.category, url: a.link, group: "Apps", groupTo: "/apps" });
  for (const w of websites)
    out.push({ title: w.title, subtitle: w.category, category: w.category, url: w.link, group: "Websites", groupTo: "/apps" });
  for (const t of aiTools)
    out.push({
      title: t.name,
      subtitle: t.category,
      description: (t as any).description,
      tags: Array.isArray((t as any).tags) ? (t as any).tags.join(" ") : undefined,
      category: t.category,
      url: t.url,
      group: "AI Tools",
      groupTo: "/ai",
    });
  for (const f of fossListApps)
    out.push({
      title: f.name,
      subtitle: `${f.author} · ${f.category}`,
      description: (f as any).description,
      category: f.category,
      url: f.url,
      group: "FOSS",
      groupTo: "/foss-apps",
    });
  for (const s of shizukuApps)
    out.push({
      title: s.name,
      subtitle: `${s.author} · ${s.category}`,
      description: (s as any).description,
      category: s.category,
      url: s.url,
      group: "Shizuku",
      groupTo: "/shizuku-apps",
    });
  for (const m of materialYouApps)
    out.push({
      title: m.name,
      subtitle: `${m.author} · ${m.category}`,
      description: (m as any).description,
      category: m.category,
      url: m.url,
      group: "Material You",
      groupTo: "/material-you",
    });
  for (const b of telegramBots)
    out.push({
      title: b.name,
      subtitle: `${b.category} · ${b.tag}`,
      description: b.desc,
      tags: b.tag,
      category: b.category,
      url: b.url,
      group: "Telegram",
      groupTo: "/telegram-tweaks",
    });
  return out;
};

let cachedIndex: Hit[] | null = null;
const getIndex = () => (cachedIndex ??= buildIndex());

const MAX_PER_GROUP = 4;
const MAX_TOTAL = 28;
const MAX_SINGLE_GROUP = 24;
const FILTERS = ["All", "Courses", "Resources", "Ebooks", "Apps", "Websites", "AI Tools", "FOSS", "Shizuku", "Material You", "Telegram"] as const;
type FilterKey = typeof FILTERS[number];

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");
  const debounced = useDebounced(query, 150);

  const results = useMemo(() => {
    const q = debounced.trim();
    if (q.length < 2) return [] as Hit[];
    const idx = getIndex();

    // Score every record once
    const scored: { hit: Hit; score: number }[] = [];
    for (const h of idx) {
      if (filter !== "All" && h.group !== filter) continue;
      const s = fuzzyScore(q, {
        title: h.title,
        category: h.category ?? h.subtitle,
        tags: h.tags,
        description: h.description,
      });
      if (s > 0) scored.push({ hit: h, score: s });
    }
    scored.sort((a, b) => b.score - a.score);

    if (filter !== "All") return scored.slice(0, MAX_SINGLE_GROUP).map((x) => x.hit);

    const perGroup: Record<string, number> = {};
    const out: Hit[] = [];
    for (const { hit } of scored) {
      if (out.length >= MAX_TOTAL) break;
      const c = perGroup[hit.group] ?? 0;
      if (c >= MAX_PER_GROUP) continue;
      perGroup[hit.group] = c + 1;
      out.push(hit);
    }
    return out;
  }, [debounced, filter]);

  const grouped = useMemo(() => {
    const m = new Map<string, Hit[]>();
    for (const r of results) {
      if (!m.has(r.group)) m.set(r.group, []);
      m.get(r.group)!.push(r);
    }
    return Array.from(m.entries());
  }, [results]);

  return (
    <section className="py-10 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-tertiary text-tertiary-foreground border-2 border-foreground/80 shadow-pop-soft text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              Global Search
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
              Search everything in one place
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fuzzy search across courses, resources, ebooks, AI tools, FOSS, Shizuku, Material You &amp; Telegram bots.
            </p>
          </div>

          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
              strokeWidth={2.5}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “insta”, “gif”, “music bot”, “material you”…"
              aria-label="Global site search"
              className="pl-12 pr-12 h-14 text-base rounded-2xl"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-muted text-foreground border-2 border-foreground/30 hover:border-foreground/80 hover:bg-card transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {debounced.trim().length >= 2 && (
            <>
              <div className="mt-4 -mx-1 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 px-1 pb-1 whitespace-nowrap">
                  {FILTERS.map((f) => {
                    const active = filter === f;
                    const accent = f === "All" ? "bg-foreground text-background" : (groupAccent[f] ?? "bg-card text-foreground");
                    return (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-foreground/80 transition-all ${
                          active ? `${accent} shadow-pop` : "bg-card text-foreground hover:-translate-y-0.5"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-3 bg-card border-2 border-foreground/80 rounded-2xl shadow-pop p-4 max-h-[60vh] overflow-y-auto">
                {grouped.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No results for <strong>{debounced}</strong>. Try a different keyword.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {grouped.map(([group, items]) => (
                      <div key={group}>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-foreground/80 ${groupAccent[group] ?? "bg-card text-foreground"}`}
                          >
                            {group}
                          </span>
                          <Link
                            to={items[0].groupTo}
                            className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary"
                          >
                            See all <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                          </Link>
                        </div>
                        <ul className="space-y-1.5">
                          {items.map((h, i) => {
                            const Tag: any = h.url ? "a" : Link;
                            const props = h.url
                              ? { href: h.url, target: "_blank", rel: "noopener noreferrer" }
                              : { to: h.to ?? h.groupTo };
                            return (
                              <li key={`${group}-${i}`}>
                                <Tag
                                  {...props}
                                  className="block px-3 py-2.5 rounded-xl border-2 border-foreground/20 hover:border-foreground/80 hover:bg-background transition-colors"
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="font-bold text-sm text-foreground line-clamp-1 flex-1 min-w-0">
                                      {h.title}
                                    </span>
                                    {h.category && (
                                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground border-2 border-foreground/20 rounded-full px-2 py-0.5 shrink-0">
                                        {h.category}
                                      </span>
                                    )}
                                  </div>
                                  {h.description && (
                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                      {h.description}
                                    </p>
                                  )}
                                  {h.tags && (
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                      {h.tags
                                        .split(/[·•,]/)
                                        .map((t) => t.trim())
                                        .filter(Boolean)
                                        .slice(0, 4)
                                        .map((t) => (
                                          <span
                                            key={t}
                                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-foreground/80"
                                          >
                                            #{t}
                                          </span>
                                        ))}
                                    </div>
                                  )}
                                </Tag>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default GlobalSearch;
