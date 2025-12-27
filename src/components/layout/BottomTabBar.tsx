import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/legacy";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Heart,
  User,
  BookOpen,
  Star,
  Clock,
  Settings,
  LayoutDashboard,
  DollarSign,
} from "lucide-react";

export type UserRole = "parent" | "student" | "teacher" | "sponsor" | "admin" | null;

interface TabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const parentTabs: TabItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Children", href: "/dashboard#children", icon: Users },
  { label: "Pledges", href: "/dashboard#pledges", icon: Heart },
  { label: "Profile", href: "/dashboard#profile", icon: User },
];

const studentTabs: TabItem[] = [
  { label: "Home", href: "/student-dashboard", icon: Home },
  { label: "Log Reading", href: "/student-log-reading", icon: BookOpen },
  { label: "Sponsors", href: "/student-dashboard#sponsors", icon: Star },
  { label: "Profile", href: "/student-dashboard#profile", icon: User },
];

const teacherTabs: TabItem[] = [
  { label: "Home", href: "/teacher-dashboard", icon: Home },
  { label: "Students", href: "/teacher-dashboard#students", icon: Users },
  { label: "Log", href: "/teacher-log-reading", icon: Clock },
  { label: "Profile", href: "/teacher-dashboard#profile", icon: User },
];

const sponsorTabs: TabItem[] = [
  { label: "Home", href: "/sponsor-dashboard", icon: Home },
  { label: "Pledges", href: "/sponsor-dashboard#pledges", icon: Heart },
  { label: "Payments", href: "/sponsor-dashboard#payments", icon: DollarSign },
  { label: "Profile", href: "/sponsor-dashboard#profile", icon: User },
];

const adminTabs: TabItem[] = [
  { label: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin-users", icon: Users },
  { label: "Finance", href: "/admin-finance", icon: DollarSign },
  { label: "Settings", href: "/admin-dashboard#settings", icon: Settings },
];

const getTabsForRole = (role: UserRole): TabItem[] => {
  switch (role) {
    case "parent":
      return parentTabs;
    case "student":
      return studentTabs;
    case "teacher":
      return teacherTabs;
    case "sponsor":
      return sponsorTabs;
    case "admin":
      return adminTabs;
    default:
      return [];
  }
};

interface BottomTabBarProps {
  role: UserRole;
}

export function BottomTabBar({ role }: BottomTabBarProps) {
  const location = useLocation();
  const tabs = getTabsForRole(role);

  if (!role || tabs.length === 0) return null;

  const isActive = (href: string) => {
    const basePath = href.split("#")[0];
    return location.pathname === basePath;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-target-small",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("h-5 w-5 mb-1", active && "text-primary")} />
              <span className={cn("text-xs font-medium", active && "text-primary")}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
