import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { handDrawnBorder, handDrawnBorderSubtle } from "@/lib/admin-styles";
import {
  Heart,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  Users,
  BookOpen,
} from "lucide-react";

const SponsorGatewayPage = () => {
  const navigate = useNavigate();
  const [sponsorCode, setSponsorCode] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is already signed in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is signed in - redirect to sponsor dashboard
        navigate("/sponsor/dashboard", { replace: true });
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (sponsorCode.trim()) {
      navigate(`/s/${sponsorCode.trim()}`);
    }
  };

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/30 mb-6">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-4 relative inline-block">
              Welcome, Sponsor!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for supporting young readers
            </p>
          </div>

          {/* Main Options */}
          <div className="bg-card p-8 mb-6" style={handDrawnBorder}>
            <h2 className="font-serif text-2xl text-foreground text-center mb-8">
              How would you like to help?
            </h2>

            <div className="grid gap-6">
              {/* Support a Classroom - Primary Option */}
              <Link to="/sponsor/class" className="block">
                <div className="p-6 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group" style={handDrawnBorder}>
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4">
                    <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors shrink-0">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl text-foreground mb-2">
                        Support a Classroom
                      </h3>
                      <p className="text-muted-foreground">
                        Make a pledge that supports an entire class of readers. 
                        Your contribution motivates all students to reach their goals!
                      </p>
                    </div>
                    <Button className="h-12 text-lg shrink-0" size="lg">
                      Get Started
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Returning Sponsor */}
              <Link to="/sponsor/login" className="block">
                <div className="p-6 bg-background hover:bg-primary/5 transition-all cursor-pointer group" style={handDrawnBorderSubtle}>
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl text-foreground mb-2">
                        I've sponsored before
                      </h3>
                      <p className="text-muted-foreground">
                        Sign in to see your history and sponsor again
                      </p>
                    </div>
                    <Button variant="outline" className="h-12 text-lg shrink-0" size="lg">
                      Sign In
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Have a Link */}
              <div className="p-6 bg-background" style={handDrawnBorderSubtle}>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 rounded-full bg-muted">
                    <LinkIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      Have a sponsor link?
                    </h3>
                    <p className="text-muted-foreground">
                      Enter the code or link from a family
                    </p>
                  </div>
                  <form onSubmit={handleSubmitCode} className="w-full mt-2 space-y-3 max-w-md">
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
                      className="h-12 text-lg w-full"
                      size="lg"
                    >
                      Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="font-serif text-lg text-muted-foreground flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" />
              Want to support a specific child?
            </p>
            <p className="text-foreground">
              Ask their parent for a sponsor link from their dashboard.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorGatewayPage;
