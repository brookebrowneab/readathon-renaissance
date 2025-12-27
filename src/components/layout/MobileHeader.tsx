import { Link } from "react-router-dom";
import { Logo } from "@/components/legacy";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b bg-primary md:hidden">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <Logo size="small" className="h-8 w-8" />
        <span className="text-base font-semibold text-primary-foreground">
          Read-a-thon
        </span>
      </Link>

      {/* Hamburger Menu */}
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-11 h-11 rounded-lg text-primary-foreground hover:bg-white/10 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
}
