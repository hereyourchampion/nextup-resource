import { useState } from "react";
import { Link } from "react-router-dom";
import EbookCard from "./EbookCard";
import { Input } from "@/components/ui/input";
import { Search, BookText, Dumbbell, ArrowRight } from "lucide-react";
import { allEbooks, sortByPreference, groupByCategory } from "@/data/content";
import { useStudyMode } from "@/hooks/useStudyMode";
import { useSortPreference } from "@/hooks/useSortPreference";

const studyEbookCategories = ["Education", "Business", "Technology", "Development", "Learning", "Guide"];

const EbooksSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isStudyMode } = useStudyMode();
  const { sortPreference } = useSortPreference();

  const studyFilteredEbooks = isStudyMode
    ? allEbooks.filter(ebook => studyEbookCategories.some(cat => ebook.category.toLowerCase().includes(cat.toLowerCase())))
    : allEbooks;

  const searchFiltered = studyFilteredEbooks.filter((ebook) =>
    ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ebook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ebook.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEbooks = sortByPreference(searchFiltered, sortPreference);
  const isCategoryView = sortPreference === 'category' && !searchQuery;
  const grouped = isCategoryView ? groupByCategory(filteredEbooks) : null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {isStudyMode && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-tertiary border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                <BookText className="w-5 h-5 text-tertiary-foreground" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">Study Ebooks</h2>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto mb-6 relative">
          <Link
            to="/guru-mann-fitness-books"
            className="group flex items-center gap-4 pop-card px-5 py-4 hover:shadow-pop-hover transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/20 border-2 border-foreground/80 flex items-center justify-center shrink-0 shadow-pop-soft group-hover:scale-110 transition-transform duration-300">
              <Dumbbell className="w-5 h-5 text-primary" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-foreground font-heading leading-tight group-hover:text-primary transition-colors duration-300">
                Guru Mann Fitness Books
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">4 free nutrition plans • Tap to explore</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
          </Link>
        </div>

        <div className="max-w-md mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input type="text" placeholder="Search ebooks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
        </div>

        {filteredEbooks.length > 0 ? (
          isCategoryView && grouped ? (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-10">
                <h3 className="text-xl font-bold text-foreground mb-5 px-1 font-heading">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pop-stagger">
                  {items.map((ebook, index) => <EbookCard key={index} {...ebook} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pop-stagger">
              {filteredEbooks.map((ebook, index) => <EbookCard key={index} {...ebook} />)}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="bg-card border-2 border-foreground/80 rounded-2xl p-8 max-w-md mx-auto shadow-pop-soft">
              <BookText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg font-medium">
                {searchQuery ? `No ebooks found matching "${searchQuery}"` : "No study-related ebooks found."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EbooksSection;
