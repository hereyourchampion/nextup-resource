import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  FolderOpen,
  Bot,
  Globe,
  BookText,
  Mail,
  Download,
  Send,
  MoreHorizontal,
  Github,
  Zap,
  Briefcase,
  Sparkles,
  Layers,
  Map,
  Dumbbell,
} from "lucide-react";

const primaryLinks = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/courses", icon: BookOpen, label: "Courses" },
  { to: "/resources", icon: FolderOpen, label: "Resources" },
  { to: "/ai", icon: Bot, label: "AI" },
  { to: "/apps", icon: Globe, label: "Apps" },
];

const moreLinks = [
  { to: "/ebooks", icon: BookText, label: "Ebooks" },
  { to: "/developer-roadmap", icon: Map, label: "Roadmap" },
  { to: "/special-courses", icon: Briefcase, label: "Placement" },
  { to: "/contact", icon: Mail, label: "Contact" },
  { to: "/install", icon: Download, label: "Install" },
];

const miscLinks = [
  { to: "/foss-apps", icon: Github, label: "FOSS" },
  { to: "/shizuku-apps", icon: Zap, label: "Shizuku" },
  { to: "/morphe", icon: Sparkles, label: "Morphe" },
  { to: "/material-you", icon: Layers, label: "MatYou" },
  { to: "/telegram-tweaks", icon: Send, label: "Telegram" },
];

const hiddenLinks = [
  { to: "/guru-mann-fitness", icon: Dumbbell, label: "Fitness" },
];

const morePaths = moreLinks.map((l) => l.to);
const miscPaths = miscLinks.map((l) => l.to);
const hiddenPaths = hiddenLinks.map((l) => l.to);

const NavItem = ({
  to,
  icon: Icon,
  label,
  active,
  badge,
  accent = "primary",
}: {
  to: string;
  icon: any;
  label: string;
  active: boolean;
  badge?: number;
  accent?: "primary" | "secondary" | "tertiary" | "quaternary";
}) => {
  const textCls =
    accent === "secondary"
      ? "text-secondary"
      : accent === "tertiary"
      ? "text-tertiary"
      : accent === "quaternary"
      ? "text-quaternary"
      : "text-primary";
  const bgCls =
    accent === "secondary"
      ? "bg-secondary"
      : accent === "tertiary"
      ? "bg-tertiary"
      : accent === "quaternary"
      ? "bg-quaternary"
      : "bg-primary";
  return (
  <Link
    to={to}
    className={`relative flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-all duration-200 ${
      active ? textCls : "text-muted-foreground"
    }`}
  >
    {active && (
      <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full ${bgCls}`} />
    )}
    <div className="relative">
      <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
      {badge != null && badge > 0 && (
        <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center border border-foreground/80">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </div>
    {active && (
      <span className={`text-[10px] font-bold ${textCls} mt-0.5 animate-fade-in`}>
        {label}
      </span>
    )}
  </Link>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isOnMorePage = morePaths.includes(location.pathname);
  const isOnMiscPage =
    miscPaths.includes(location.pathname) ||
    location.pathname.startsWith("/collection/");
  const isOnHiddenPage = hiddenPaths.includes(location.pathname);

  // On desktop, only show bottom nav when the user is in a secondary/misc/hidden ring,
  // since the primary links live in the header already.
  const desktopClass = isOnMorePage || isOnMiscPage || isOnHiddenPage ? "" : "md:hidden";

  const shell = (children: React.ReactNode) => (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 ${desktopClass}`}>
      <div className="mx-2 md:mx-auto md:max-w-2xl mb-2 md:mb-4 bg-card border-2 border-foreground/80 rounded-2xl shadow-pop">
        <div
          className="flex items-center justify-around px-1 py-1.5"
          style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
        >
          {children}
        </div>
      </div>
    </nav>
  );

  // Hidden nav (4th ring) — toggle goes back to primary
  if (isOnHiddenPage) {
    return shell(
      <>
        {hiddenLinks.map((link) => (
          <NavItem
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            active={isActive(link.to)}
            accent="quaternary"
          />
        ))}
        <button
          onClick={() => navigate("/")}
          aria-label="Back to main menu"
          className="flex flex-col items-center justify-center px-2 py-1.5 rounded-xl text-muted-foreground"
        >
          <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
        </button>
      </>
    );
  }

  // Misc nav (3rd ring) — toggle goes to hidden ring
  if (isOnMiscPage) {
    return shell(
      <>
        {miscLinks.map((link) => (
          <NavItem
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            active={isActive(link.to)}
            accent="tertiary"
          />
        ))}
        <button
          onClick={() => navigate("/guru-mann-fitness")}
          aria-label="Switch to hidden menu"
          className="flex flex-col items-center justify-center px-2 py-1.5 rounded-xl text-muted-foreground"
        >
          <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
        </button>
      </>
    );
  }

  // Secondary nav — toggle goes to misc
  if (isOnMorePage) {
    return shell(
      <>
        {moreLinks.map((link) => (
          <NavItem
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            active={isActive(link.to)}
            accent="secondary"
          />
        ))}
        <button
          onClick={() => navigate("/foss-apps")}
          aria-label="Switch to extras menu"
          className="flex flex-col items-center justify-center px-2 py-1.5 rounded-xl text-muted-foreground"
        >
          <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
        </button>
      </>
    );
  }

  // Primary nav — toggle goes to secondary (Ebooks)
  return shell(
    <>
      {primaryLinks.map((link) => (
        <NavItem
          key={link.to}
          to={link.to}
          icon={link.icon}
          label={link.label}
          active={isActive(link.to)}
          accent="primary"
        />
      ))}
      <button
        onClick={() => navigate("/ebooks")}
        aria-label="Switch to more menu"
        className="flex flex-col items-center justify-center px-2 py-1.5 rounded-xl text-muted-foreground"
      >
        <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
      </button>
    </>
  );
};

export default BottomNav;
