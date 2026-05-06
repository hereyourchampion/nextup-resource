import { ExternalLink, Github, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CopyLinkButton from "@/components/CopyLinkButton";
import { useGithubRepoInfo } from "@/hooks/useGithubRepoInfo";
import { toast } from "sonner";

interface Props {
  name: string;
  author: string;
  url: string;
  category: string;
}

const FossAppCard = ({ name, author, url, category }: Props) => {
  const supported =
    /github\.com|gitlab\.com|codeberg\.org/i.test(url);
  const { loading, info } = useGithubRepoInfo(url, supported);

  const handleOpen = () => {
    toast.success("Opening repo…");
  };

  return (
    <div className="pop-card p-5 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-11 h-11 rounded-2xl bg-tertiary text-tertiary-foreground border-2 border-foreground/80 flex items-center justify-center shadow-pop">
          <Github className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className="bg-primary text-primary-foreground border-2 border-foreground/80 text-[10px] font-bold rounded-full">
            {category}
          </Badge>
          {info?.stars !== undefined && (
            <Badge className="bg-tertiary text-tertiary-foreground border-2 border-foreground/80 text-[10px] font-bold rounded-full inline-flex items-center gap-1">
              <Star className="w-3 h-3" strokeWidth={2.5} />
              {info.stars >= 1000 ? `${(info.stars / 1000).toFixed(1)}k` : info.stars}
            </Badge>
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold text-foreground font-heading mb-1 break-words">{name}</h3>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2 flex-wrap">
        <User className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span className="font-semibold">{author}</span>
        {info?.language && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-foreground text-[10px] font-bold border border-foreground/20">
            {info.language}
          </span>
        )}
      </div>

      {info?.topics && info.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 mt-1">
          {info.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full bg-secondary/15 text-foreground text-[10px] font-bold border border-foreground/20"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 mt-auto">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpen}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-tertiary text-tertiary-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 transition-transform text-sm"
        >
          <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
          <span>Open repo</span>
        </a>
        <CopyLinkButton url={url} />
      </div>
    </div>
  );
};

export default FossAppCard;
