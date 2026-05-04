import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import PlatformBadge from "@/components/PlatformBadge";
import CopyLinkButton from "@/components/CopyLinkButton";
import { ArrowLeft, ExternalLink, Sparkles, Package } from "lucide-react";
import { getCollection } from "@/data/content";

const accentMap = {
  primary: { bg: "bg-primary", text: "text-primary-foreground", color: "hsl(var(--primary))" },
  secondary: { bg: "bg-secondary", text: "text-secondary-foreground", color: "hsl(var(--secondary))" },
  tertiary: { bg: "bg-tertiary", text: "text-tertiary-foreground", color: "hsl(var(--tertiary))" },
  quaternary: { bg: "bg-quaternary", text: "text-quaternary-foreground", color: "hsl(var(--quaternary))" },
} as const;

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = slug ? getCollection(slug) : undefined;

  useEffect(() => {
    if (collection) {
      document.title = `${collection.title} — Nextup Resources`;
    } else {
      document.title = "Collection not found — Nextup Resources";
    }
  }, [collection]);

  if (!collection) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
          <div className="bg-card border-2 border-foreground/80 rounded-2xl p-10 max-w-md mx-auto shadow-pop">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-extrabold font-heading mb-2">Collection not found</h1>
            <p className="text-muted-foreground mb-6">The collection you’re looking for doesn’t exist.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back home
            </Link>
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  const accent = accentMap[collection.accent];

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-12 dot-grid">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in max-w-3xl mx-auto">
              <div className={`inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full ${accent.bg} ${accent.text} border-2 border-foreground/80 shadow-pop font-bold text-sm`}>
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                <span>{collection.tagline}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                <span className="mr-3">{collection.emoji}</span>{collection.title}
              </h1>
              <SquigglyUnderline color={accent.color} width={240} />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-5">
                {collection.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-foreground/30 text-xs font-bold text-muted-foreground">
                <Package className="w-3.5 h-3.5" strokeWidth={2.5} />
                {collection.items.length} items
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-16 pop-stagger dashed-grid cols-3">
              {collection.items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pop-card group p-5 flex flex-col h-full relative overflow-visible"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full ${accent.bg} ${accent.text} border-2 border-foreground/80 flex items-center justify-center font-extrabold text-sm shadow-pop flex-shrink-0`}>
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-heading group-hover:text-primary transition-colors mb-1.5">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground text-sm flex-1">{item.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <PlatformBadge link={item.link} className="!relative !bottom-auto !right-auto inline-flex" />
                    <CopyLinkButton url={item.link} />
                  </div>
                </a>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card text-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back home
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

export default CollectionPage;
