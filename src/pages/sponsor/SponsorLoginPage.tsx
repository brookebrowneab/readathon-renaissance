import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
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
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

type ViewMode = "email" | "find-account" | "account-found" | "not-found";

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
  school: "Lincoln Elementary",
  year: "2024",
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
    
    // Simulate finding/not finding an account (for demo, find if name starts with E)
    if (childName.toLowerCase().startsWith("e")) {
      setFoundAccount(mockSearchResult);
      setViewMode("account-found");
    } else {
      setViewMode("not-found");
    }
  };

  const handleSendToFoundEmail = async () => {
    if (!foundAccount) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    navigate("/sponsor/check-email", { state: { email: foundAccount.maskedEmail } });
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
                <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-10 w-10 text-brand-blue" />
                </div>
                <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground mb-3">
                  Welcome Back!
                </h1>
                <p className="text-lg text-muted-foreground">
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

                <p className="text-center text-lg text-muted-foreground">
                  We'll email you a link to sign in. No password needed!
                </p>
              </form>

              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <p className="text-lg text-muted-foreground text-center">
                  First time sponsoring? Ask the family for their child's sponsor link.
                </p>
                
                <button
                  onClick={() => setViewMode("find-account")}
                  className="w-full flex items-center justify-center gap-2 text-lg text-primary hover:underline"
                >
                  <HelpCircle className="h-5 w-5" />
                  Not sure what email you used? Find my account
                </button>
              </div>
            </BookContainer>
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
                className="flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to email login
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-brand-blue" />
                </div>
                <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground mb-3">
                  Let's find your account
                </h1>
                <p className="text-lg text-muted-foreground">
                  Search by the child you sponsored
                </p>
              </div>

              <form onSubmit={handleFindAccount} className="space-y-6">
                <FormField label="Child's First Name" htmlFor="childName" required>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="childName"
                      placeholder="Emma"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="h-14 text-lg pl-12"
                      required
                    />
                  </div>
                </FormField>

                <FormField label="School" htmlFor="school" required>
                  <Select value={school} onValueChange={setSchool}>
                    <SelectTrigger className="h-14 text-lg">
                      <School className="h-5 w-5 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_SCHOOLS.map((s) => (
                        <SelectItem key={s} value={s} className="text-lg py-3">
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
                  Find Account
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-lg text-muted-foreground text-center">
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

  // Not Found View
  if (viewMode === "not-found") {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />

        <main className="flex-1 bg-background-warm flex items-center justify-center py-12">
          <div className="container max-w-md">
            <BookContainer variant="default" className="p-8">
              <button
                onClick={() => {
                  setViewMode("find-account");
                }}
                className="flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to search
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground mb-3">
                  No Match Found
                </h1>
                <p className="text-lg text-muted-foreground">
                  We couldn't find a matching sponsorship.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 mb-6">
                <p className="text-lg text-foreground text-center">
                  You may have used a different email address when you sponsored before.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setChildName("");
                    setSchool("");
                    setViewMode("find-account");
                  }}
                  variant="outline"
                  className="w-full h-14 text-lg"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Try Again
                </Button>

                <p className="text-lg text-muted-foreground text-center">
                  Or contact us at{" "}
                  <a href="mailto:help@school.org" className="text-primary hover:underline">
                    help@school.org
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
              className="flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              Search again
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground mb-3">
                Found it!
              </h1>
              <p className="text-lg text-muted-foreground">
                You sponsored a student at {foundAccount?.school} in {foundAccount?.year}.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-2">Your account email is:</p>
                <p className="text-2xl font-mono font-medium text-foreground">
                  {foundAccount?.maskedEmail}
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
                Send login link to this email
              </Button>

              <p className="text-center text-lg text-muted-foreground">
                We'll send a link to sign you in
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-lg text-muted-foreground text-center">
                Not your account?{" "}
                <button
                  onClick={() => {
                    setViewMode("find-account");
                    setFoundAccount(null);
                    setChildName("");
                    setSchool("");
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