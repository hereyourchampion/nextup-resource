import Header from "@/components/Header";
import CoursesSection from "@/components/CoursesSection";
import Marquee from "@/components/Marquee";
import FeaturedCollections from "@/components/FeaturedCollections";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import { useEffect } from "react";
import { updatePageMeta, pageSEOConfigs } from "@/lib/og-image";
import { useStudyMode } from "@/hooks/useStudyMode";
import { GraduationCap } from "lucide-react";

const Courses = () => {
  const { isStudyMode } = useStudyMode();

  useEffect(() => {
    updatePageMeta(pageSEOConfigs.courses);
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
                {isStudyMode ? "Study Courses" : "All Courses"}
              </h1>
              <SquigglyUnderline color="hsl(var(--tertiary))" width={220} />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                {isStudyMode
                  ? "Focused educational courses for productive learning sessions"
                  : "Discover our complete collection of premium courses across various categories"}
              </p>
            </div>
          </div>
        </section>
        <Marquee />
        <section className="pt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <a
              href="/special-courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
            >
              💼 Special Courses — Placement Bundles →
            </a>
          </div>
        </section>
        <FeaturedCollections
          title="Special Courses & Bundles"
          subtitle="Hand-picked mega-bundles — every link in one place."
          filterSlugs={["placement-material"]}
        />
        <CoursesSection />
      </main>
      <Footer />
      <ScrollToTop />
      <BottomNav />
    </div>
  );
};

export default Courses;
