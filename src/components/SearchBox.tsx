import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

const SearchBox = ({ value, onChange, placeholder, ariaLabel }: SearchBoxProps) => {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
        strokeWidth={2.5}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-12"
        aria-label={ariaLabel ?? placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-foreground border-2 border-foreground/30 hover:border-foreground/80 hover:bg-card transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
