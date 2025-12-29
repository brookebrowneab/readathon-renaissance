import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Logo } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
  };

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] bg-background-warm flex items-center justify-center py-12">
        <div className="container max-w-[400px]">
          <div className="bg-card rounded-xl shadow-md p-8 animate-fade-in">
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo size="large" className="mx-auto mb-6" />
            </div>

            {isSubmitted ? (
              /* Success State */
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-accent-green" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Check Your Email
                </h1>
                <p className="text-muted-foreground">
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>
                </p>
                <div className="pt-4">
                  <Link to="/login">
                    <Button variant="secondary" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* Form State */
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground">
                    Reset Password
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField label="Email Address" htmlFor="email">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </FormField>

                  <Button type="submit" className="w-full">
                    Send Reset Link
                  </Button>
                </form>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ForgotPasswordPage;
