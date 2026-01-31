import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useSponsorAuth } from "@/hooks/useSponsorAuth";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, BookOpen, Phone } from "lucide-react";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";
import { z } from "zod";

// Validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");
const phoneSchema = z.string().regex(/^[\d\s\-\+\(\)]{7,20}$/, "Please enter a valid phone number").or(z.literal(""));

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

type AuthMode = "login" | "signup";

const SponsorAuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isAuthenticated, loading } = useSponsorAuth();
  
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; phone?: string }>({});

  // Get the redirect URL from location state or default to invite page
  const from = (location.state as { from?: string })?.from || "/invite";

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0]?.message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0]?.message;
      }
    }
    
    if (mode === "signup") {
      try {
        nameSchema.parse(name);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.name = e.errors[0]?.message;
        }
      }
      
      // Phone is optional, only validate if provided
      if (phone) {
        try {
          phoneSchema.parse(phone);
        } catch (e) {
          if (e instanceof z.ZodError) {
            newErrors.phone = e.errors[0]?.message;
          }
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password. Please try again.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate(from, { replace: true });
        }
      } else {
        const { error } = await signUp(email, password, name, phone);
        if (error) {
          if (error.message?.includes("already registered")) {
            toast.error("This email is already registered. Please log in instead.");
            setMode("login");
          } else {
            toast.error(error.message || "Failed to create account");
          }
        } else {
          toast.success("Account created! Welcome aboard!");
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container py-20 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-8 md:py-12 relative overflow-hidden">
        {/* Bookshelf background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url(${booksShelfBannerV2})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 60%',
            backgroundPosition: 'center bottom',
          }}
          aria-hidden="true"
        />

        <div className="container relative">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground mb-2">
                {mode === "login" ? "Welcome Back!" : "Become a Sponsor"}
              </h1>
              <p className="text-muted-foreground">
                {mode === "login" 
                  ? "Sign in to continue supporting young readers" 
                  : "Create an account to sponsor a student's reading journey"}
              </p>
            </div>

            {/* Auth Form */}
            <div 
              className="bg-background p-6 md:p-8 shadow-md"
              style={handDrawnBorder}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                  <FormField 
                    label="Your name" 
                    htmlFor="name"
                    error={errors.name}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="h-12 pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormField>
                )}

                {mode === "signup" && (
                  <FormField 
                    label="Phone number (optional)" 
                    htmlFor="phone"
                    error={errors.phone}
                    helperText="For pledge reminders and event updates"
                  >
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="h-12 pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormField>
                )}

                <FormField
                  label="Email address" 
                  htmlFor="email"
                  error={errors.email}
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </FormField>

                <FormField 
                  label="Password" 
                  htmlFor="password"
                  error={errors.password}
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "signup" ? "Create a password (6+ chars)" : "Enter your password"}
                      className="h-12 pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </FormField>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg"
                  disabled={isSubmitting}
                  style={handDrawnBorder}
                >
                  {isSubmitting ? (
                    "Please wait..."
                  ) : mode === "login" ? (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Toggle mode */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setErrors({});
                  }}
                  className="text-primary hover:underline font-medium mt-1"
                  disabled={isSubmitting}
                >
                  {mode === "login" ? "Create one now" : "Sign in instead"}
                </button>
              </div>
            </div>

            {/* Back link */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SponsorAuthPage;
