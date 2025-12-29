import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const SponsorLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate sending magic link
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    
    // Navigate to check email page with email in state
    navigate("/sponsor/check-email", { state: { email } });
    toast.success("Login link sent!");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm flex items-center justify-center py-12">
        <div className="container max-w-md">
          <BookContainer variant="default" className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-brand-blue" />
              </div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground mb-2">
                Welcome back!
              </h1>
              <p className="text-muted-foreground">
                Enter your email to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Email Address" htmlFor="email" required>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-lg"
                  required
                />
              </FormField>

              <Button
                type="submit"
                disabled={!email || isSubmitting}
                loading={isSubmitting}
                className="w-full h-14 text-lg"
                size="lg"
              >
                Send me a login link
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                We'll email you a link to sign in. No password needed!
              </p>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Made a pledge but never created an account?
              </p>
              <p className="text-sm text-center mt-1">
                <span className="text-muted-foreground">Check your email for your </span>
                <span className="text-primary font-medium">original invitation link</span>
                <span className="text-muted-foreground">.</span>
              </p>
            </div>
          </BookContainer>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Want to sponsor a student?{" "}
            <Link to="/" className="text-primary hover:underline font-medium">
              Get started here
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorLoginPage;
