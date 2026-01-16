import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, User, LogOut, Bell, Clock, Mail } from "lucide-react";
import { useState } from "react";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { UserRole } from "./BottomTabBar";
import logo from "@/assets/logo.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavItem {
  label: string;
  href: string;
}

const publicNav: NavItem[] = [
  { label: "HOW THE READ-A-THON WORKS", href: "/how-it-works" },
];

// Mock notification data - replace with real data
const mockNotifications = {
  pendingLogApprovals: [
    { id: "1", childName: "Emma", minutes: 540, date: "March 5" },
  ],
  pendingSponsorRequests: 2,
};

const MainNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Mock auth state - replace with real auth
  // Set to true on dashboard routes for demo purposes
  const isDashboardRoute = location.pathname.startsWith("/dashboard") || 
                           location.pathname.startsWith("/log-reading") ||
                           location.pathname.startsWith("/children") ||
                           location.pathname.startsWith("/family") ||
                           location.pathname.startsWith("/pledges") ||
                           location.pathname.startsWith("/reading-logs");
  const isAuthenticated = isDashboardRoute;
  const userRole: UserRole = isDashboardRoute ? "parent" : null;
  const userName = "Sarah Johnson";
  const userEmail = "sarah@example.com";

  const totalNotifications = 
    mockNotifications.pendingLogApprovals.length + 
    (mockNotifications.pendingSponsorRequests > 0 ? 1 : 0);

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logout");
  };

  return (
    <>
      {/* Desktop Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm hidden md:block shadow-[0_4px_6px_-1px_rgba(0,0,0,0.15)]",
        location.pathname === "/" ? "py-6 border-b border-[#1e3a5f]/30" : "border-b border-slate-100"
      )}>
        <div className={cn(
          "container flex items-center justify-between",
          location.pathname === "/" ? "h-28 py-4" : "h-22 py-2"
        )}>

          {/* Logo - Left (larger on home page) */}
          <Link to="/" className="flex items-center" style={{ marginTop: '10px', marginLeft: '20px' }}>
            <img 
              src={logo} 
              alt="Read-a-thon" 
              className="h-18 w-auto" 
              style={{ 
                transform: location.pathname === "/" ? 'scale(1.65)' : 'scale(1.08)', 
                transformOrigin: 'top left' 
              }} 
            />
          </Link>

          {/* Desktop Nav - Right side */}
          <div className="flex items-center gap-8">
            {/* Auth Buttons - First */}
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
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Nav Links - After Sign In */}
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
          </div>
        </div>

        {/* Floating Notification Circle - Desktop */}
        {isAuthenticated && totalNotifications > 0 && (
          <div className="absolute bottom-0 right-[50px] translate-y-1/2 z-[60]">
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="flex items-center justify-center gap-1 h-10 w-10 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                  aria-label={`${totalNotifications} notifications`}
                >
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-bold">{totalNotifications}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0 mt-2">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm">Notifications</p>
                </div>
                <div className="divide-y divide-border">
                  {mockNotifications.pendingLogApprovals.length > 0 && (
                    <Link 
                      to="/reading-logs/approve" 
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {mockNotifications.pendingLogApprovals.length} reading log{mockNotifications.pendingLogApprovals.length > 1 ? "s" : ""} to verify
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {mockNotifications.pendingLogApprovals[0].childName} logged {Math.floor(mockNotifications.pendingLogApprovals[0].minutes / 60)}+ hours
                        </p>
                      </div>
                    </Link>
                  )}
                  {mockNotifications.pendingSponsorRequests > 0 && (
                    <Link 
                      to="/family/sponsor-requests" 
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {mockNotifications.pendingSponsorRequests} sponsor request{mockNotifications.pendingSponsorRequests > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Review and approve sponsors
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur-sm border-b border-slate-100 md:hidden">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Read-a-thon" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Floating Notification Circle - Mobile */}
        {isAuthenticated && totalNotifications > 0 && (
          <div className="absolute bottom-0 right-4 translate-y-1/2 z-[60]">
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="flex items-center justify-center gap-0.5 h-9 w-9 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                  aria-label={`${totalNotifications} notifications`}
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{totalNotifications}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-0 mt-2">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm">Notifications</p>
                </div>
                <div className="divide-y divide-border">
                  {mockNotifications.pendingLogApprovals.length > 0 && (
                    <Link 
                      to="/reading-logs/approve" 
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {mockNotifications.pendingLogApprovals.length} log{mockNotifications.pendingLogApprovals.length > 1 ? "s" : ""} to verify
                        </p>
                      </div>
                    </Link>
                  )}
                  {mockNotifications.pendingSponsorRequests > 0 && (
                    <Link 
                      to="/family/sponsor-requests" 
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {mockNotifications.pendingSponsorRequests} sponsor request{mockNotifications.pendingSponsorRequests > 1 ? "s" : ""}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
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
