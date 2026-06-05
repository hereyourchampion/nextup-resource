import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Send, ExternalLink, Bot as BotIcon, Sparkles, RefreshCw } from "lucide-react";
import { updatePageMeta } from "@/lib/og-image";

// ─────────────────────────────────────────────────────────────
// Change this URL to your GitHub raw JSON file
// Format: https://raw.githubusercontent.com/USERNAME/REPO/main/telegram-bots.json
// ─────────────────────────────────────────────────────────────
const BOTS_JSON_URL =
  "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/telegram-bots.json";

type BotEntry = {
  name: string;
  desc: string;
  url: string;
  tag: string;
  accent: "primary" | "secondary" | "tertiary";
};

const accentMap = {
  primary: { bg: "bg-primary", text: "text-primary-foreground" },
  secondary: { bg: "bg-secondary", text: "text-secondary-foreground" },
  tertiary: { bg: "bg-tertiary", text: "text-tertiary-foreground" },
} as const;

// ─────────────────────────────────────────────────────────────
// Skeleton loader — matches the card layout
// ─────────────────────────────────────────────────────────────
const BotCardSkeleton = () => (
  <div className="bg-card border-2 border-foreground/20 rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <Skeleton className="h-11 w-11 rounded-xl bg-muted/50" />
      <Skeleton className="h-5 w-24 rounded-full bg-muted/40" />
    </div>
    <Skeleton className="h-6 w-1/2 bg-muted/50" />
    <Skeleton className="h-4 w-full bg-muted/40" />
    <Skeleton className="h-4 w-4/5 bg-muted/40" />
    <Skeleton className="h-10 w-full rounded-lg bg-primary/20 mt-2" />
  </div>
);

const TelegramTweaks = () => {
  const [bots, setBots] = useState<BotEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadBots = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(BOTS_JSON_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BotEntry[] = await res.json();
      setBots(data);
    } catch (e) {
      console.error("Failed to load bots:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updatePageMeta({
      title: "Telegram Tweaks · Secret Bots — Nextup Resources",
      description:
        "A curated list of secret Telegram bots for downloading games, storing files, and discovering more useful tools.",
      url: "/telegram-tweaks",
    });
    loadBots();
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-12 dot-grid">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 pt-24 sm:pt-28">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 bg-tertiary text-tertiary-foreground border-2 border-foreground/80 rounded-full px-3 py-1 text-xs font-bold shadow-pop-soft mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Telegram Tweaks
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold leading-tight">
            Secret Telegram Bots
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl">
            Hand-picked Telegram bots that quietly do a lot — games, file storage and more. Tap any
            card to open the bot in Telegram.
          </p>
        </header>

        {/* ── Loading State ── */}
        {loading && (
          <section className="grid sm:grid-cols-2 gap-4">
            <BotCardSkeleton />
            <BotCardSkeleton />
            <BotCardSkeleton />
            <BotCardSkeleton />
          </section>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div className="bg-card border-2 border-foreground/40 rounded-2xl p-6 text-center">
            <p className="font-heading text-lg font-bold mb-1">Couldn't load bots</p>
            <p className="text-sm text-muted-foreground mb-4">
              Failed to fetch from GitHub. Check your connection or try again.
            </p>
            <Button variant="outline" onClick={loadBots}>
              <RefreshCw className="w-4 h-4" /> Retry
            </Button>
          </div>
        )}

        {/* ── Bot Cards ── */}
        {!loading && !error && (
          <section aria-label="Recommended bots" className="grid sm:grid-cols-2 gap-4">
            {bots.map((b) => {
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
          </section>
        )}

        <section
          aria-label="Discover more"
          className="mt-8 bg-card border-2 border-dashed border-foreground/40 rounded-2xl p-5 sm:p-6"
        >
          <h2 className="font-heading text-xl font-extrabold mb-1">Want more bots?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Browse a huge directory of Telegram bots categorized by purpose — utilities, AI, games,
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

        <p className="text-xs text-muted-foreground mt-6">
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