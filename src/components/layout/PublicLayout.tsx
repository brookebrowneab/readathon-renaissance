import { ReactNode } from "react";
import { MainNav } from "./MainNav";
import { Footer } from "./Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export { PublicLayout };
