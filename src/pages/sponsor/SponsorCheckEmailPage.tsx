import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const SponsorCheckEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/sponsor/login");
    }
  }, [email, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsResending(false);
    setResendCooldown(60);
    toast.success("Login link sent again!");
  };

  if (!email) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm flex items-center justify-center py-12">
        <div className="container max-w-md">
          <BookContainer variant="default" className="p-8 text-center">
            {/* Envelope Illustration */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-brand-blue/10 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Mail className="h-12 w-12 text-brand-blue" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-foreground" />
              </div>
            </div>

            <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground mb-2">
              Check your email!
            </h1>

            <p className="text-muted-foreground mb-2">
              We sent a login link to
            </p>
            <p className="font-medium text-foreground text-lg mb-6">
              {email}
            </p>

            <p className="text-muted-foreground">
              Click the link in the email to continue.
            </p>

            {/* Didn't get it section */}
            <div className="mt-8 pt-6 border-t border-border space-y-4">
              <p className="text-sm font-medium text-foreground">
                Didn't get it?
              </p>

              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground/60">•</span>
                  Check your spam folder
                </li>
              </ul>

              <Button
                variant="outline"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                loading={isResending}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : "Resend email"
                }
              </Button>

              <Link
                to="/sponsor/login"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Try a different email
              </Link>
            </div>
          </BookContainer>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorCheckEmailPage;
