import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Eye, EyeOff, Mail, Lock, GraduationCap, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TeacherLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Sign in with email/password
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        toast.error(signInError.message);
        setIsLoading(false);
        return;
      }

      // Step 2: Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Step 3: Check if user already has a linked teacher record
      let { data: teacherRecord, error: teacherError } = await supabase
        .from("teachers")
        .select("id, name, is_active, user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Step 4: If no linked record, try to auto-link by email
      if (!teacherRecord && user.email) {
        const { data: teacherByEmail, error: emailError } = await supabase
          .from("teachers")
          .select("id, name, is_active, user_id, email")
          .eq("email", user.email.toLowerCase())
          .is("user_id", null)
          .maybeSingle();

        if (teacherByEmail && !emailError) {
          // Found a matching teacher by email - link the account
          const { error: updateError } = await supabase
            .from("teachers")
            .update({ user_id: user.id })
            .eq("id", teacherByEmail.id);

          if (!updateError) {
            teacherRecord = { ...teacherByEmail, user_id: user.id };
            toast.success("Your account has been linked to your teacher profile!");
          }
        }
      }

      if (teacherError) {
        console.error("Error checking teacher record:", teacherError);
        await signOut();
        toast.error("Error verifying teacher access. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!teacherRecord) {
        // No teacher record linked to this user
        await signOut();
        toast.error("No teacher account found for this email. Please contact your administrator.");
        setIsLoading(false);
        return;
      }

      if (!teacherRecord.is_active) {
        // Teacher account is inactive
        await signOut();
        toast.error("Your teacher account is inactive. Please contact your administrator.");
        setIsLoading(false);
        return;
      }

      // Success - redirect to teacher dashboard
      toast.success(`Welcome back, ${teacherRecord.name}!`);
      navigate("/teacher");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div 
            className="animate-fade-in bg-card p-8 shadow-book"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-medium mb-3">
                  <GraduationCap className="h-4 w-4" />
                  Teacher Login
                </div>
                <h1 className="font-serif text-2xl text-foreground">Welcome, Teacher</h1>
                <p className="text-muted-foreground">
                  Sign in to view your students' progress
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField label="Email" htmlFor="email">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </FormField>

                <FormField label="Password" htmlFor="password">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
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
                  <div className="flex justify-end mt-1">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </FormField>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Info Box */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">First time logging in?</p>
                <p>
                  Your administrator should have created an account for you and linked it to your teacher profile.
                  If you're having trouble, please contact your school administrator.
                </p>
              </div>

              {/* Back to main login */}
              <p className="text-center text-sm text-muted-foreground">
                Not a teacher?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Parent/Sponsor login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default TeacherLoginPage;
