import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import SearchBox from "@/components/SearchBox";
import FossAppCard from "@/components/FossAppCard";
import { ArrowLeft, Github, Sparkles, SearchX } from "lucide-react";
import { fossListApps } from "@/data/fossList";
import { useDebounced } from "@/hooks/useDebounced";

const PAGE_SIZE = 60;

const FossApps = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 200);
  const [activeCat, setActiveCat] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = "FOSS Apps — Free & Open-Source Android Apps";
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    fossListApps.forEach((a) => set.add(a.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return fossListApps.filter((a) => {
      const matchesCat = activeCat === "All" || a.category === activeCat;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [debouncedQuery, activeCat]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [debouncedQuery, activeCat]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-8 dot-grid violet-haze">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-tertiary text-tertiary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Github className="w-4 h-4" strokeWidth={2.5} />
                <span>FOSS Apps</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                🧑‍💻 Free & Open-Source Android
              </h1>
              <SquigglyUnderline color="hsl(var(--tertiary))" width={300} />
              <p className="text-lg text-muted-foreground mt-5">
                A curated list of free, libre & open-source Android apps — sourced from the community Android-FOSS catalog.
              </p>

              <div className="mt-7 max-w-xl mx-auto">
                <SearchBox
                  value={query}
                  onChange={setQuery}
                  placeholder="Search apps, authors, categories..."
                  ariaLabel="Search FOSS apps"
                />
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto px-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 border-foreground/80 transition-all ${
                      activeCat === cat
                        ? "bg-primary text-primary-foreground shadow-pop"
                        : "bg-card text-foreground hover:-translate-y-0.5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-foreground/30 text-xs font-bold text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                {filtered.length} apps
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {shown.length === 0 ? (
              <div className="max-w-md mx-auto text-center pop-card p-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-tertiary text-tertiary-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                  <SearchX className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">No apps found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try a different keyword or pick another category to explore.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveCat("All");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-sm"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {shown.map((app, idx) => (
                  <FossAppCard
                    key={`${app.url}-${idx}`}
                    name={app.name}
                    author={app.author}
                    url={app.url}
                    category={app.category}
                  />
                ))}
              </div>
            )}

            {visible < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
                >
                  Load more ({filtered.length - visible} remaining)
                </button>
              </div>
            )}

            <div className="max-w-3xl mx-auto mt-12 p-6 bg-card border-2 border-foreground/80 rounded-2xl shadow-pop text-center">
              <p className="text-base font-bold text-foreground font-heading">
                Catalog sourced from{" "}
                <a
                  href="https://github.com/offa/android-foss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline decoration-wavy underline-offset-4"
                >
                  offa/android-foss
                </a>{" "}
                — a community-maintained list of FOSS Android apps. ❤️
              </p>
            </div>

            <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/shizuku-apps"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
              >
                ⚡ Explore Shizuku Apps →
              </Link>
              <Link
                to="/apps"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card text-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back to apps
              </Link>
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

export default FossApps;
