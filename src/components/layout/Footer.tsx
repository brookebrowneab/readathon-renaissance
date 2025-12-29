import { Link } from "react-router-dom";
import { BookIcon } from "@/components/legacy";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background-warm">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-xl font-display tracking-wide text-foreground">
                Read-a-thon
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Inspiring a love of reading through community-supported fundraising.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground">
                  Find Events
                </Link>
              </li>
            </ul>
          </div>

          {/* For Participants */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Participants</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Parent Login
                </Link>
              </li>
              <li>
                <Link to="/student-login" className="text-sm text-muted-foreground hover:text-foreground">
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Read-a-thon. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookIcon size="small" variant="primary" />
            <span>Made with love for readers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
