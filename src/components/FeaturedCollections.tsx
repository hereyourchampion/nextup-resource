import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { collections } from "@/data/content";

const accentBg: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  tertiary: "bg-tertiary text-tertiary-foreground",
  quaternary: "bg-quaternary text-quaternary-foreground",
};

interface Props {
  title?: string;
  subtitle?: string;
  filterSlugs?: string[];
}

const FeaturedCollections = ({
  title = "Featured Collections",
  subtitle = "Curated bundles — every link in one place.",
  filterSlugs,
}: Props) => {
  const items = filterSlugs
    ? collections.filter((c) => filterSlugs.includes(c.slug))
    : collections;

  if (items.length === 0) return null;

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-card border-2 border-foreground/80 shadow-pop font-bold text-sm">
            <Package className="w-4 h-4" strokeWidth={2.5} />
            <span>Bundles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-heading mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-x-12 pop-stagger dashed-grid cols-2">
          {items.map((c) => (
            <Link
              key={c.slug}
              to={`/collection/${c.slug}`}
              className="pop-card group p-6 flex items-start gap-4 relative overflow-visible"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${accentBg[c.accent]} border-2 border-foreground/80 shadow-pop flex items-center justify-center text-2xl flex-shrink-0`}
              >
                {c.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {c.tagline}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-lg font-bold text-foreground font-heading group-hover:text-primary transition-colors line-clamp-2">
                  {c.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {c.description}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-foreground/70">
                  <Package className="w-3 h-3" strokeWidth={2.5} />
                  {c.items.length} items
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
