import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Search,
  User,
  School,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

type ViewMode = "email" | "find-account" | "account-found";

// Mock schools
const MOCK_SCHOOLS = [
  "Lincoln Elementary",
  "Washington Elementary", 
  "Jefferson Primary",
  "Roosevelt School",
];

// Mock search result
const mockSearchResult = {
  maskedEmail: "g***a@e*****.com",
  fullEmail: "grandma@example.com",
  sponsorName: "Grandma Smith",
};

const SponsorLoginPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("email");
  
  // Email login state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find account state
  const [childName, setChildName] = useState("");
  const [school, setSchool] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundAccount, setFoundAccount] = useState<typeof mockSearchResult | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    navigate("/sponsor/check-email", { state: { email } });
    toast.success("Login link sent!");
  };

  const handleFindAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !school) return;

    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSearching(false);
    
    // Simulate finding an account
    setFoundAccount(mockSearchResult);
    setViewMode("account-found");
  };

  const handleSendToFoundEmail = async () => {
    if (!foundAccount) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    navigate("/sponsor/check-email", { state: { email: foundAccount.fullEmail } });
    toast.success("Login link sent!");
  };

  // Email Login View
  if (viewMode === "email") {
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

              <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                <button
                  onClick={() => setViewMode("find-account")}
                  className="w-full flex items-center justify-center gap-2 text-primary hover:underline"
                >
                  <HelpCircle className="h-4 w-4" />
                  Forgot your email? Find your account
                </button>
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
  }

  // Find Account View
  if (viewMode === "find-account") {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />

        <main className="flex-1 bg-background-warm flex items-center justify-center py-12">
          <div className="container max-w-md">
            <BookContainer variant="default" className="p-8">
              <button
                onClick={() => setViewMode("email")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to email login
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-brand-blue" />
                </div>
                <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground mb-2">
                  Find Your Account
                </h1>
                <p className="text-muted-foreground">
                  Search by the child you sponsored
                </p>
              </div>

              <form onSubmit={handleFindAccount} className="space-y-6">
                <FormField label="Child's First Name" htmlFor="childName" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="childName"
                      placeholder="Emma"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="h-14 text-lg pl-10"
                      required
                    />
                  </div>
                </FormField>

                <FormField label="School" htmlFor="school" required>
                  <Select value={school} onValueChange={setSchool}>
                    <SelectTrigger className="h-14 text-lg">
                      <School className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_SCHOOLS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <Button
                  type="submit"
                  disabled={!childName || !school || isSearching}
                  loading={isSearching}
                  className="w-full h-14 text-lg"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find My Account
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Can't find your account?{" "}
                  <a href="mailto:help@school.org" className="text-primary hover:underline">
                    Contact support
                  </a>
                </p>
              </div>
            </BookContainer>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Account Found View
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm flex items-center justify-center py-12">
        <div className="container max-w-md">
          <BookContainer variant="default" className="p-8">
            <button
              onClick={() => {
                setViewMode("find-account");
                setFoundAccount(null);
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Search again
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground mb-2">
                Account Found!
              </h1>
              <p className="text-muted-foreground">
                We found an account matching your search
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Email on file</p>
                <p className="text-2xl font-mono font-medium text-foreground">
                  {foundAccount?.maskedEmail}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Sponsored by: <span className="font-medium text-foreground">{foundAccount?.sponsorName}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleSendToFoundEmail}
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full h-14 text-lg"
                size="lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                Send Login Link
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                We'll send a magic link to your email address
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Not your account?{" "}
                <button
                  onClick={() => {
                    setViewMode("find-account");
                    setFoundAccount(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Try a different search
                </button>
              </p>
            </div>
          </BookContainer>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorLoginPage;
