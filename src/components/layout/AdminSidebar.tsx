import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  Settings,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface AdminSidebarProps {
  navItems?: SidebarNavItem[];
  className?: string;
}

const defaultNavItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: Users },
  { label: "Reading Logs", href: "/reading-logs", icon: BookOpen },
  { label: "Pledges", href: "/pledges", icon: DollarSign },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const AdminSidebar = ({
  navItems = defaultNavItems,
  className,
}: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      {/* Header with Logo */}
      <div className="flex h-16 items-center justify-between bg-primary px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <Logo size="small" className="brightness-0 invert" />
            <span className="font-semibold text-primary-foreground">
              Read-a-thon
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <Logo size="small" className="brightness-0 invert" />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-primary border-l-4 border-primary -ml-0.5 pl-[10px]"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export { AdminSidebar };
export type { SidebarNavItem };
