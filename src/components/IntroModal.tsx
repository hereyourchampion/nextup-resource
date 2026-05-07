import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  FolderOpen,
  Bot,
  Globe,
  Github,
  Zap,
  Briefcase,
  Heart,
  X,
  PartyPopper,
  Layers,
} from "lucide-react";

const STORAGE_KEY = "intro-seen-v2";
export const OPEN_INTRO_EVENT = "nextup:open-intro";

const features = [
  { icon: BookOpen, title: "Premium Courses", desc: "50+ curated learning bundles." },
  { icon: FolderOpen, title: "Free Resources", desc: "Templates, packs and creative assets." },
  { icon: Bot, title: "AI Tools", desc: "A directory of the best AI apps." },
  { icon: Globe, title: "Apps & Sites", desc: "Productivity & learning picks." },
  { icon: Github, title: "FOSS Apps", desc: "Open-source Android favorites." },
  { icon: Zap, title: "Shizuku Apps", desc: "Power tools — no root needed." },
  { icon: Sparkles, title: "Morphe Builds", desc: "Patched apps, fresh from GitHub." },
  { icon: Layers, title: "Material You", desc: "Apps designed for Material You." },
  { icon: Briefcase, title: "Placement Material", desc: "Top company prep bundles." },
  { icon: Heart, title: "Favorites", desc: "Bookmark anything across the site." },
];

export const openIntroModal = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(OPEN_INTRO_EVENT));
};

const IntroModal = () => {
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(true);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const id = setTimeout(() => setOpen(true), 400);
        return () => clearTimeout(id);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_INTRO_EVENT, handler);
    return () => window.removeEventListener(OPEN_INTRO_EVENT, handler);
  }, []);

  const close = () => {
    try {
      if (dontShow) {
        localStorage.setItem(STORAGE_KEY, "1");
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-2 border-foreground/80 rounded-3xl shadow-pop">
        <button
          onClick={close}
          aria-label="Close intro"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card border-2 border-foreground/80 shadow-pop-soft flex items-center justify-center hover:-translate-y-0.5 transition-transform"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop mb-3">
              <PartyPopper className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <h2 id="intro-title" className="text-3xl sm:text-4xl font-extrabold font-heading mb-2">
              Welcome to Nextup ✨
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Premium courses, free resources, ebooks, AI tools, FOSS &amp; patched Android apps —
              all in one playful place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 p-3 rounded-xl border-2 border-foreground/30 bg-background"
              >
                <div className="w-9 h-9 rounded-xl bg-secondary text-secondary-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop-soft shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground font-heading">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border-2 border-foreground/30 p-4 mb-5 bg-background/50">
            <p className="text-xs font-bold text-muted-foreground mb-1.5">💡 Quick tips</p>
            <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
              <li>Tap the <strong>•••</strong> in the bottom bar to cycle Primary → More → Misc menus.</li>
              <li>Use the <strong>global search</strong> on the home page to find anything fast.</li>
              <li>Switch <strong>Study Mode</strong> from the header for a calm, focus-only view.</li>
              <li>Reopen this guide anytime from the footer's <strong>“Show intro”</strong> link.</li>
            </ul>
          </div>

          <label className="flex items-center justify-center gap-2 text-sm font-medium text-foreground mb-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="w-4 h-4 accent-primary rounded border-2 border-foreground/80"
            />
            Don't show this again
          </label>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/courses"
              onClick={close}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
            >
              Explore courses →
            </Link>
            <Link
              to="/faq"
              onClick={close}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-secondary text-secondary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform"
            >
              Need help? FAQ
            </Link>
            <button
              onClick={close}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-card text-foreground font-bold border-2 border-foreground/80 shadow-pop-soft hover:-translate-y-0.5 transition-transform"
            >
              Look around
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;
