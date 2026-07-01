import Header from "@/components/Header";
import EbooksSection from "@/components/EbooksSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import { useEffect } from "react";
import { useStudyMode } from "@/hooks/useStudyMode";
import { GraduationCap, Dumbbell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Ebooks = () => {
  const { isStudyMode } = useStudyMode();

  useEffect(() => {
    document.title = isStudyMode ? "Study Ebooks - Nextup Resources" : "Free Ebooks - Nextup Resources";
  }, [isStudyMode]);

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
                {isStudyMode ? "Study Ebooks" : "Free Ebooks"}
              </h1>
              <SquigglyUnderline color="hsl(var(--quaternary))" width={200} />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                {isStudyMode
                  ? "Educational ebooks and guides for focused learning"
                  : "Download premium ebooks completely free."}
              </p>
            </div>
          </div>
        </section>
        <EbooksSection />
      </main>
      <Footer />
      <ScrollToTop />
      <BottomNav />
    </div>
  );
};

export default Ebooks;
