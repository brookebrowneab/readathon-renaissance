import { Link, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DecorativeBlob } from "@/components/ui/decorative-blobs";
import { useState, useMemo } from "react";
import { Eye, EyeOff, Mail, Lock, User, Users, Check, X } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Email validation
  const emailError = useMemo(() => {
    if (!touched.email) return undefined;
    if (!formData.email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email";
    return undefined;
  }, [formData.email, touched.email]);

  // Password validation
  const passwordChecks = useMemo(() => {
    return {
      minLength: formData.password.length >= 8,
      hasUppercase: /[A-Z]/.test(formData.password),
      hasNumber: /[0-9]/.test(formData.password),
    };
  }, [formData.password]);

  const passwordStrength = useMemo(() => {
    const checks = Object.values(passwordChecks).filter(Boolean).length;
    if (checks === 0) return { label: "", color: "" };
    if (checks === 1) return { label: "Weak", color: "bg-destructive" };
    if (checks === 2) return { label: "Medium", color: "bg-warning" };
    return { label: "Strong", color: "bg-success" };
  }, [passwordChecks]);

  const passwordError = useMemo(() => {
    if (!touched.password) return undefined;
    if (!formData.password) return "Password is required";
    if (!passwordChecks.minLength || !passwordChecks.hasUppercase || !passwordChecks.hasNumber) {
      return "Password doesn't meet requirements";
    }
    return undefined;
  }, [formData.password, touched.password, passwordChecks]);

  // Confirm password validation
  const confirmPasswordError = useMemo(() => {
    if (!touched.confirmPassword) return undefined;
    if (!formData.confirmPassword) return "Please confirm your password";
    if (formData.password !== formData.confirmPassword) return "Passwords don't match";
    return undefined;
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  const isFormValid = useMemo(() => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email &&
      !emailError &&
      formData.password &&
      !passwordError &&
      formData.confirmPassword &&
      !confirmPasswordError &&
      acceptTerms
    );
  }, [formData, emailError, passwordError, confirmPasswordError, acceptTerms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    
    // Simulate account creation - in real app this would call auth API
    console.log("Register:", formData);
    
    // Store user data temporarily (in real app this would be in session)
    sessionStorage.setItem('parentData', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    }));
    
    // Redirect to onboarding
    setTimeout(() => {
      navigate('/onboarding/add-child');
    }, 500);
  };

  const PasswordCheck = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground" />
      )}
      <span className={met ? "text-success" : "text-muted-foreground"}>{label}</span>
    </div>
  );

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex">
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
        <div className="flex-1 flex items-center justify-center bg-background-warm p-6 lg:p-12 relative overflow-hidden">
          {/* Decorative blobs */}
          <DecorativeBlob position="top-right" size={500} opacity={4} />
          <DecorativeBlob position="bottom-left" size={400} opacity={3} colorClass="text-accent" />
          
          <div className="w-full max-w-md relative z-10">
            <BookContainer variant="default" className="animate-fade-in">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground">
                    Create Your Account
                  </h1>
                  <p className="text-muted-foreground">
                    Join the Read-a-thon community
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField 
                      label="First Name" 
                      htmlFor="firstName" 
                      required
                      error={touched.firstName && !formData.firstName.trim() ? "Required" : undefined}
                    >
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          onBlur={() => markTouched("firstName")}
                          className="pl-10"
                          required
                        />
                      </div>
                    </FormField>

                    <FormField 
                      label="Last Name" 
                      htmlFor="lastName" 
                      required
                      error={touched.lastName && !formData.lastName.trim() ? "Required" : undefined}
                    >
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        onBlur={() => markTouched("lastName")}
                        required
                      />
                    </FormField>
                  </div>

                  <FormField 
                    label="Email" 
                    htmlFor="email" 
                    required
                    error={emailError}
                    helperText={!emailError && touched.email && formData.email ? "✓ Valid email" : undefined}
                  >
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        onBlur={() => markTouched("email")}
                        className="pl-10"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Password"
                    htmlFor="password"
                    required
                    error={passwordError}
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        onBlur={() => markTouched("password")}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-target-small"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${passwordStrength.color}`}
                              style={{ width: `${(Object.values(passwordChecks).filter(Boolean).length / 3) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                        </div>
                        <div className="space-y-1">
                          <PasswordCheck met={passwordChecks.minLength} label="At least 8 characters" />
                          <PasswordCheck met={passwordChecks.hasUppercase} label="One uppercase letter" />
                          <PasswordCheck met={passwordChecks.hasNumber} label="One number" />
                        </div>
                      </div>
                    )}
                  </FormField>

                  <FormField 
                    label="Confirm Password" 
                    htmlFor="confirmPassword" 
                    required
                    error={confirmPasswordError}
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        onBlur={() => markTouched("confirmPassword")}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-target-small"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && !confirmPasswordError && formData.confirmPassword && (
                      <p className="text-xs text-success mt-1">✓ Passwords match</p>
                    )}
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
                      <Link to="/terms" className="text-primary hover:underline inline-link">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline inline-link">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!isFormValid || isSubmitting}
                    loading={isSubmitting}
                  >
                    Create Account
                  </Button>
                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:underline inline-link"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </BookContainer>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default RegisterPage;