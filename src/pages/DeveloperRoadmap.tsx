import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import { Badge } from "@/components/ui/badge";
import { Map, ExternalLink, Compass, Code2 } from "lucide-react";

type Roadmap = {
  title: string;
  description: string;
  category: string;
  emoji: string;
  link: string;
  color: string;
};

const roadmaps: Roadmap[] = [
  { title: "Frontend Developer", description: "Step-by-step guide to becoming a modern Frontend developer — HTML, CSS, JS, React and beyond.", category: "Role Based", emoji: "🎨", link: "https://roadmap.sh/frontend", color: "hsl(var(--primary))" },
  { title: "Backend Developer", description: "Roadmap to becoming a Backend developer — Node.js, databases, APIs, caching and scaling.", category: "Role Based", emoji: "🛠️", link: "https://roadmap.sh/backend", color: "hsl(var(--secondary))" },
  { title: "Full Stack", description: "Everything a Full Stack developer needs to know across the frontend and backend spectrum.", category: "Role Based", emoji: "🧩", link: "https://roadmap.sh/full-stack", color: "hsl(var(--tertiary))" },
  { title: "DevOps", description: "Learn to become a DevOps engineer with CI/CD, containers, Kubernetes and observability.", category: "Role Based", emoji: "⚙️", link: "https://roadmap.sh/devops", color: "hsl(var(--quaternary))" },
  { title: "AI Engineer", description: "Roadmap to becoming an AI Engineer — LLMs, embeddings, RAG, agents and evaluation.", category: "AI & Data", emoji: "🤖", link: "https://roadmap.sh/ai-engineer", color: "hsl(var(--primary))" },
  { title: "Data Analyst", description: "Master data analysis — SQL, spreadsheets, statistics, dashboards and storytelling.", category: "AI & Data", emoji: "📊", link: "https://roadmap.sh/data-analyst", color: "hsl(var(--secondary))" },
  { title: "AI & Data Scientist", description: "Deep dive into ML, deep learning, MLOps and applied research paths.", category: "AI & Data", emoji: "🧠", link: "https://roadmap.sh/ai-data-scientist", color: "hsl(var(--tertiary))" },
  { title: "Android", description: "Become an Android developer with Kotlin, Jetpack Compose and modern architecture.", category: "Mobile", emoji: "🤖", link: "https://roadmap.sh/android", color: "hsl(var(--quaternary))" },
  { title: "iOS Developer", description: "Roadmap for iOS development with Swift, SwiftUI and Apple ecosystem tooling.", category: "Mobile", emoji: "📱", link: "https://roadmap.sh/ios", color: "hsl(var(--primary))" },
  { title: "React", description: "Modern React skill map — hooks, state management, routing, RSC and testing.", category: "Skill Based", emoji: "⚛️", link: "https://roadmap.sh/react", color: "hsl(var(--secondary))" },
  { title: "Node.js", description: "Path to mastering Node.js — event loop, streams, frameworks and production practices.", category: "Skill Based", emoji: "🟩", link: "https://roadmap.sh/nodejs", color: "hsl(var(--tertiary))" },
  { title: "System Design", description: "Learn distributed systems, scalability patterns and how to design real-world architectures.", category: "Skill Based", emoji: "🏗️", link: "https://roadmap.sh/system-design", color: "hsl(var(--quaternary))" },
  { title: "Cyber Security", description: "Become a security engineer — networks, offensive & defensive tooling, and best practices.", category: "Security", emoji: "🛡️", link: "https://roadmap.sh/cyber-security", color: "hsl(var(--primary))" },
  { title: "Blockchain", description: "Roadmap to becoming a Blockchain developer — smart contracts, EVM and dApps.", category: "Web3", emoji: "⛓️", link: "https://roadmap.sh/blockchain", color: "hsl(var(--secondary))" },
  { title: "SQL", description: "Master SQL from basics to advanced joins, indexing, window functions and query tuning.", category: "Skill Based", emoji: "🗄️", link: "https://roadmap.sh/sql", color: "hsl(var(--tertiary))" },
  { title: "Git & GitHub", description: "Everything you need to know about Git internals and effective GitHub collaboration.", category: "Tooling", emoji: "🔀", link: "https://roadmap.sh/git-github", color: "hsl(var(--quaternary))" },
];

const DeveloperRoadmap = () => {
  useEffect(() => {
    document.title = "Developer Roadmaps — Nextup Resources";
  }, []);

  const grouped = roadmaps.reduce<Record<string, Roadmap[]>>((acc, r) => {
    (acc[r.category] ||= []).push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-12 dot-grid">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-secondary text-secondary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Compass className="w-4 h-4" strokeWidth={2.5} />
                <span>Developer Roadmaps</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">
                Pick Your Path
              </h1>
              <SquigglyUnderline color="hsl(var(--secondary))" width={220} />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                Community-curated roadmaps to guide your journey as a developer — from frontend to AI.
              </p>
              <div className="mt-6">
                <a
                  href="https://roadmap.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Powered by roadmap.sh <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-tertiary border-2 border-foreground/80 shadow-pop flex items-center justify-center">
                    <Map className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-extrabold font-heading">{cat}</h2>
                  <div className="flex-1 h-[2px] bg-foreground/10 rounded-full" />
                  <span className="text-xs font-bold text-muted-foreground">{items.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pop-stagger">
                  {items.map((r, i) => (
                    <a
                      key={i}
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="pop-card overflow-hidden h-full">
                        <div
                          className="relative h-36 flex items-center justify-center"
                          style={{ background: `${r.color}22` }}
                        >
                          <div
                            className="w-16 h-16 rounded-2xl border-2 border-foreground/80 shadow-pop flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                            style={{ backgroundColor: `${r.color}33` }}
                          >
                            {r.emoji}
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-tertiary text-tertiary-foreground border-2 border-foreground/80 text-xs font-bold px-3 py-1 flex items-center gap-1 rounded-full">
                              <Code2 className="w-3 h-3" strokeWidth={2.5} /> {r.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-lg font-bold text-foreground font-heading group-hover:text-primary transition-colors leading-tight">
                              {r.title}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" strokeWidth={2} />
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-3">{r.description}</p>
                          <div className="mt-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            <span className="text-xs font-semibold text-muted-foreground">roadmap.sh</span>
                            <span className="ml-auto text-xs font-semibold text-primary">Open roadmap →</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
      <BottomNav />
    </div>
  );
};

export default DeveloperRoadmap;
