import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { StudyModeToggle } from "./StudyModeToggle";
import { useFavorites } from "@/hooks/useFavorites";
import NotificationCenter from "./NotificationCenter";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { totalCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/resources", label: "Resources" },
    { to: "/ebooks", label: "Ebooks" },
    { to: "/apps", label: "Apps & Websites" },
    { to: "/ai", label: "AI" },
    { to: "/favorites", label: "Favorites" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
      <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 pointer-events-auto">
        <div
          className={`bg-card border-2 border-foreground/80 rounded-2xl transition-all duration-300 ${
            isScrolled ? "shadow-pop" : "shadow-pop-soft"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary border-2 border-foreground/80 shadow-pop transition-all duration-300 ease-bounce group-hover:shadow-pop-hover group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                <span className="text-base sm:text-lg font-extrabold text-primary-foreground font-heading">N</span>
              </div>
              <span className="hidden xs:inline sm:inline text-sm sm:text-lg font-bold text-foreground font-heading truncate max-w-[140px] sm:max-w-none">
                <span className="sm:hidden">Nextup</span>
                <span className="hidden sm:inline">Nextup Resources</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-pill relative ${
                    isActive(link.to)
                      ? "bg-tertiary text-tertiary-foreground font-bold border-2 border-foreground/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {link.to === "/favorites" && totalCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center border-2 border-foreground/80 animate-pop-in">
                      {totalCount > 9 ? "9+" : totalCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <NotificationCenter />
              <StudyModeToggle />
              <ThemeToggle />

              <div className="hidden md:block">
                <Button size="default" asChild>
                  <Link to="/courses">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
