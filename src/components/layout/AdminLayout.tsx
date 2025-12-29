import { Link, useLocation } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  DollarSign,
  FileText,
  Settings,
  Mail,
  Users,
  BarChart3,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Outstanding", path: "/admin/outstanding", icon: DollarSign },
  { label: "Checks", path: "/admin/checks", icon: FileText },
  { label: "Emails", path: "/admin/emails", icon: Mail },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Admin Navigation Bar */}
      <div className="border-b border-border bg-card">
        <div className="container">
          <nav className="flex overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 bg-background-warm">{children}</main>

      <Footer />
    </div>
  );
};

export default AdminLayout;
