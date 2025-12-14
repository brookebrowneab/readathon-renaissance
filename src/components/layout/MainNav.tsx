import { Link, useLocation } from "react-router-dom";
import { Logo, BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const publicNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
];

const MainNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Mock auth state - replace with real auth
  const isAuthenticated = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-brand-blue backdrop-blur supports-[backdrop-filter]:bg-brand-blue/95">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover-scale">
          <Logo size="small" />
          <span className="hidden text-lg font-semibold text-white sm:inline-block">
            Read-a-thon
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm font-medium text-white/80 transition-colors hover:text-white",
                location.pathname === item.href && "text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="sm" className="bg-brand-yellow text-foreground hover:bg-brand-yellow/90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-white/10 bg-brand-blue md:hidden">
          <div className="container py-4">
            <nav className="flex flex-col gap-2">
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                    location.pathname === item.href && "bg-white/10 text-white"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-2 border-white/10" />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button className="rounded-lg px-4 py-2 text-left text-sm font-medium text-white/80 hover:bg-white/10">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-brand-yellow px-4 py-2 text-center text-sm font-medium text-foreground hover:bg-brand-yellow/90"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export { MainNav };
