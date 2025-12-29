import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookContainer, Logo } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Eye, EyeOff, BookOpen, Sparkles } from "lucide-react";
import { toast } from "sonner";

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.username.trim() && formData.password.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Store student session
    sessionStorage.setItem("studentData", JSON.stringify({
      firstName: "Emma",
      lastName: "J",
      grade: "3rd Grade",
      readingGoal: 500,
      minutesRead: 247,
    }));

    toast.success("Welcome back!");
    navigate("/student");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-yellow/20 to-background-warm flex flex-col">
      {/* Fun Header */}
      <header className="p-6 flex items-center justify-center">
        <Logo size="large" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <BookContainer variant="default" className="p-8">
            <div className="space-y-8">
              {/* Fun Header */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-brand-blue" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome, Reader!
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Ready to track your reading?
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="What's your username?" htmlFor="username">
                  <Input
                    id="username"
                    placeholder="Type your username"
                    value={formData.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    className="h-14 text-xl"
                    required
                  />
                </FormField>

                <FormField label="What's your password?" htmlFor="password">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Type your password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="h-14 text-xl pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-6 w-6" />
                      ) : (
                        <Eye className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </FormField>

                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  loading={isSubmitting}
                  className="w-full h-16 text-2xl font-bold bg-brand-yellow hover:bg-accent-hover text-foreground"
                >
                  <Sparkles className="h-6 w-6 mr-2" />
                  Let's Read!
                </Button>
              </form>

              {/* Help Text */}
              <p className="text-center text-lg text-muted-foreground">
                Forgot your password? Ask a parent or teacher!
              </p>

              {/* Parent Login Link */}
              <div className="text-center pt-4 border-t">
                <Link
                  to="/login"
                  className="text-primary hover:underline text-lg inline-link"
                >
                  Parent or Teacher? Login here
                </Link>
              </div>
            </div>
          </BookContainer>
        </div>
      </main>
    </div>
  );
};

export default StudentLoginPage;