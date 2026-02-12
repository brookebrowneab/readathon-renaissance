import { useSiteContentMultiple } from "@/hooks/useSiteContent";
import { cn } from "@/lib/utils";

interface SponsorTabProps {
  className?: string;
  variant?: "tab" | "banner";
}

const SponsorTab = ({ className = "", variant = "tab" }: SponsorTabProps) => {
  const { content } = useSiteContentMultiple(["home.sponsor_logo_url", "home.sponsor_name"]);
  const sponsorLogoUrl = content["home.sponsor_logo_url"] || "";
  const sponsorName = content["home.sponsor_name"] || "";

  if (!sponsorLogoUrl) return null;

  if (variant === "banner") {
    return (
      <div className={cn("flex flex-col items-end gap-1", className)}>
        <div className="bg-background rounded-b-xl shadow-md px-4 py-2">
          <span className="text-[10px] text-muted-foreground tracking-wide uppercase block text-center mb-1">
            Proudly supported by
          </span>
          <img
            src={sponsorLogoUrl}
            alt={sponsorName || "Sponsor"}
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-end gap-1 py-4 ${className}`}>
      <span className="text-xs text-muted-foreground tracking-wide uppercase pr-1 mr-4 md:mr-6">
        Proudly supported by
      </span>
      <div className="bg-[hsl(220,50%,20%)] rounded-l-xl px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <img
          src={sponsorLogoUrl}
          alt={sponsorName || "Sponsor"}
          className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
        />
      </div>
    </div>
  );
};

export { SponsorTab };
