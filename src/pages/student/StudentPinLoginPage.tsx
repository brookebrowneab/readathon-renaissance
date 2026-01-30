import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { BookOpen, User, KeyRound, ArrowLeft, Eye, EyeOff, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  
  // Forgot password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleUsernameChange = (value: string) => {
    // Lowercase, no spaces
    const sanitized = value.toLowerCase().replace(/\s/g, "");
    setUsername(sanitized);
    setError(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // Call edge function for secure login
      const { data, error: loginError } = await supabase.functions.invoke("student-login", {
        body: { username, password },
      });

      if (loginError) {
        console.error("Login error:", loginError);
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data.error) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      if (!data.success || !data.child) {
        setError("Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Store student session in sessionStorage (cleared on browser close)
      sessionStorage.setItem("studentSession", JSON.stringify({
        childId: data.child.id,
        name: data.child.name,
        totalMinutes: data.child.totalMinutes,
        goalMinutes: data.child.goalMinutes,
        className: data.child.className,
        gradeInfo: data.child.gradeInfo,
      }));

      toast.success(`Welcome back, ${data.child.name}!`);
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (forgotUsername.length < 3) {
      toast.error("Please enter your username");
      return;
    }

    setForgotLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("student-forgot-password", {
        body: { username: forgotUsername },
      });

      if (error) {
        console.error("Forgot password error:", error);
        toast.error("Something went wrong. Please try again.");
      } else {
        setForgotSent(true);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgotDialog = () => {
    setForgotUsername(username); // Pre-fill with current username
    setForgotSent(false);
    setForgotOpen(true);
  };

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-sm relative z-10">
          <div
            className="animate-fade-in bg-card p-8 shadow-book"
            style={{
              border: "solid 1px #41403E",
              borderTopLeftRadius: "255px 15px",
              borderTopRightRadius: "15px 225px",
              borderBottomRightRadius: "225px 15px",
              borderBottomLeftRadius: "15px 255px",
            }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium mb-3">
                  <BookOpen className="h-4 w-4" />
                  Student Login
                </div>
                <h1 className="font-serif text-2xl text-foreground">
                  Hi, Reader! 📚
                </h1>
                <p className="text-muted-foreground">
                  Enter your username and password to log your reading
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Username"
                  htmlFor="username"
                  required
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Your username"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className="pl-11"
                      autoComplete="username"
                      autoCapitalize="off"
                    />
                  </div>
                </FormField>

                <FormField
                  label="Password"
                  htmlFor="password"
                  required
                  error={error}
                >
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(undefined);
                      }}
                      className="pl-11 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={username.length < 3 || password.length < 4 || isLoading}
                >
                  {isLoading ? "Logging in..." : "Start Reading! 🎉"}
                </Button>
              </form>

              {/* Help text */}
              <div className="text-center space-y-3">
                <button
                  type="button"
                  onClick={openForgotDialog}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </button>
                <p className="text-sm text-muted-foreground">
                  Don't have a login yet? Ask your parent to set one up!
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Parent/Sponsor login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Forgot Password Dialog */}
        <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Forgot Password?
              </DialogTitle>
              <DialogDescription>
                {forgotSent 
                  ? "We've sent a message to your parent!"
                  : "Enter your username and we'll let your parent know you need help."
                }
              </DialogDescription>
            </DialogHeader>

            {forgotSent ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Email Sent!</p>
                  <p className="text-sm text-muted-foreground">
                    Your parent will get an email with instructions to reset your password.
                    Ask them to check their inbox!
                  </p>
                </div>
                <Button onClick={() => setForgotOpen(false)} className="w-full">
                  Got it!
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <FormField label="Your Username" htmlFor="forgot-username" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="forgot-username"
                      type="text"
                      placeholder="Enter your username"
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                      className="pl-11"
                      autoComplete="username"
                      autoCapitalize="off"
                    />
                  </div>
                </FormField>

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setForgotOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={forgotUsername.length < 3 || forgotLoading}
                    className="flex-1"
                  >
                    {forgotLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Notify Parent
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </PublicLayout>
  );
};

export default StudentLoginPage;
