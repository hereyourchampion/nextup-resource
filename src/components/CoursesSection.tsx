import { useState } from "react";
import CourseCard from "./CourseCard";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import { allCourses, studyCategories, sortByPreference, groupByCategory } from "@/data/content";
import { useStudyMode } from "@/hooks/useStudyMode";
import { useSortPreference } from "@/hooks/useSortPreference";

const CoursesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isStudyMode } = useStudyMode();
  const { sortPreference } = useSortPreference();

  const studyFilteredCourses = isStudyMode
    ? allCourses.filter(course => studyCategories.some(cat => course.category.toLowerCase().includes(cat.toLowerCase())))
    : allCourses;

  const searchFiltered = studyFilteredCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = sortByPreference(searchFiltered, sortPreference);
  const isCategoryView = sortPreference === 'category' && !searchQuery;
  const grouped = isCategoryView ? groupByCategory(filteredCourses) : null;

  return (
    <section id="courses" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isStudyMode && (
              <div className="w-10 h-10 rounded-full bg-primary border-2 border-foreground/80 flex items-center justify-center shadow-pop">
                <BookOpen className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            )}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-heading">
              {isStudyMode ? "Study Courses" : "Featured Courses"}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isStudyMode ? "Focused educational courses for productive learning." : "Explore our curated collection of premium courses."}
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
        </div>

        {filteredCourses.length > 0 ? (
          isCategoryView && grouped ? (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-10">
                <h3 className="text-xl font-bold text-foreground mb-5 px-1 font-heading">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 lg:gap-x-16 pop-stagger dashed-grid cols-3">
                  {items.map((course, index) => <CourseCard key={index} {...course} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 lg:gap-x-16 pop-stagger dashed-grid cols-3">
              {filteredCourses.map((course, index) => <CourseCard key={index} {...course} />)}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="bg-card border-2 border-foreground/80 rounded-2xl p-8 max-w-md mx-auto shadow-pop-soft">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg font-medium">
                {searchQuery ? `No courses found matching "${searchQuery}"` : "No study-related courses found."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
