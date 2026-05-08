import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedCollections from "@/components/FeaturedCollections";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import GlobalSearch from "@/components/GlobalSearch";
import { updatePageMeta, pageSEOConfigs } from "@/lib/og-image";

const Index = () => {
  useEffect(() => {
    updatePageMeta(pageSEOConfigs.home);
    
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Nextup Resources",
      url: "https://nextup-resource.vercel.app/",
      description: "Premium courses and free learning resources for learners worldwide",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://nextup-resource.vercel.app/courses?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <Hero />
        <GlobalSearch />
        <Marquee />
        <FeaturedCollections />
      </main>
      <Footer />
      <ScrollToTop />
      <BottomNav />
    </div>
  );
};

export default Index;
