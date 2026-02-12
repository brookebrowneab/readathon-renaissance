import { useSiteContentMultiple } from "@/hooks/useSiteContent";

const SponsorTab = () => {
  const { content } = useSiteContentMultiple(["home.sponsor_logo_url", "home.sponsor_name"]);
  const sponsorLogoUrl = content["home.sponsor_logo_url"] || "";
  const sponsorName = content["home.sponsor_name"] || "";

  if (!sponsorLogoUrl) return null;

  return (
    <div className="flex flex-col items-end gap-1 py-4">
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