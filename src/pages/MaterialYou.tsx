import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import SearchBox from "@/components/SearchBox";
import CopyLinkButton from "@/components/CopyLinkButton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Layers, Sparkles, SearchX, ExternalLink } from "lucide-react";
import { materialYouApps } from "@/data/materialYouApps";
import { useDebounced } from "@/hooks/useDebounced";
import { toast } from "sonner";

const PAGE_SIZE = 60;

const badgeColor = (b: string) => {
  if (b.startsWith("MD3E")) return "bg-primary text-primary-foreground";
  if (b.startsWith("MDY")) return "bg-secondary text-secondary-foreground";
  if (b.startsWith("MY")) return "bg-tertiary text-tertiary-foreground";
  return "bg-card text-foreground";
};

const tagColor = (t: string) => {
  if (t === "FOSS") return "bg-tertiary text-tertiary-foreground";
  if (t === "MOD") return "bg-secondary text-secondary-foreground";
  if (t === "💰") return "bg-card text-foreground";
  return "bg-muted text-foreground";
};

const MaterialYou = () => {
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 200);
  const [activeCat, setActiveCat] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    document.title = "Material You — Apps designed for Material You";
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    materialYouApps.forEach((a) => set.add(a.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return materialYouApps.filter((a) => {
      if (activeCat !== "All" && a.category !== activeCat) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [debounced, activeCat]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [debounced, activeCat]);

  const shown = filtered.slice(0, visible);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisible((v) => v + PAGE_SIZE);
      setLoadingMore(false);
    }, 350);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-8 dot-grid violet-haze">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-tertiary text-tertiary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Layers className="w-4 h-4" strokeWidth={2.5} />
                <span>Material You</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                🎨 Material You Apps
              </h1>
              <SquigglyUnderline color="hsl(var(--tertiary))" width={300} />
              <p className="text-lg text-muted-foreground mt-5">
                Curated Android apps that fully embrace Material You design — sourced from the
                community-maintained{" "}
                <a
                  href="https://github.com/nyas1/Material-You-app-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline decoration-wavy underline-offset-4"
                >
                  nyas1/Material-You-app-list
                </a>
                .
              </p>

              <div className="mt-7 max-w-xl mx-auto">
                <SearchBox
                  value={query}
                  onChange={setQuery}
                  placeholder="Search apps, authors, tags…"
                  ariaLabel="Search Material You apps"
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
                {filtered.length} apps · {materialYouApps.length} total
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
                  Try a different keyword or pick another category.
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
                  <div
                    key={`${app.url}-${idx}`}
                    className="pop-card p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-tertiary text-tertiary-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop shrink-0">
                        <Layers className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <Badge
                        className={`${badgeColor(app.badge)} border-2 border-foreground/80 text-[10px] font-bold rounded-full shrink-0`}
                      >
                        {app.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-foreground font-heading mb-1 break-words">
                      {app.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {app.author} · {app.category}
                    </p>

                    {app.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {app.tags.map((t) => (
                          <span
                            key={t}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border-2 border-foreground/40 ${tagColor(t)}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-auto">
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => toast.success("Opening link…")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Open
                      </a>
                      <CopyLinkButton url={app.url} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              {visible < filtered.length ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform disabled:opacity-70 disabled:translate-y-0 disabled:cursor-wait"
                >
                  {loadingMore ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-foreground/80 border-t-transparent animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>Load more ({filtered.length - visible} remaining)</>
                  )}
                </button>
              ) : filtered.length > PAGE_SIZE ? (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted text-muted-foreground font-bold border-2 border-foreground/30 cursor-not-allowed"
                >
                  ✓ All {filtered.length} apps shown
                </button>
              ) : null}
            </div>

            <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/morphe"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
              >
                ✨ Morphe Builds →
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

export default MaterialYou;
