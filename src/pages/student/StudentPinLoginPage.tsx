import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { BookOpen, KeyRound, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const StudentPinLoginPage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handlePinChange = (value: string) => {
    // Only allow digits, max 6 characters
    const sanitized = value.replace(/\D/g, "").slice(0, 6);
    setPin(sanitized);
    setError(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // Look up child by PIN
      const { data: child, error: lookupError } = await supabase
        .from("children")
        .select("id, name, total_minutes, goal_minutes")
        .eq("student_pin", pin)
        .maybeSingle();

      if (lookupError) {
        console.error("PIN lookup error:", lookupError);
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!child) {
        setError("Invalid PIN. Please check and try again.");
        setIsLoading(false);
        return;
      }

      // Store student session in sessionStorage (not full auth, just for student access)
      sessionStorage.setItem("studentSession", JSON.stringify({
        childId: child.id,
        name: child.name,
        totalMinutes: child.total_minutes,
        goalMinutes: child.goal_minutes,
      }));

      toast.success(`Welcome back, ${child.name}!`);
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                  Enter your PIN to log your reading
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField
                  label="Your PIN"
                  htmlFor="pin"
                  required
                  error={error}
                >
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="pin"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter your PIN"
                      value={pin}
                      onChange={(e) => handlePinChange(e.target.value)}
                      className="pl-11 text-center text-2xl tracking-[0.5em] font-mono"
                      maxLength={6}
                      autoComplete="off"
                    />
                  </div>
                </FormField>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={pin.length < 4 || isLoading}
                >
                  {isLoading ? "Checking..." : "Start Reading! 🎉"}
                </Button>
              </form>

              {/* Help text */}
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ask your parent for your PIN if you don't know it.
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
      </section>
    </PublicLayout>
  );
};

export default StudentPinLoginPage;
