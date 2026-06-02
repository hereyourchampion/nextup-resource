import { Link } from "react-router-dom";
import { Instagram, Youtube, HelpCircle, Download } from "lucide-react";
import { openIntroModal } from "@/components/IntroModal";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-card border-2 border-foreground/80 rounded-3xl p-10 shadow-pop-soft">
          <div className="flex flex-col items-center text-center">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary border-2 border-foreground/80 shadow-pop transition-all duration-300 ease-bounce group-hover:shadow-pop-hover group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                <span className="text-xl font-extrabold text-primary-foreground font-heading">N</span>
              </div>
              <span className="text-xl font-bold text-foreground font-heading">Nextup Resources</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-md font-medium">
              Empowering learners worldwide with premium courses and free resources.
            </p>
            <div className="flex gap-3">
              {[
                { href: "https://www.instagram.com/here_your_champion/", icon: Instagram, color: "bg-secondary", label: "Instagram" },
                { href: "https://www.youtube.com/@nextupstudioyt", icon: Youtube, color: "bg-destructive", label: "YouTube" },
              ].map(({ href, icon: Icon, color, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-3 rounded-full ${color} text-white border-2 border-foreground/80 shadow-pop hover:shadow-pop-hover hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-pop-active active:translate-x-0.5 active:translate-y-0.5 transition-all duration-300`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-foreground/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-muted-foreground text-sm font-medium">
              © {new Date().getFullYear()} Nextup Resources. All rights reserved.
            </p>
            <Link
              to="/faq"
              className="text-muted-foreground text-sm font-bold hover:text-primary transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/install"
              className="inline-flex items-center gap-1.5 text-muted-foreground text-sm font-bold hover:text-primary transition-colors"
            >
              <Download className="w-4 h-4" strokeWidth={2.5} />
              Install app
            </Link>
            <button
              type="button"
              onClick={openIntroModal}
              className="inline-flex items-center gap-1.5 text-muted-foreground text-sm font-bold hover:text-primary transition-colors"
            >
              <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
              Show intro
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
