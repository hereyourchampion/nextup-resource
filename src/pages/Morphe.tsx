import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import SearchBox from "@/components/SearchBox";
import CopyLinkButton from "@/components/CopyLinkButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  Download,
  Package,
  ExternalLink,
  SearchX,
  RefreshCw,
} from "lucide-react";
import { useMorpheReleases } from "@/hooks/useMorpheReleases";
import { useDebounced } from "@/hooks/useDebounced";
import { toast } from "sonner";

const PAGE_SIZE = 24;

const variantLabel: Record<string, { label: string; cls: string }> = {
  morphe: { label: "Morphe", cls: "bg-primary text-primary-foreground" },
  "morphe-module": { label: "Morphe · Module", cls: "bg-secondary text-secondary-foreground" },
  "morphe-foss": { label: "Morphe · FOSS", cls: "bg-tertiary text-tertiary-foreground" },
  revanced: { label: "ReVanced", cls: "bg-secondary text-secondary-foreground" },
  "revanced-module": { label: "ReVanced · Module", cls: "bg-tertiary text-tertiary-foreground" },
};

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

const Morphe = () => {
  const { loading, error, apps, latestBuild, totalReleases } = useMorpheReleases();
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 200);
  const [activeVariant, setActiveVariant] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    document.title = "Morphe — Patched Android Apps by nullcpy/rvb";
  }, []);

  const variants = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => set.add(a.variant));
    return ["All", ...Array.from(set).sort()];
  }, [apps]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return apps.filter((a) => {
      if (activeVariant !== "All" && a.variant !== activeVariant) return false;
      if (!q) return true;
      return (
        a.displayName.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.variant.toLowerCase().includes(q)
      );
    });
  }, [debounced, apps, activeVariant]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [debounced, activeVariant]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-8 dot-grid violet-haze">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-secondary text-secondary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                <span>Morphe Builds</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                ✨ Morphe — Patched Apps
              </h1>
              <SquigglyUnderline color="hsl(var(--secondary))" width={300} />
              <p className="text-lg text-muted-foreground mt-5">
                Fresh Morphe & ReVanced builds straight from{" "}
                <a
                  href="https://github.com/nullcpy/rvb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline decoration-wavy underline-offset-4"
                >
                  nullcpy/rvb
                </a>{" "}
                — auto-updated via GitHub Releases.
              </p>

              <div className="mt-7 max-w-xl mx-auto">
                <SearchBox
                  value={query}
                  onChange={setQuery}
                  placeholder="Search apps (e.g. Telegram, Reddit, Fing)..."
                  ariaLabel="Search Morphe apps"
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                {latestBuild && (
                  <span className="px-3 py-1 rounded-full bg-card border-2 border-foreground/80 shadow-pop-soft text-foreground inline-flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Latest build #{latestBuild}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full border-2 border-foreground/30 text-muted-foreground inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {apps.length} apps · {totalReleases} releases
                </span>
                <a
                  href="https://nullcpy.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full bg-card border-2 border-foreground/80 shadow-pop-soft text-foreground inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Official site
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {error ? (
              <div className="max-w-md mx-auto text-center pop-card p-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-destructive text-destructive-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                  <RefreshCw className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">Couldn't load builds</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={() => location.reload()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-sm"
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="pop-card p-5 space-y-3">
                    <Skeleton className="h-10 w-10 rounded-2xl" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : shown.length === 0 ? (
              <div className="max-w-md mx-auto text-center pop-card p-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary text-secondary-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                  <SearchX className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">No apps match</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try a different keyword — or clear the search to see everything.
                </p>
                <button
                  onClick={() => setQuery("")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-sm"
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {shown.map((app) => {
                  const v = variantLabel[app.variant] ?? {
                    label: app.variant,
                    cls: "bg-card text-foreground",
                  };
                  return (
                    <div key={`${app.slug}-${app.variant}`} className="pop-card p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-secondary text-secondary-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                          <Package className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <Badge
                          className={`${v.cls} border-2 border-foreground/80 text-[10px] font-bold rounded-full`}
                        >
                          {v.label}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground font-heading mb-1 break-words">
                        {app.displayName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        v{app.version} · build #{app.buildTag}
                      </p>

                      <div className="space-y-2 mt-auto">
                        {app.assets.map((a) => (
                          <div
                            key={a.name}
                            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-muted/40 border-2 border-foreground/20"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="px-2 py-0.5 rounded-full bg-card text-foreground text-[10px] font-bold border border-foreground/30 shrink-0">
                                {a.arch}
                              </span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">
                                {a.ext}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {formatSize(a.size)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => toast.success("Starting download…")}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-xs"
                              >
                                <Download className="w-3 h-3" strokeWidth={2.5} />
                              </a>
                              <CopyLinkButton url={a.url} className="!px-2 !py-1.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && !error && (
              <div className="text-center mt-10">
                {visible < filtered.length ? (
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
                  >
                    Load more ({filtered.length - visible} remaining)
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
            )}

            <div className="max-w-3xl mx-auto mt-12 p-6 bg-card border-2 border-foreground/80 rounded-2xl shadow-pop text-center">
              <p className="text-base font-bold text-foreground font-heading">
                Builds sourced from{" "}
                <a
                  href="https://github.com/nullcpy/rvb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline decoration-wavy underline-offset-4"
                >
                  nullcpy/rvb
                </a>{" "}
                — see the{" "}
                <a
                  href="https://nullcpy.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary underline decoration-wavy underline-offset-4"
                >
                  catalog site
                </a>{" "}
                for previews. ❤️
              </p>
            </div>

            <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/foss-apps"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-tertiary text-tertiary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
              >
                🧑‍💻 FOSS Apps →
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

export default Morphe;
