import { Link, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { Eye, EyeOff, Mail, Lock, User, Users, Check, X, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
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

  // Phone validation (optional but validate format if provided)
  const phoneError = useMemo(() => {
    if (!touched.phone || !formData.phone) return undefined;
    const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
    if (!phoneRegex.test(formData.phone)) return "Please enter a valid phone number";
    return undefined;
  }, [formData.phone, touched.phone]);

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
    
    const displayName = `${formData.firstName} ${formData.lastName}`;
    const { error } = await signUp(formData.email, formData.password, displayName);
    
    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }
    
    // Store parent data for onboarding flow (including phone for profile update)
    sessionStorage.setItem('parentData', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    }));
    
    toast.success("Account created! Let's add your child.");
    navigate('/onboarding/add-child');
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
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
          
          <div className="w-full max-w-md relative z-10">
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
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                    <Users className="h-4 w-4" />
                    Parent / Sponsor Registration
                  </div>
                  <h1 className="font-serif text-2xl text-foreground">
                    Create Your Account
                  </h1>
                  <p className="text-muted-foreground">
                    Sign up as a parent or sponsor to support young readers
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
                    label="Phone Number" 
                    htmlFor="phone"
                    error={phoneError}
                    helperText="Optional - for event updates and reminders"
                  >
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        onBlur={() => markTouched("phone")}
                        className="pl-10"
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
                      <Link to="/privacy" className="text-primary hover:underline inline-link">
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
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
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
            </div>
          </div>
      </section>
    </PublicLayout>
  );
};

export default RegisterPage;
