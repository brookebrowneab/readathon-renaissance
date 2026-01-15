import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="container py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
          <Link to="/about" className="hover:text-slate-900 transition-colors">
            About
          </Link>
          <span className="text-slate-300">|</span>
          <Link to="/faq" className="hover:text-slate-900 transition-colors">
            FAQ
          </Link>
          <span className="text-slate-300">|</span>
          <a href="mailto:janneyreadathon@janneyschool.org" className="hover:text-slate-900 transition-colors">
            Contact
          </a>
          <span className="text-slate-300">|</span>
          <Link to="/privacy" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Read-a-thon. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export { Footer };
