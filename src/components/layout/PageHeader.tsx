import { Link } from "react-router-dom";
import { Logo } from "@/components/legacy";
import { ReactNode } from "react";

interface PageHeaderProps {
  rightContent?: ReactNode;
}

/**
 * Standardized page header with consistent logo size and placement.
 * Used on pages without the hero section.
 */
const PageHeader = ({ rightContent }: PageHeaderProps) => {
  return (
    <header className="bg-card border-b py-4">
      <div className="container flex items-center justify-between gap-4 pl-4 md:pl-6">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo size="hero" className="w-[405px] max-w-[60vw]" />
        </Link>
        {rightContent && (
          <div className="flex-shrink-0">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
};

export { PageHeader };
