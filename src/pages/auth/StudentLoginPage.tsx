import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookContainer, Logo, BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { KeyRound, ArrowLeft } from "lucide-react";

const StudentLoginPage = () => {
  const [sponsorCode, setSponsorCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Student login with sponsor code:", sponsorCode);
  };

  return (
    <PublicLayout>
      <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background-warm py-12">
        <div className="container max-w-md">
          <BookContainer variant="warm" className="animate-fade-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue">
                  <BookIcon size="medium" variant="white" />
                </div>
                <h1 className="font-handwritten text-3xl text-brand-blue">Student Login</h1>
                <p className="text-muted-foreground">
                  Enter your sponsor code to access your reading dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sponsorCode">Sponsor Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="sponsorCode"
                      placeholder="Enter your 10-character code"
                      value={sponsorCode}
                      onChange={(e) => setSponsorCode(e.target.value.toUpperCase())}
                      className="pl-10 text-center text-lg font-mono uppercase tracking-wider"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    Ask your parent or teacher for your sponsor code
                  </p>
                </div>

                <Button type="submit" className="w-full bg-brand-blue text-white hover:bg-brand-blue/90">
                  Log In as Student
                </Button>
              </form>

              {/* Decorative illustration */}
              <div className="flex justify-center opacity-20">
                <BookIcon size="large" variant="primary" />
              </div>

              {/* Back to Parent Login */}
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Parent or Teacher? Sign in here
              </Link>
            </div>
          </BookContainer>
        </div>
      </section>
    </PublicLayout>
  );
};

export default StudentLoginPage;
