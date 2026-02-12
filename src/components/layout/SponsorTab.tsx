import { useSiteContentMultiple } from "@/hooks/useSiteContent";

const SponsorTab = ({ className = "" }: { className?: string }) => {
  const { content } = useSiteContentMultiple(["home.sponsor_logo_url", "home.sponsor_name"]);
  const sponsorLogoUrl = content["home.sponsor_logo_url"] || "";
  const sponsorName = content["home.sponsor_name"] || "";

  if (!sponsorLogoUrl) return null;

  return (
    <div className={`flex flex-col items-end gap-0 md:gap-1 md:py-4 ${className}`}>
      <span className="hidden md:block text-xs text-muted-foreground tracking-wide uppercase pr-1 mr-4 md:mr-6">
        Proudly supported by
      </span>
      <div className="bg-[hsl(220,50%,20%)] rounded-bl-xl md:rounded-l-xl md:rounded-r-none px-3 py-2 md:px-5 md:py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <img
          src={sponsorLogoUrl}
          alt={sponsorName || "Sponsor"}
          className="h-8 md:h-16 w-auto object-contain brightness-0 invert"
        />
      </div>
    </div>
  );
};

export { SponsorTab };