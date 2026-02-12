import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { useSiteContentMultiple } from "@/hooks/useSiteContent";

const Footer = () => {
  const { content } = useSiteContentMultiple(["home.sponsor_logo_url", "home.sponsor_name"]);
  const sponsorLogoUrl = content["home.sponsor_logo_url"] || "";
  const sponsorName = content["home.sponsor_name"] || "";

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      {/* Sponsor logo row - only shown when configured */}
      {sponsorLogoUrl && (
        <div className="border-b border-slate-200 py-4">
          <div className="container flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground tracking-wide uppercase">Presented by</span>
            <img
              src={sponsorLogoUrl}
              alt={sponsorName || "Sponsor"}
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
        </div>
      )}
      <div className="container py-6 md:py-8">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col items-center gap-4 md:hidden">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
            <Link to="/faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </Link>
            <span className="text-slate-300">|</span>
            <a href="mailto:janneyreadathon@janneyschool.org" className="hover:text-slate-900 transition-colors">
              Contact
            </a>
            <span className="text-slate-300">|</span>
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Desktop: horizontal layout */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
          <Link to="/about" className="hover:text-slate-900 transition-colors">
            About
          </Link>
          <span className="text-slate-300">|</span>
          <Link to="/faq" className="hover:text-slate-900 transition-colors">
            FAQ
          </Link>
          <span className="text-slate-300">|</span>
          <a href="mailto:janneyreadathon@janneyschool.org" className="hover:text-slate-900 transition-colors">
            Contact
          </a>
          <span className="text-slate-300">|</span>
          <Link to="/privacy" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 md:mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Read-a-thon. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export { Footer };
