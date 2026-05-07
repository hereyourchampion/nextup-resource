import Header from "@/components/Header";
import AppsSection from "@/components/AppsSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import FeaturedCollections from "@/components/FeaturedCollections";
import { useEffect, useState } from "react";
import { updatePageMeta, pageSEOConfigs } from "@/lib/og-image";
import { useStudyMode } from "@/hooks/useStudyMode";
import { GraduationCap, Globe, Smartphone } from "lucide-react";
import { allWebsites } from "@/data/content";

const Apps = () => {
  const { isStudyMode } = useStudyMode();
  const [activeTab, setActiveTab] = useState<"apps" | "websites">("apps");

  useEffect(() => {
    updatePageMeta(pageSEOConfigs.apps);
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-12 dot-grid">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              {isStudyMode && (
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                  <GraduationCap className="w-4 h-4" strokeWidth={2.5} />
                  <span>Study Mode Active</span>
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                {isStudyMode ? "Productivity Apps" : "Apps & Websites"}
              </h1>
              <SquigglyUnderline color="hsl(var(--primary))" width={260} />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4 mb-8">
                {isStudyMode
                  ? "Productivity and utility apps for focused work sessions"
                  : "Download premium apps and explore curated learning websites."}
              </p>

              <div className="inline-flex gap-2 bg-card border-2 border-foreground/80 rounded-full p-1.5 shadow-pop-soft">
                <button
                  onClick={() => setActiveTab("apps")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeTab === "apps"
                      ? "bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Smartphone className="w-4 h-4" strokeWidth={2.5} /> Apps
                </button>
                <button
                  onClick={() => setActiveTab("websites")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeTab === "websites"
                      ? "bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe className="w-4 h-4" strokeWidth={2.5} /> Websites
                </button>
              </div>
            </div>
          </div>
        </section>

        {activeTab === "apps" ? (
          <AppsSection />
        ) : (
          <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pop-stagger">
                {allWebsites.map((site) => (
                  <a
                    key={site.title}
                    href={site.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pop-card overflow-hidden group"
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img src={site.image} alt={site.title} className="w-full h-full object-cover transition-transform duration-500 ease-bounce group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-card border-2 border-foreground/80 text-foreground">{site.category}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 text-2xl">{site.emoji}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-foreground mb-1 font-heading group-hover:text-primary transition-colors">{site.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{site.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-wrap justify-center gap-3">
            <a
              href="/foss-apps"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-tertiary text-tertiary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
            >
              🧑‍💻 FOSS Apps — Open-Source Android →
            </a>
            <a
              href="/shizuku-apps"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
            >
              ⚡ Shizuku Apps — Power Without Root →
            </a>
            <a
              href="/morphe"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
            >
              ✨ Morphe — Patched Builds →
            </a>
            <a
              href="/material-you"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-tertiary text-tertiary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
            >
              🎨 Material You — Designed Apps →
            </a>
          </div>
        </section>
        <FeaturedCollections
          title="Game Bundles"
          subtitle="All versions of your favorite games — in one place."
          filterSlugs={["gta-collection"]}
        />
      </main>
      <Footer />
      <ScrollToTop />
      <BottomNav />
    </div>
  );
};

export default Apps;
