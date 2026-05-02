import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";
import SquigglyUnderline from "@/components/SquigglyUnderline";
import AIToolBottomSheet from "@/components/AIToolBottomSheet";
import FeaturedCollections from "@/components/FeaturedCollections";
import { aiTools, AITool } from "@/data/aiTools";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Bot, Sparkles, Filter } from "lucide-react";

const AI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(aiTools.map(t => t.category));
    return Array.from(cats).sort();
  }, []);

  const filtered = aiTools.filter(
    (t) =>
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedCategory || t.category === selectedCategory)
  );

  const grouped = filtered.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof aiTools>);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main>
        <section className="pt-32 pb-12 dot-grid">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary text-primary-foreground border-2 border-foreground/80 shadow-pop font-bold text-sm">
                <Bot className="w-4 h-4" strokeWidth={2.5} />
                <span>AI Tools Collection</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-1 font-heading">AI Tools</h1>
              <SquigglyUnderline color="hsl(var(--primary))" width={160} />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                Curated collection of {aiTools.length}+ powerful AI tools
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-md mx-auto mb-8 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search AI tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all duration-300 ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground border-foreground/80 shadow-pop"
                    : "bg-card text-muted-foreground border-foreground/30 hover:border-foreground/80"
                }`}
              >
                <Filter className="w-3.5 h-3.5" strokeWidth={2.5} /> All ({aiTools.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-foreground/80 shadow-pop"
                      : "bg-card text-muted-foreground border-foreground/30 hover:border-foreground/80"
                  }`}
                >
                  {cat} ({aiTools.filter(t => t.category === cat).length})
                </button>
              ))}
            </div>

            {Object.keys(grouped).length > 0 ? (
              Object.entries(grouped).map(([category, tools]) => (
                <div key={category} className="mb-10">
                  <h3 className="text-xl font-bold text-foreground mb-5 px-1 flex items-center gap-2 font-heading">
                    <Sparkles className="w-5 h-5 text-tertiary" strokeWidth={2.5} />
                    {category}
                    <span className="text-sm text-muted-foreground font-medium">({tools.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pop-stagger">
                    {tools.map((tool) => (
                      <button
                        key={tool.name}
                        onClick={() => setSelectedTool(tool)}
                        className="pop-card p-6 group flex flex-col text-left w-full"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-foreground font-heading group-hover:text-primary transition-colors">
                            {tool.name}
                          </h4>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" strokeWidth={2.5} />
                        </div>
                        <p className="text-muted-foreground text-sm">{tool.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-card border-2 border-foreground/80 rounded-2xl p-8 max-w-md mx-auto shadow-pop-soft">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg mb-4 font-medium">No AI tools found</p>
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                    className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold border-2 border-foreground/80 shadow-pop"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
      <BottomNav />
      <AIToolBottomSheet tool={selectedTool} open={!!selectedTool} onClose={() => setSelectedTool(null)} />
    </div>
  );
};

export default AI;
