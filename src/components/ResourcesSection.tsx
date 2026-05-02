import { useState } from "react";
import ResourceCard from "./ResourceCard";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { allResources, sortByPreference, groupByCategory } from "@/data/content";
import { useStudyMode } from "@/hooks/useStudyMode";
import { useSortPreference } from "@/hooks/useSortPreference";

const studyResourceCategories = ["Education", "Templates", "Tools", "AI", "Productivity", "Learning"];

const ResourcesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isStudyMode } = useStudyMode();
  const { sortPreference } = useSortPreference();

  const studyFilteredResources = isStudyMode
    ? allResources.filter(resource => studyResourceCategories.some(cat => resource.category.toLowerCase().includes(cat.toLowerCase())))
    : allResources;

  const searchFiltered = studyFilteredResources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = sortByPreference(searchFiltered, sortPreference);
  const isCategoryView = sortPreference === 'category' && !searchQuery;
  const grouped = isCategoryView ? groupByCategory(filteredResources) : null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {isStudyMode && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-quaternary border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                <Package className="w-5 h-5 text-quaternary-foreground" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">Study Resources</h2>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
        </div>

        {filteredResources.length > 0 ? (
          isCategoryView && grouped ? (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-10">
                <h3 className="text-xl font-bold text-foreground mb-5 px-1 font-heading">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 lg:gap-x-16 pop-stagger dashed-grid cols-3">
                  {items.map((resource, index) => <ResourceCard key={index} {...resource} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 lg:gap-x-16 pop-stagger dashed-grid cols-3">
              {filteredResources.map((resource, index) => <ResourceCard key={index} {...resource} />)}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="bg-card border-2 border-foreground/80 rounded-2xl p-8 max-w-md mx-auto shadow-pop-soft">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg font-medium">
                {searchQuery ? `No resources found matching "${searchQuery}"` : "No study-related resources found."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourcesSection;
