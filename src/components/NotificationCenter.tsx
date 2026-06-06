import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Bell, X, BookOpen, Package, Smartphone, Clock, Bot, Github, Zap, Sparkles, Layers, Send } from "lucide-react";
import { courses, resources, ebooks, apps } from "@/data/content";
import { aiTools } from "@/data/aiTools";
import { fossListApps } from "@/data/fossList";
import { shizukuApps } from "@/data/shizukuApps";
import { materialYouApps } from "@/data/materialYouApps";
import { telegramBots } from "@/data/telegramBots";

type ItemType = "course" | "resource" | "ebook" | "app" | "ai-tool" | "foss" | "shizuku" | "morphe" | "material-you" | "telegram";

interface NotificationItem {
  title: string;
  category: string;
  type: ItemType;
  dateAdded: string;
  link: string;
}

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const recentItems = useMemo(() => {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const items: NotificationItem[] = [];
    const within = (d?: string) => d && new Date(d) >= cutoff;

    courses.forEach(c => within(c.dateAdded) && items.push({ title: c.title, category: c.category, type: "course", dateAdded: c.dateAdded!, link: c.link }));
    resources.forEach(r => within(r.dateAdded) && items.push({ title: r.title, category: r.category, type: "resource", dateAdded: r.dateAdded!, link: r.link }));
    ebooks.forEach(e => within(e.dateAdded) && items.push({ title: e.title, category: e.category, type: "ebook", dateAdded: e.dateAdded!, link: e.link }));
    apps.forEach(a => within(a.dateAdded) && items.push({ title: a.title, category: a.category, type: "app", dateAdded: a.dateAdded!, link: a.link }));
    aiTools.forEach((t: any) => within(t.dateAdded) && items.push({ title: t.name, category: t.category, type: "ai-tool", dateAdded: t.dateAdded, link: t.url }));
    fossListApps.forEach((f: any) => within(f.dateAdded) && items.push({ title: f.name, category: f.category, type: "foss", dateAdded: f.dateAdded, link: f.url }));
    shizukuApps.forEach((s: any) => within(s.dateAdded) && items.push({ title: s.name, category: s.category, type: "shizuku", dateAdded: s.dateAdded, link: s.url }));
    materialYouApps.forEach((m: any) => within(m.dateAdded) && items.push({ title: m.name, category: m.category, type: "material-you", dateAdded: m.dateAdded, link: m.url }));
    telegramBots.forEach((b) => within(b.dateAdded) && items.push({ title: b.name, category: b.category, type: "telegram", dateAdded: b.dateAdded!, link: b.url }));

    return items.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
  }, []);

  const typeIcon = (type: ItemType) => {
    switch (type) {
      case "course": return <BookOpen className="w-4 h-4" strokeWidth={2.5} />;
      case "resource": return <Package className="w-4 h-4" strokeWidth={2.5} />;
      case "app": return <Smartphone className="w-4 h-4" strokeWidth={2.5} />;
      case "ai-tool": return <Bot className="w-4 h-4" strokeWidth={2.5} />;
      case "foss": return <Github className="w-4 h-4" strokeWidth={2.5} />;
      case "shizuku": return <Zap className="w-4 h-4" strokeWidth={2.5} />;
      case "morphe": return <Sparkles className="w-4 h-4" strokeWidth={2.5} />;
      case "material-you": return <Layers className="w-4 h-4" strokeWidth={2.5} />;
      case "telegram": return <Send className="w-4 h-4" strokeWidth={2.5} />;
      default: return <BookOpen className="w-4 h-4" strokeWidth={2.5} />;
    }
  };

  const typeColor = (type: ItemType) => {
    switch (type) {
      case "course": return "bg-primary text-primary-foreground";
      case "resource": return "bg-quaternary text-quaternary-foreground";
      case "app": return "bg-tertiary text-tertiary-foreground";
      case "ai-tool": return "bg-primary text-primary-foreground";
      case "foss": return "bg-tertiary text-tertiary-foreground";
      case "shizuku": return "bg-secondary text-secondary-foreground";
      case "morphe": return "bg-secondary text-secondary-foreground";
      case "material-you": return "bg-tertiary text-tertiary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const daysAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff}d ago`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full border-2 border-foreground/80 bg-card shadow-pop hover:shadow-pop-hover hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-pop-active active:translate-x-0.5 active:translate-y-0.5 transition-all duration-300 text-muted-foreground hover:text-primary"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" strokeWidth={2.5} />
        {recentItems.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-foreground/80 ring-2 ring-card">
            {recentItems.length > 9 ? "9+" : recentItems.length}
          </span>
        )}
      </button>

      {createPortal(
        <>
          <div
            className={`fixed inset-0 z-[9998] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`fixed top-0 right-0 bottom-0 z-[9999] w-full max-w-sm transition-transform duration-500 pointer-events-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            <div className="h-full bg-background flex flex-col border-l-2 border-foreground/80">
              <div className="flex items-center justify-between p-5 border-b-2 border-foreground/20">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" strokeWidth={2.5} />
                  <h2 className="text-lg font-bold text-foreground font-heading">What's New</h2>
                  {recentItems.length > 0 && (
                    <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full border-2 border-foreground/80">
                      {recentItems.length}
                    </span>
                  )}
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full border-2 border-foreground/30 hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {recentItems.length > 0 ? (
                  <div className="space-y-3">
                    {recentItems.map((item, i) => (
                      <a
                        key={`${item.type}-${item.title}-${i}`}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-xl bg-card border-2 border-foreground/20 hover:border-primary transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-foreground/80 ${typeColor(item.type)}`}>
                            {typeIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground line-clamp-2">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs text-muted-foreground capitalize font-medium">{item.type.replace("-", " ")}</span>
                              <span className="text-xs text-muted-foreground/40">•</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" /> {daysAgo(item.dateAdded)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-bold">All caught up!</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">New content from the last 30 days will show up here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default NotificationCenter;
