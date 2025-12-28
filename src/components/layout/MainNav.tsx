import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { UserRole } from "./BottomTabBar";

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
  const userRole: UserRole = null;
  const userName = "John Smith";
  const userEmail = "john@example.com";

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logout");
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/95 hidden md:block">
        <div className="container flex h-14 items-center justify-center">

          {/* Desktop Nav - Left */}
          <nav className="flex items-center gap-8">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground inline-link",
                  location.pathname === item.href && "text-primary-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="w-8" />

          {/* Auth Buttons - Right */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-foreground hover:bg-white/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" size="sm" className="bg-accent text-accent-foreground hover:bg-accent-hover">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b bg-primary md:hidden">
        <span className="text-base font-semibold text-primary-foreground">
          Read-a-thon
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-lg text-primary-foreground hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        role={userRole}
        isAuthenticated={isAuthenticated}
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
    </>
  );
};

export { MainNav };
