import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Dumbbell, Download, BookOpen, ExternalLink } from "lucide-react";

const guruMannBooks = [
  {
    title: "Cholesterol Diet Ebook",
    description:
      "A detailed nutrition guide by Guru Mann focused on managing and reducing cholesterol naturally through diet. Covers food lists, meal plans, and lifestyle tips.",
    category: "Health & Nutrition",
    emoji: "🫀",
    link: "https://t.me/nextupfilebot?start=BQADAQADPA4AAmXlEEZreHLuYUZcbRYE",
    color: "hsl(var(--primary))",
  },
  {
    title: "Pure Mass Nutrition Plan",
    description:
      "Guru Mann's complete bulking nutrition plan for maximum muscle gain. Includes calorie targets, macros, meal timings, and supplement recommendations.",
    category: "Muscle Building",
    emoji: "💪",
    link: "https://t.me/nextupfilebot?start=BQADAQADRg4AAmXlEEZAIDwLsrJ9NBYE",
    color: "hsl(var(--secondary))",
  },
  {
    title: "Shrredd Next Level Nutrition Plan",
    description:
      "Advanced fat loss and shredding plan by Guru Mann. Designed for those who want to go beyond basic cutting — includes carb cycling, cheat meal strategy, and cardio guidelines.",
    category: "Fat Loss",
    emoji: "🔥",
    link: "https://t.me/nextupfilebot?start=BQADAQADSQ4AAmXlEEZWOb75-5SmhhYE",
    color: "hsl(var(--tertiary))",
  },
  {
    title: "Lean Mode Nutrition Plan",
    description:
      "A balanced plan for building a lean, athletic physique by Guru Mann. Focuses on clean eating, steady fat loss while preserving muscle, and sustainable habits.",
    category: "Lean Physique",
    emoji: "⚡",
    link: "https://t.me/nextupfilebot?start=BQADAQADUg4AAmXlEEZDcorucoTjtBYE",
    color: "hsl(var(--quaternary))",
  },
];

const GurMannFitnessBooks = () => {
  useEffect(() => {
    document.title = "Guru Mann Fitness Books — Nextup Resources";
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-12 dot-grid">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              {/* Back link */}
              <div className="flex justify-center mb-6">
                <Link
                  to="/ebooks"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  Back to Ebooks
                </Link>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Dumbbell className="w-4 h-4" strokeWidth={2.5} />
                <span>Fitness Collection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                Guru Mann Fitness Books
              </h1>
              <SquigglyUnderline color="hsl(var(--primary))" width={260} />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                Free fitness & nutrition plans by India's top fitness coach — Guru Mann. Download and transform your body.
              </p>

              {/* Stats strip */}
              <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                {[
                  { label: "Free Plans", value: "4" },
                  { label: "Expert", value: "Guru Mann" },
                  { label: "Access Via", value: "Telegram" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="px-5 py-3 bg-card border-2 border-foreground/80 rounded-2xl shadow-pop-soft text-center min-w-[100px]"
                  >
                    <div className="text-lg font-extrabold text-foreground font-heading">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pop-stagger">
              {guruMannBooks.map((book, index) => (
                <a
                  key={index}
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="pop-card overflow-hidden h-full">
                    {/* Card top color bar + emoji */}
                    <div
                      className="relative h-44 flex items-center justify-center"
                      style={{ background: `${book.color}22` }}
                    >
                      {/* Decorative dots */}
                      <div
                        className="absolute top-3 left-3 w-3 h-3 rounded-full border-2 border-foreground/40"
                        style={{ backgroundColor: book.color }}
                      />
                      <div
                        className="absolute top-3 left-9 w-2 h-2 rounded-full border-2 border-foreground/40"
                        style={{ backgroundColor: book.color, opacity: 0.5 }}
                      />

                      {/* Emoji icon */}
                      <div
                        className="w-20 h-20 rounded-2xl border-2 border-foreground/80 shadow-pop flex items-center justify-center text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                        style={{ backgroundColor: `${book.color}33` }}
                      >
                        {book.emoji}
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 bg-card border-2 border-foreground/80 shadow-pop">
                          <Download className="w-4 h-4" strokeWidth={2.5} /> Get Free Plan
                        </span>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-tertiary text-tertiary-foreground border-2 border-foreground/80 text-xs font-bold px-3 py-1 flex items-center gap-1 rounded-full">
                          <BookOpen className="w-3 h-3" strokeWidth={2.5} /> {book.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground font-heading group-hover:text-primary transition-colors duration-300 leading-tight">
                          {book.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" strokeWidth={2} />
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-3">{book.description}</p>

                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-xs font-semibold text-muted-foreground">by Guru Mann</span>
                        <span className="ml-auto text-xs font-semibold text-primary">Free Download →</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-16 text-center">
              <div className="inline-block bg-card border-2 border-foreground/80 rounded-2xl px-6 py-4 shadow-pop-soft">
                <p className="text-sm text-muted-foreground">
                  All plans open via Telegram bot.{" "}
                  <span className="font-semibold text-foreground">Install Telegram</span> to access.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
      <BottomNav />
    </div>
  );
};

export default GurMannFitnessBooks;
