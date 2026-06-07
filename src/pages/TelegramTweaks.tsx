import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import SearchBox from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { Send, ExternalLink, Bot as BotIcon, Sparkles, ArrowDownAZ, Clock } from "lucide-react";
import { updatePageMeta } from "@/lib/og-image";
import { telegramBots, telegramBotCategories } from "@/data/telegramBots";
import { useDebounced } from "@/hooks/useDebounced";
import { highlight } from "@/lib/highlight";
import { fuzzyScore } from "@/lib/fuzzy";

const accentMap = {
  primary: { bg: "bg-primary", text: "text-primary-foreground" },
  secondary: { bg: "bg-secondary", text: "text-secondary-foreground" },
  tertiary: { bg: "bg-tertiary", text: "text-tertiary-foreground" },
} as const;

type SortMode = "category" | "newest";

const splitTags = (tag: string) =>
  tag
    .split(/[·•,]/)
    .map((t) => t.trim())
    .filter(Boolean);

const TelegramTweaks = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("category");
  const debounced = useDebounced(query, 150);

  useEffect(() => {
    updatePageMeta({
      title: "Telegram Tweaks · Secret Bots — Nextup Resources",
      description:
        "A curated, searchable list of secret Telegram bots for downloads, file tools, music, AI assistants and more.",
      url: "/telegram-tweaks",
    });
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim();
    if (!q) return telegramBots;
    // Use the same metadata fields as GlobalSearch for consistent matching.
    return telegramBots
      .map((b) => ({
        b,
        score: fuzzyScore(q, {
          title: b.name,
          category: b.category,
          tags: b.tag,
          description: b.desc,
        }),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.b);
  }, [debounced]);

  const byNewest = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => (b.dateAdded ?? "").localeCompare(a.dateAdded ?? "") || a.name.localeCompare(b.name),
      ),
    [filtered],
  );

  const grouped = useMemo(() => {
    if (sort === "newest") return [["Newest first", byNewest] as const];
    const map = new Map<string, typeof telegramBots>();
    for (const cat of telegramBotCategories) map.set(cat, []);
    for (const b of filtered) {
      if (!map.has(b.category)) map.set(b.category, []);
      map.get(b.category)!.push(b);
    }
    return Array.from(map.entries())
      .filter(([, items]) => items.length > 0)
      .map(
        ([cat, items]) =>
          [cat, [...items].sort((a, b) => a.name.localeCompare(b.name))] as const,
      );
  }, [filtered, byNewest, sort]);

  return (
    <div className="min-h-screen pb-24 md:pb-12 dot-grid">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pt-24 sm:pt-28">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-tertiary text-tertiary-foreground border-2 border-foreground/80 rounded-full px-3 py-1 text-xs font-bold shadow-pop-soft mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Telegram Tweaks
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold leading-tight">
            Secret Telegram Bots
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Hand-picked Telegram bots organised by category — downloads, file tools, music, AI and
            more. Tap any card to open the bot in Telegram.
          </p>
        </header>

        <div className="max-w-2xl mx-auto mb-6">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search bots by name, tag or category…"
            ariaLabel="Search Telegram bots"
          />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground font-bold mr-1">Sort:</span>
            {([
              { id: "category", label: "By category", icon: ArrowDownAZ },
              { id: "newest", label: "Newest first", icon: Clock },
            ] as const).map(({ id, label, icon: Icon }) => {
              const active = sort === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSort(id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-foreground/80 transition-all ${
                    active
                      ? "bg-foreground text-background shadow-pop"
                      : "bg-card text-foreground hover:-translate-y-0.5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            {filtered.length} of {telegramBots.length} bots
          </p>
        </div>

        {grouped.length === 0 ? (
          <div className="bg-card border-2 border-foreground/40 rounded-2xl p-6 text-center">
            <p className="font-heading text-lg font-bold mb-1">No bots match "{debounced}"</p>
            <p className="text-sm text-muted-foreground">Try a different keyword or clear the search.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(([cat, items]) => (
              <section key={cat} aria-label={cat}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border-2 border-foreground/80 bg-primary text-primary-foreground shadow-pop-soft">
                    {cat}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">{items.length}</span>
                  <div className="flex-1 h-0.5 bg-foreground/10 rounded-full" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {items.map((b) => {
                    const a = accentMap[b.accent] ?? accentMap.primary;
                    const tags = splitTags(b.tag);
                    return (
                      <article
                        key={b.url}
                        className="bg-card border-2 border-foreground/80 rounded-2xl shadow-pop p-5 flex flex-col transition-transform duration-300 ease-bounce hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-pop-hover"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div
                            className={`h-11 w-11 rounded-xl border-2 border-foreground/80 ${a.bg} ${a.text} flex items-center justify-center shadow-pop-soft shrink-0`}
                            aria-hidden
                          >
                            <BotIcon className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide border-2 border-foreground/80 rounded-full px-2 py-0.5 ${a.bg} ${a.text}`}
                          >
                            {highlight(b.category, debounced)}
                          </span>
                        </div>
                        <h2 className="font-heading text-xl font-extrabold mb-1">
                          {highlight(b.name, debounced)}
                        </h2>
                        <p className="text-sm text-muted-foreground flex-1">
                          {highlight(b.desc, debounced)}
                        </p>
                        {tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {tags.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-foreground/80 border border-foreground/20"
                              >
                                #{highlight(t, debounced)}
                              </span>
                            ))}
                          </div>
                        )}
                        <Button asChild className="mt-4 w-full" size="default">
                          <a
                            href={b.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${b.name} on Telegram`}
                          >
                            <Send className="w-4 h-4" /> Open in Telegram
                          </a>
                        </Button>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <section
          aria-label="Discover more"
          className="mt-10 bg-card border-2 border-dashed border-foreground/40 rounded-2xl p-5 sm:p-6"
        >
          <h2 className="font-heading text-xl font-extrabold mb-1">Want more bots?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Browse a huge directory of Telegram bots categorised by purpose — utilities, AI, games,
            crypto, and beyond.
          </p>
          <Button asChild variant="outline">
            <a
              href="https://telegrambotlist.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore Telegram Bot List (external)"
            >
              <ExternalLink className="w-4 h-4" /> Explore telegrambotlist.com
            </a>
          </Button>
        </section>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Heads up: these are third-party bots. Always review what you upload or download and avoid
          sharing sensitive personal data.
        </p>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default TelegramTweaks;
