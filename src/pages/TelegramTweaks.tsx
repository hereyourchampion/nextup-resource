import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, ExternalLink, Bot as BotIcon, Sparkles } from "lucide-react";
import { updatePageMeta } from "@/lib/og-image";

type BotEntry = {

  name: string;
  desc: string;
  url: string;
  tag: string;
  accent: "primary" | "secondary" | "tertiary";
};

const bots: BotEntry[] = [
  {
    name: "Fitsman",
    desc: "Grab PC games straight from FitGirl Repacks — search, browse, and download right inside Telegram.",
    url: "https://t.me/Fitsman_bot",
    tag: "PC Games · FitGirl",
    accent: "primary",
  },
  {
    name: "Nextup File Bot",
    desc: "Store and share files of any size with a private cloud-style link. Handy for backups and quick transfers.",
    url: "https://t.me/nextupfilebot",
    tag: "File Storage",
    accent: "secondary",
  },
];

const accentMap = {
  primary: { bg: "bg-primary", text: "text-primary-foreground" },
  secondary: { bg: "bg-secondary", text: "text-secondary-foreground" },
  tertiary: { bg: "bg-tertiary", text: "text-tertiary-foreground" },
} as const;

const TelegramTweaks = () => {
  useEffect(() => {
    updatePageMeta({
      title: "Telegram Tweaks · Secret Bots — Nextup Resources",
      description:
        "A curated list of secret Telegram bots for downloading games, storing files, and discovering more useful tools.",
      url: "/telegram-tweaks",
    });
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

        <section aria-label="Recommended bots" className="grid sm:grid-cols-2 gap-4">
          {bots.map((b) => {
            const a = accentMap[b.accent];
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
