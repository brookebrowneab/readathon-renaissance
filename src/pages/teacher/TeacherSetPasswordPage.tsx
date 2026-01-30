import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Eye, EyeOff, Lock, GraduationCap, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TeacherSetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Listen for auth state changes (magic link will trigger this)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);
      
      if (event === "SIGNED_IN" && session?.user) {
        await handleUserAuthenticated(session.user);
      }
    });

    // Also check if already authenticated
    const checkExistingAuth = async () => {
      // Give Supabase a moment to process the magic link token from URL
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await handleUserAuthenticated(user);
      } else {
        // Check if there's a hash fragment that indicates a magic link
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        
        if (accessToken) {
          // Magic link token is present, Supabase should handle it
          console.log("Magic link token detected, waiting for auth...");
          // Wait a bit more for auth to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { data: { user: retryUser } } = await supabase.auth.getUser();
          if (retryUser) {
            await handleUserAuthenticated(retryUser);
            return;
          }
        }
        
        // No user and no magic link token - redirect to register
        toast.error("Please use the magic link from your invite email");
        navigate("/teacher/register");
      }
    };

    checkExistingAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const handleUserAuthenticated = async (user: { id: string; email?: string }) => {
    // Check if user is a teacher
    const { data: teacher } = await supabase
      .from("teachers")
      .select("id, name, user_id")
      .eq("email", user.email?.toLowerCase())
      .eq("is_active", true)
      .maybeSingle();

    if (!teacher) {
      toast.error("No teacher account found for this email.");
      navigate("/teacher/register");
      return;
    }

    // Auto-link if not already linked
    if (!teacher.user_id) {
      await supabase
        .from("teachers")
        .update({ user_id: user.id })
        .eq("id", teacher.id);
    }

    setTeacherName(teacher.name);
    setIsCheckingAuth(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Error setting password:", error);
        toast.error("Failed to set password. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Password set successfully! Welcome to your dashboard.");
      navigate("/teacher");
    } catch (err) {
      console.error("Error:", err);
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <PublicLayout>
        <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Verifying your account...</p>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-md">
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
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green/10 mx-auto mb-3">
                  <CheckCircle2 className="h-6 w-6 text-brand-green" />
                </div>
                <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-medium mb-3">
                  <GraduationCap className="h-4 w-4" />
                  Almost Done!
                </div>
                <h1 className="font-serif text-2xl text-foreground">
                  Welcome, {teacherName}!
                </h1>
                <p className="text-muted-foreground">
                  Set a password so you can sign in easily next time
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField label="Create Password" htmlFor="password">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormField>

                <FormField label="Confirm Password" htmlFor="confirmPassword">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormField>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Setting password...
                    </>
                  ) : (
                    "Set Password & Continue"
                  )}
                </Button>
              </form>

              {/* Skip option */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/teacher")}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Skip for now (use magic link each time)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default TeacherSetPasswordPage;
