import { Link, useLocation } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  DollarSign,
  FileText,
  Settings,
  Mail,
  PenLine,
  BookOpen,
} from "lucide-react";
import booksShelfDivider from "@/assets/books-shelf-divider.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Reading", path: "/admin/reading", icon: BookOpen },
  { label: "Finance", path: "/admin-finance", icon: DollarSign },
  { label: "Outstanding", path: "/admin/outstanding", icon: DollarSign },
  { label: "Checks", path: "/admin/checks", icon: FileText },
  { label: "Emails", path: "/admin/emails", icon: Mail },
  { label: "Content", path: "/admin/content", icon: PenLine },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Admin Navigation Bar */}
      <div className="border-b-2 border-foreground/20 bg-background">
        <div className="container">
          <nav className="flex overflow-x-auto gap-1 py-2">
            {navItems.map((item) => {
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

      {/* Decorative Divider - Tiled */}
      <div 
        className="w-full h-12 md:h-16"
        style={{
          backgroundImage: `url(${booksShelfDivider})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      <main className="flex-1 bg-background-warm">{children}</main>

      <Footer />
    </div>
  );
};

export default AdminLayout;
