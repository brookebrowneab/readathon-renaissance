import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { UserRole } from "./BottomTabBar";
import logo from "@/assets/logo.svg";
interface NavItem {
  label: string;
  href: string;
}

const publicNav: NavItem[] = [
  { label: "ABOUT", href: "/about" },
  { label: "JOIN STORY", href: "/how-it-works" },
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
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 hidden md:block">
        <div className="container flex h-16 items-center justify-between">

          {/* Logo - Left */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Read-a-thon" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav - Right side */}
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-xs tracking-widest text-slate-500 transition-colors hover:text-slate-800",
                    location.pathname === item.href && "text-slate-800"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-50">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md"
                  >
                    Learn More
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur-sm border-b border-slate-100 md:hidden">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Read-a-thon" className="h-8 w-auto" />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
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
