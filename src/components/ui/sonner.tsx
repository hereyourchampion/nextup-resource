import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast !rounded-full !px-5 !py-3 !border-2 !border-foreground/80 !bg-card !text-foreground !font-bold !font-heading !shadow-pop !flex !items-center !gap-3 !min-h-0",
          title: "!text-sm !font-bold",
          description: "!text-xs !text-muted-foreground !font-medium",
          actionButton:
            "group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground group-[.toast]:!rounded-full group-[.toast]:!px-3 group-[.toast]:!py-1 group-[.toast]:!border-2 group-[.toast]:!border-foreground/80",
          cancelButton:
            "group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground group-[.toast]:!rounded-full",
          success: "!bg-quaternary !text-quaternary-foreground",
          error: "!bg-destructive !text-destructive-foreground",
          icon: "!w-4 !h-4",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
