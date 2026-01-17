import { Link, useLocation } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Mail,
  Settings,
} from "lucide-react";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

// Admin navigation items
const adminNavItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Users", path: "/admin-users", icon: Users },
  { label: "Finance", path: "/admin-finance", icon: DollarSign },
  { label: "Emails", path: "/admin/emails", icon: Mail },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminPageLayout = ({ children, title, subtitle, actions }: AdminPageLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Admin Navigation Bar */}
      <div className="border-b-2 border-foreground/20 bg-background">
        <div className="container">
          <nav className="flex overflow-x-auto gap-1 py-2">
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-md",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  style={isActive ? {
                    borderTopLeftRadius: '255px 15px',
                    borderTopRightRadius: '15px 225px',
                    borderBottomRightRadius: '225px 15px',
                    borderBottomLeftRadius: '15px 255px',
                  } : undefined}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 bg-background-warm">
        <div className="container py-10 md:py-12">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="relative inline-block">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.05]">
                <span className="relative inline-block isolate">
                  <span className="relative z-10">{title}</span>
                  {/* Highlighter effect */}
                  <span
                    className="absolute left-[-2%] right-[-2%] -skew-y-1 z-0 transform -rotate-[0.5deg]"
                    style={{
                      top: "50%",
                      bottom: "0",
                      borderRadius: "4px 8px 4px 6px",
                      backgroundColor: "hsl(var(--warning) / 0.45)",
                    }}
                    aria-hidden="true"
                  />
                </span>
              </h1>
              {subtitle && (
                <p className="text-muted-foreground mt-2">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex gap-2">
                {actions}
              </div>
            )}
          </div>

          {children}
        </div>
        
        {/* Spacer for bottom tab bar */}
        <div className="h-20 md:hidden" />
      </main>

      <Footer />
      <BottomTabBar role="admin" />
    </div>
  );
};

export default AdminPageLayout;
