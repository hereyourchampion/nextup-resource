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
import { ArrowLeft, Briefcase, ExternalLink, FolderOpen, Package } from "lucide-react";
import { getCollection } from "@/data/content";
import { useDebounced } from "@/hooks/useDebounced";

const SpecialCourses = () => {
  const collection = getCollection("placement-material");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 200);

  useEffect(() => {
    document.title = "Special Courses — Company Placement Bundles";
  }, []);

  const items = useMemo(() => {
    if (!collection) return [];
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return collection.items;
    return collection.items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.description ?? "").toLowerCase().includes(q),
    );
  }, [collection, debouncedQuery]);

  if (!collection) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-10 dot-grid">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Briefcase className="w-4 h-4" strokeWidth={2.5} />
                <span>Special Courses</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                💼 Company Placement Bundles
              </h1>
              <SquigglyUnderline color="hsl(var(--primary))" width={260} />
              <p className="text-lg text-muted-foreground mt-5">
                Premium paid placement material for top companies and aptitude exams — all in one place.
              </p>

              <div className="mt-7 max-w-xl mx-auto">
                <SearchBox
                  value={query}
                  onChange={setQuery}
                  placeholder="Search companies (TCS, Infosys, GATE...)"
                  ariaLabel="Search placement bundles"
                />
              </div>

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-foreground/30 text-xs font-bold text-muted-foreground">
                <Package className="w-3.5 h-3.5" strokeWidth={2.5} />
                {items.length} of {collection.items.length} bundles
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground">No bundles match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pop-stagger">
                {items.map((item, idx) => (
                  <div key={idx} className="pop-card p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 flex items-center justify-center font-extrabold text-sm shadow-pop">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      {item.badge && (
                        <Badge className="bg-quaternary text-quaternary-foreground border-2 border-foreground/80 text-[10px] font-bold rounded-full">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground font-heading mb-1.5">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-muted-foreground text-sm flex-1 mb-4">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-auto">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-sm"
                      >
                        <FolderOpen className="w-4 h-4" strokeWidth={2.5} />
                        <span>{item.badge === "Drive" ? "Open folder" : "Access link"}</span>
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </a>
                      <CopyLinkButton url={item.link} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card text-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back to courses
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

export default SpecialCourses;
