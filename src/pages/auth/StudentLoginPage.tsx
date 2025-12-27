import { Link, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookContainer, BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useState } from "react";
import { KeyRound, Mail, ArrowLeft, Sparkles, Star } from "lucide-react";

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"code" | "email">("code");
  const [studentCode, setStudentCode] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "code") {
      console.log("Student login with code:", studentCode);
    } else {
      console.log("Student login with email:", email);
    }
  };

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-background-warm to-background-warmer flex items-center justify-center py-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-accent-gold opacity-30">
          <Star className="h-12 w-12" />
        </div>
        <div className="absolute top-20 right-16 text-accent-orange opacity-30">
          <Sparkles className="h-10 w-10" />
        </div>
        <div className="absolute bottom-20 left-20 text-accent-gold opacity-30">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="absolute bottom-16 right-10 text-accent-orange opacity-30">
          <Star className="h-14 w-14" />
        </div>

        <div className="container max-w-md">
          <BookContainer variant="warm" className="animate-fade-in">
            <div className="space-y-6">
              {/* Header with fun styling */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent-gold to-accent-orange shadow-lg">
                  <BookIcon size="medium" variant="white" />
                </div>
                <h1 className="font-handwritten text-4xl text-primary mb-2">
                  Student Login
                </h1>
                <p className="text-muted-foreground text-lg">
                  Ready to read? Let's go! 📚
                </p>
              </div>

              {/* Login Method Toggle */}
              <div className="flex gap-2 p-1 bg-secondary rounded-lg">
                <button
                  type="button"
                  onClick={() => setLoginMethod("code")}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                    loginMethod === "code"
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Student Code
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                    loginMethod === "email"
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Email
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {loginMethod === "code" ? (
                  <FormField
                    label="Student Code"
                    htmlFor="studentCode"
                    helperText="Ask your parent or teacher for your special code"
                  >
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-gold" />
                      <Input
                        id="studentCode"
                        placeholder="ABCD-1234"
                        value={studentCode}
                        onChange={(e) =>
                          setStudentCode(e.target.value.toUpperCase())
                        }
                        className="h-14 pl-12 text-center text-xl font-mono uppercase tracking-widest border-accent-gold/30 focus:border-accent-gold"
                        maxLength={10}
                        required
                      />
                    </div>
                  </FormField>
                ) : (
                  <FormField
                    label="Email Address"
                    htmlFor="email"
                    helperText="Use the email your parent registered with"
                  >
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-orange" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 pl-12 text-lg border-accent-orange/30 focus:border-accent-orange"
                        required
                      />
                    </div>
                  </FormField>
                )}

                {/* Large touch-friendly button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg bg-gradient-to-r from-accent-gold to-accent-orange hover:from-accent-gold/90 hover:to-accent-orange/90 text-accent-foreground font-semibold shadow-lg"
                >
                  🚀 Let's Read!
                </Button>
              </form>

              {/* Demo Mode Button */}
              <Button
                variant="secondary"
                size="lg"
                className="w-full h-12"
                onClick={() => navigate("/student-dashboard")}
              >
                ✨ Try Demo Mode
              </Button>

              {/* Fun illustration */}
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <BookIcon size="small" variant="primary" className="opacity-40" />
                  <BookIcon size="medium" variant="primary" className="opacity-60" />
                  <BookIcon size="small" variant="primary" className="opacity-40" />
                </div>
              </div>

              {/* Back to Parent Login */}
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-3"
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
