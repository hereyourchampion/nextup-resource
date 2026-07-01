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
        <section className="pb-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/guru-mann-fitness"
              className="group block pop-card overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-tertiary/10"
            >
              <div className="flex items-center gap-4 p-5">
                <div className="w-14 h-14 rounded-2xl bg-primary border-2 border-foreground/80 shadow-pop flex items-center justify-center text-2xl shrink-0">
                  <Dumbbell className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Exclusive Collection</div>
                  <h3 className="text-lg sm:text-xl font-extrabold font-heading leading-tight">Guru Mann Fitness Books</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">Nutrition & training ebooks for bulking, cutting and lean physiques.</p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary shrink-0">
                  Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                </div>
              </div>
            </Link>
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
