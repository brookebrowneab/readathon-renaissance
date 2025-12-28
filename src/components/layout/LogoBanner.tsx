import { Link } from "react-router-dom";
import { Logo } from "@/components/legacy";

const LogoBanner = () => {
  return (
    <div className="relative z-40 hidden md:block">
      <div className="w-full bg-card pt-6 pb-1 shadow-md">
        <div className="container flex items-center pl-4">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo size="hero" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export { LogoBanner };
