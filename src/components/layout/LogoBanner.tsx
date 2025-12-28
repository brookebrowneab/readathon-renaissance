import { Link } from "react-router-dom";
import { Logo } from "@/components/legacy";

const LogoBanner = () => {
  return (
    <div className="relative z-40 -mt-4 hidden md:block">
      <div className="flex justify-center">
        <Link 
          to="/" 
          className="relative bg-card rounded-b-2xl px-8 py-4 shadow-md hover:shadow-lg transition-shadow"
        >
          <Logo size="header" />
        </Link>
      </div>
    </div>
  );
};

export { LogoBanner };
