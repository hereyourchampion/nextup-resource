import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import SearchBox from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { Send, ExternalLink, Bot as BotIcon, Sparkles } from "lucide-react";
import { updatePageMeta } from "@/lib/og-image";
import { telegramBots, telegramBotCategories } from "@/data/telegramBots";

const accentMap = {
  primary: { bg: "bg-primary", text: "text-primary-foreground" },
  secondary: { bg: "bg-secondary", text: "text-secondary-foreground" },
  tertiary: { bg: "bg-tertiary", text: "text-tertiary-foreground" },
} as const;

const TelegramTweaks = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    updatePageMeta({
      title: "Telegram Tweaks · Secret Bots — Nextup Resources",
      description:
        "A curated, searchable list of secret Telegram bots for downloads, file tools, music, AI assistants and more.",
      url: "/telegram-tweaks",
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return telegramBots;
    return telegramBots.filter((b) =>
      `${b.name} ${b.desc} ${b.tag} ${b.category}`.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof telegramBots>();
    for (const cat of telegramBotCategories) map.set(cat, []);
    for (const b of filtered) {
      if (!map.has(b.category)) map.set(b.category, []);
      map.get(b.category)!.push(b);
    }
    return Array.from(map.entries())
      .filter(([, items]) => items.length > 0)
      .map(([cat, items]) => [cat, [...items].sort((a, b) => a.name.localeCompare(b.name))] as const);
  }, [filtered]);

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

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search bots by name, tag or category…"
            ariaLabel="Search Telegram bots"
          />
          <p className="mt-2 text-xs text-muted-foreground text-center">
            {filtered.length} of {telegramBots.length} bots
          </p>
        </div>

        {grouped.length === 0 ? (
          <div className="bg-card border-2 border-foreground/40 rounded-2xl p-6 text-center">
            <p className="font-heading text-lg font-bold mb-1">No bots match "{query}"</p>
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
                    return (
                      <article
                        key={b.url}
                        className="bg-card border-2 border-foreground/80 rounded-2xl shadow-pop p-5 flex flex-col transition-transform duration-300 ease-bounce hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-pop-hover"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div
                            className={`h-11 w-11 rounded-xl border-2 border-foreground/80 ${a.bg} ${a.text} flex items-center justify-center shadow-pop-soft`}
                            aria-hidden
                          >
                            <BotIcon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground border-2 border-foreground/30 rounded-full px-2 py-0.5">
                            {b.tag}
                          </span>
                        </div>
                        <h2 className="font-heading text-xl font-extrabold mb-1">{b.name}</h2>
                        <p className="text-sm text-muted-foreground flex-1">{b.desc}</p>
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
