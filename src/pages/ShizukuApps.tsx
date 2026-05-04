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
import { ArrowLeft, ExternalLink, Github, Sparkles, User, Zap } from "lucide-react";
import { shizukuApps } from "@/data/shizukuApps";
import { useDebounced } from "@/hooks/useDebounced";

const PAGE_SIZE = 60;

const ShizukuApps = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 200);
  const [activeCat, setActiveCat] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = "Shizuku Apps — Privileged Android Apps Without Root";
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    shizukuApps.forEach((a) => set.add(a.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return shizukuApps.filter((a) => {
      const matchesCat = activeCat === "All" || a.category === activeCat;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q)
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
        <section className="pt-32 pb-8 dot-grid">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-secondary text-secondary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Zap className="w-4 h-4" strokeWidth={2.5} />
                <span>Awesome Shizuku</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                ⚡ Shizuku Apps
              </h1>
              <SquigglyUnderline color="hsl(var(--secondary))" width={260} />
              <p className="text-lg text-muted-foreground mt-5">
                Use system-level features on your Android device — no root needed. Curated from the awesome-shizuku list.
              </p>

              <div className="mt-7 max-w-xl mx-auto">
                <SearchBox
                  value={query}
                  onChange={setQuery}
                  placeholder="Search apps, authors, descriptions..."
                  ariaLabel="Search Shizuku apps"
                />
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto px-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 border-foreground/80 transition-all ${
                      activeCat === cat
                        ? "bg-secondary text-secondary-foreground shadow-pop"
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
              <p className="text-center text-muted-foreground">No apps match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {shown.map((app, idx) => (
                  <div key={`${app.url}-${idx}`} className="pop-card p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-secondary text-secondary-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                        <Zap className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-primary text-primary-foreground border-2 border-foreground/80 text-[10px] font-bold rounded-full">
                          {app.category}
                        </Badge>
                        {app.license && (
                          <Badge className="bg-muted text-foreground border-2 border-foreground/30 text-[10px] font-bold rounded-full">
                            {app.license}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground font-heading mb-1 break-words">
                      {app.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                      <User className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <span className="font-semibold">{app.author}</span>
                    </div>
                    {app.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{app.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-auto">
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-secondary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-sm"
                      >
                        <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                        <span>Open repo</span>
                      </a>
                      <CopyLinkButton url={app.url} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {visible < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
                >
                  Load more ({filtered.length - visible} remaining)
                </button>
              </div>
            )}

            <div className="max-w-3xl mx-auto mt-12 p-6 bg-card border-2 border-foreground/80 rounded-2xl shadow-pop text-center">
              <p className="text-base font-bold text-foreground font-heading">
                Catalog sourced from{" "}
                <a
                  href="https://github.com/timschneeb/awesome-shizuku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary underline decoration-wavy underline-offset-4"
                >
                  awesome-shizuku
                </a>
                . Learn about Shizuku at{" "}
                <a
                  href="https://shizuku.rikka.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary underline decoration-wavy underline-offset-4"
                >
                  shizuku.rikka.app
                </a>
                .
              </p>
            </div>

            <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/foss-apps"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-tertiary text-tertiary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
              >
                <Github className="w-4 h-4" strokeWidth={2.5} /> FOSS Apps
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

export default ShizukuApps;
