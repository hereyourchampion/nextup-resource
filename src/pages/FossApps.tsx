import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Heart, Search, Sparkles, User } from "lucide-react";
import { fossApps } from "@/data/fossApps";

const tagColor = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "root":
      return "bg-secondary text-secondary-foreground";
    case "pentesting":
      return "bg-tertiary text-tertiary-foreground";
    case "website":
      return "bg-quaternary text-quaternary-foreground";
    case "list":
    case "gitlab":
      return "bg-card text-foreground";
    default:
      return "bg-primary text-primary-foreground";
  }
};

const FossApps = () => {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");

  useEffect(() => {
    document.title = "FOSS Apps — Open-Source Android Apps";
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    fossApps.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fossApps.filter((a) => {
      const matchesTag = activeTag === "All" || a.tags.includes(activeTag);
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [query, activeTag]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-10 dot-grid">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-tertiary text-tertiary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Github className="w-4 h-4" strokeWidth={2.5} />
                <span>FOSS Apps</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                🧑‍💻 Open-Source Android Apps
              </h1>
              <SquigglyUnderline color="hsl(var(--tertiary))" width={260} />
              <p className="text-lg text-muted-foreground mt-5">
                Hand-picked free & open-source Android apps with author credits and direct repo links.
              </p>

              <div className="mt-7 max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" strokeWidth={2.5} />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search apps, authors, tags..."
                  className="pl-12"
                  aria-label="Search FOSS apps"
                />
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-foreground/80 transition-all ${
                      activeTag === tag
                        ? "bg-primary text-primary-foreground shadow-pop"
                        : "bg-card text-foreground hover:-translate-y-0.5"
                    }`}
                  >
                    {tag}
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
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground">No apps match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pop-stagger">
                {filtered.map((app, idx) => (
                  <div key={idx} className="pop-card p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-tertiary text-tertiary-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                        <Github className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {app.tags.map((t) => (
                          <Badge key={t} className={`${tagColor(t)} border-2 border-foreground/80 text-[10px] font-bold rounded-full`}>
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground font-heading mb-1 break-words">
                      {app.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                      <User className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <span className="font-semibold">{app.author}</span>
                    </div>
                    {app.recommendedBy && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-primary mb-2">
                        <Heart className="w-3 h-3 fill-current" strokeWidth={2.5} />
                        Recommended by @{app.recommendedBy}
                      </div>
                    )}
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 mt-auto px-4 py-2.5 rounded-full bg-tertiary text-tertiary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-sm"
                    >
                      <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                      <span>Open repo</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="max-w-3xl mx-auto mt-12 p-6 bg-card border-2 border-foreground/80 rounded-2xl shadow-pop text-center">
              <p className="text-base font-bold text-foreground font-heading">
                Thank you soooooo muchhhhh to{" "}
                <span className="text-primary">@Aryanski</span>, for recommending these apppssss 🥸😎🫪🫪
              </p>
            </div>

            <div className="text-center mt-10">
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
