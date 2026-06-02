import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BookOpen, Package, Bot, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import Stats from "./Stats";
import { useTypewriter } from "@/hooks/useTypewriter";

// Confetti shape components
const ConfettiCircle = ({ className }: { className: string }) => (
  <div className={`absolute w-6 h-6 rounded-full border-2 border-foreground/80 ${className}`} />
);
const ConfettiTriangle = ({ className }: { className: string }) => (
  <div className={`absolute w-0 h-0 ${className}`} style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '20px solid currentColor' }} />
);
const ConfettiSquare = ({ className }: { className: string }) => (
  <div className={`absolute w-5 h-5 border-2 border-foreground/80 rotate-12 ${className}`} />
);

const accentColors = ["text-primary", "text-secondary", "text-tertiary", "text-quaternary"];

const Hero = () => {
  const typewriterText = useTypewriter(["Courses", "Resources", "Ebooks", "Apps & Websites", "AI Tools"], 120, 80, 2000);

  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 dot-grid">
      {/* Decorative shapes */}
      <div className="absolute top-20 left-8 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-tertiary/20 border-2 border-foreground/10 hidden sm:block" />
      <div className="absolute bottom-32 right-12 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-secondary/15 border-2 border-foreground/10 hidden sm:block" />

      {/* Confetti decorations - hidden on mobile */}
      <ConfettiCircle className="bg-secondary/30 top-32 right-[20%] hidden lg:block" />
      <ConfettiTriangle className="text-tertiary top-40 left-[15%] hidden lg:block" />
      <ConfettiSquare className="bg-quaternary/30 bottom-40 left-[10%] hidden lg:block" />
      <ConfettiCircle className="bg-primary/20 bottom-60 right-[15%] hidden lg:block" />
      <ConfettiTriangle className="text-secondary bottom-32 right-[30%] rotate-45 hidden lg:block" />

      <div className="container px-4 py-10 md:py-32 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-card border-2 border-foreground/80 shadow-pop mb-8 animate-fade-in pop-wiggle">
            <Sparkles className="h-4 w-4 text-tertiary" strokeWidth={2.5} />
            <span>Welcome to Nextup Resources</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground mb-6 font-heading animate-fade-in delay-100">
            Explore{" "}
            <span className="text-primary">
              {typewriterText}
              <span className="animate-pulse text-secondary">|</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in delay-200 font-body">
            Discover premium courses, free resources, ebooks, apps, websites, and AI tools — all in one place. Start your learning journey today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
            <Button size="xl" asChild>
              <Link to="/courses" className="flex items-center gap-2">
                Explore Courses
                <div className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/ai" className="flex items-center gap-2">
                <Bot className="w-4 h-4" /> AI Tools
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in delay-400">
            {[
              { to: "/resources", icon: Package, label: "Resources", color: "hover:bg-quaternary hover:text-quaternary-foreground" },
              { to: "/apps", icon: Globe, label: "Apps & Websites", color: "hover:bg-secondary hover:text-secondary-foreground" },
              { to: "/courses", icon: BookOpen, label: "Courses", color: "hover:bg-tertiary hover:text-tertiary-foreground" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 border-foreground/80 bg-card shadow-pop hover:shadow-pop-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 ${item.color}`}
              >
                <item.icon className="w-4 h-4" strokeWidth={2.5} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-14 md:mt-20 w-full animate-fade-in delay-500">
            <Stats />
          </div>

          {/* Special Thanks */}
          <div className="mt-12 bg-card border-2 border-foreground/80 rounded-2xl px-6 py-4 shadow-pop-soft animate-fade-in delay-500">
            <p className="text-sm text-muted-foreground font-medium">
              Special thanks to <span className="text-primary font-bold">@techinsiderashish</span> for contributing most of the content ❤️
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
