import { Link } from "react-router-dom";
import { BookContainer, Logo } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Users } from "lucide-react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[40%] bg-primary items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-hover" />
        <div className="absolute top-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-primary-foreground/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center text-primary-foreground">
          <div className="mb-8">
            <Users className="h-24 w-24 mx-auto mb-6 opacity-90" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Read-a-thon</h2>
          <p className="text-lg opacity-90 max-w-sm">
            Create an account to start tracking your child's reading journey and
            collect pledges from supporters.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-md">
          <BookContainer variant="default" className="animate-fade-in">
            <div className="space-y-6">
              {/* Logo */}
              <div className="text-center">
                <Logo size="medium" className="mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground">
                  Create Your Account
                </h1>
                <p className="text-muted-foreground">
                  Join the Read-a-thon community
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Full Name" htmlFor="name" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </FormField>

                <FormField label="Email" htmlFor="email" required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </FormField>

                <FormField
                  label="Password"
                  htmlFor="password"
                  required
                  helperText="Must be at least 8 characters with one uppercase and one number"
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormField>

                <FormField label="Confirm Password" htmlFor="confirmPassword" required>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormField>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-normal leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={!acceptTerms}>
                  Create Account
                </Button>
              </form>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </BookContainer>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
