import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/legacy";
import { cn } from "@/lib/utils";
import { X, User, LogOut, Home, BookOpen, Users, Heart, Clock, DollarSign, Settings, LayoutDashboard } from "lucide-react";
import { UserRole } from "./BottomTabBar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const publicNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "How It Works", href: "/how-it-works", icon: Users },
];

const parentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Log Reading", href: "/log-reading", icon: Clock },
  { label: "Children", href: "/family/manage", icon: Users },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: Home },
  { label: "Log Reading", href: "/student/log", icon: BookOpen },
  { label: "My Sponsors", href: "/student", icon: Heart },
];

const teacherNav: NavItem[] = [
  { label: "Dashboard", href: "/teacher", icon: Home },
  { label: "Log Reading", href: "/teacher/log", icon: Clock },
  { label: "My Class", href: "/teacher", icon: Users },
];

const sponsorNav: NavItem[] = [
  { label: "Dashboard", href: "/sponsor/dashboard", icon: Home },
  { label: "My Pledges", href: "/my-pledges", icon: Heart },
  { label: "Payments", href: "/sponsor/pay", icon: DollarSign },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin-users", icon: Users },
  { label: "Finance", href: "/admin-finance", icon: DollarSign },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const getNavForRole = (role: UserRole, isAuthenticated: boolean): NavItem[] => {
  if (!isAuthenticated) return publicNav;
  
  switch (role) {
    case "parent":
      return parentNav;
    case "student":
      return studentNav;
    case "teacher":
      return teacherNav;
    case "sponsor":
      return sponsorNav;
    case "admin":
      return adminNav;
    default:
      return publicNav;
  }
};

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  isAuthenticated: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  role,
  isAuthenticated,
  userName = "Guest",
  userEmail = "",
  onLogout,
}: MobileNavDrawerProps) {
  const location = useLocation();
  const navItems = getNavForRole(role, isAuthenticated);

  const isActive = (href: string) => {
    const basePath = href.split("#")[0];
    return location.pathname === basePath;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-card shadow-xl animate-slide-in-right md:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-14 px-4 border-b">
            <Logo size="small" />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info (if authenticated) */}
          {isAuthenticated && (
            <div className="px-4 py-4 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{userName}</p>
                  {userEmail && (
                    <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 h-14 px-4 rounded-lg text-base font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="border-t p-4 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="flex items-center gap-3 w-full h-14 px-4 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Log Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center h-12 rounded-lg border border-input text-base font-medium hover:bg-muted transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex items-center justify-center h-12 rounded-lg bg-primary text-primary-foreground text-base font-medium hover:bg-primary-hover transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
