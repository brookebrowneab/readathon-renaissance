import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  UserPlus,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";

const SponsorGatewayPage = () => {
  const navigate = useNavigate();
  const [sponsorCode, setSponsorCode] = useState("");

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (sponsorCode.trim()) {
      navigate(`/s/${sponsorCode.trim()}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-4">
              Welcome, Sponsor!
            </h1>
            <p className="text-xl text-muted-foreground">
              Thank you for supporting young readers
            </p>
          </div>

          {/* Main Question */}
          <BookContainer variant="warm" className="p-8 mb-6">
            <h2 className="text-2xl font-medium text-foreground text-center mb-8">
              Have you sponsored before?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Returning Sponsor */}
              <Link to="/sponsor/login" className="block">
                <div className="h-full p-6 rounded-xl border-2 border-border bg-background hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-foreground mb-2">
                        Yes, I'm returning!
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        Sign in to see your history and sponsor again
                      </p>
                    </div>
                    <Button className="mt-2 h-14 text-lg w-full" size="lg">
                      Sign In
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>

              {/* New Sponsor */}
              <div className="h-full p-6 rounded-xl border-2 border-border bg-background">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 rounded-full bg-muted">
                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      I'm new here
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Enter the code or link the family shared with you
                    </p>
                  </div>
                  <form onSubmit={handleSubmitCode} className="w-full mt-2 space-y-3">
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Enter code or paste link"
                        value={sponsorCode}
                        onChange={(e) => setSponsorCode(e.target.value)}
                        className="h-14 text-lg pl-12"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={!sponsorCode.trim()}
                      className="h-14 text-lg w-full"
                      size="lg"
                    >
                      Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </BookContainer>

          {/* Help Text */}
          <p className="text-center text-lg text-muted-foreground">
            Don't have a sponsor link?{" "}
            <span className="text-foreground">
              Ask the family to send you one from their dashboard.
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorGatewayPage;
