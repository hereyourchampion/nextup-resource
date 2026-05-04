import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";

interface CopyLinkButtonProps {
  url: string;
  label?: string;
  className?: string;
}

const CopyLinkButton = ({ url, label = "Copy link", className = "" }: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-card text-foreground font-bold border-2 border-foreground/80 shadow-pop hover:-translate-y-0.5 active:translate-y-0 transition-transform text-xs ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Link2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default CopyLinkButton;
