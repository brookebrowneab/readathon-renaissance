import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Mail, GraduationCap, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TeacherRegisterPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Check if this email exists in the teachers table
      const { data: teacherRecord, error: teacherError } = await supabase
        .from("teachers")
        .select("id, name, is_active")
        .eq("email", email.toLowerCase())
        .eq("is_active", true)
        .maybeSingle();

      if (teacherError) {
        console.error("Error checking teacher record:", teacherError);
        toast.error("An error occurred. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!teacherRecord) {
        toast.error(
          "No teacher account found for this email. Please contact your administrator to be added to the system."
        );
        setIsLoading(false);
        return;
      }

      // Step 2: Send magic link - redirect to set-password page
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/teacher/set-password`,
        },
      });

      if (signInError) {
        console.error("Error sending magic link:", signInError);
        toast.error("Failed to send login link. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success
      setEmailSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-green/10 mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-brand-green" />
                </div>
                <h1 className="font-serif text-2xl text-foreground">
                  Check Your Email
                </h1>
                <p className="text-muted-foreground">
                  We've sent a magic link to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Click the link in your email to sign in.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    Didn't receive the email?
                  </p>
                  <p>Check your spam folder or try again in a few minutes.</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                >
                  Try a different email
                </Button>
              </div>
            </div>
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
                <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-medium mb-3">
                  <GraduationCap className="h-4 w-4" />
                  Teacher Registration
                </div>
                <h1 className="font-serif text-2xl text-foreground">
                  Get Started
                </h1>
                <p className="text-muted-foreground">
                  Enter your school email to receive a sign-in link
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField label="School Email" htmlFor="email">
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    "Send Magic Link"
                  )}
                </Button>
              </form>

              {/* Info Box */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">How it works</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Your administrator adds you to the system</li>
                  <li>Enter your school email above</li>
                  <li>Click the link we email you to sign in</li>
                </ol>
              </div>

              {/* Already have account */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/teacher/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in with password
                </Link>
              </p>

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

export default TeacherRegisterPage;
