import { Clock, Users, ExternalLink, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import PlatformBadge from "./PlatformBadge";
import NewBadge from "./NewBadge";
import { useFavorites, generateId } from "@/hooks/useFavorites";

interface CourseCardProps {
  title: string;
  description: string;
  category: string;
  duration: string;
  students: string;
  image: string;
  link: string;
  dateAdded?: string;
}

const categoryColors = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-quaternary"];

const CourseCard = ({ title, description, category, duration, students, image, link, dateAdded }: CourseCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const courseId = generateId(title);
  const isCourseFavorite = isFavorite(courseId, "course");
  const colorIndex = category.length % categoryColors.length;
  const isInternal = link.startsWith("/");

  const handleAccess = () => {
    if (isInternal) navigate(link);
    else window.open(link, "_blank");
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(courseId, "course");
  };

  return (
    <div className="pop-card group h-full flex flex-col overflow-hidden">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-bounce group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className={`${categoryColors[colorIndex]} text-white border-2 border-foreground/80 font-bold text-xs rounded-full`}>
            {category}
          </Badge>
          <NewBadge dateAdded={dateAdded} />
        </div>
        <div className="absolute top-3 right-3 z-20">
          <FavoriteButton isFavorite={isCourseFavorite} onToggle={handleFavoriteClick} />
        </div>
        <PlatformBadge link={link} />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-2 font-heading group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{description}</p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-foreground/30 text-xs font-medium">
            <Clock className="h-3.5 w-3.5" strokeWidth={2.5} /> {duration}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-foreground/30 text-xs font-medium">
            <Users className="h-3.5 w-3.5" strokeWidth={2.5} /> {students}
          </span>
        </div>
        <Button className="w-full" onClick={handleAccess}>
          {isInternal ? <ArrowRight className="h-4 w-4 mr-2" strokeWidth={2.5} /> : <ExternalLink className="h-4 w-4 mr-2" strokeWidth={2.5} />}
          {isInternal ? "View Collection" : "Access Course"}
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
