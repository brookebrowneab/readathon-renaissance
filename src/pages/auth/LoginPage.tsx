import { Link, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Users, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }
    
    toast.success("Signed in successfully!");
    navigate("/dashboard");
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
                  <h1 className="font-serif text-2xl text-foreground">Welcome Back</h1>
                  <p className="text-muted-foreground">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField label="Email" htmlFor="email">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
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
                    <div className="flex justify-end mt-1">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </FormField>

                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me for 30 days
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-center text-muted-foreground mb-2">Demo modes (no login required)</p>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    Parent Demo
                  </Button>
                  <div className="grid grid-cols-4 gap-2">
                    <Link to="/student-login" className="block">
                      <Button variant="outline" className="w-full text-xs px-2">
                        <BookIcon size="small" variant="primary" className="mr-1" />
                        Student
                      </Button>
                    </Link>
                    <Link to="/teacher" className="block">
                      <Button variant="outline" className="w-full text-xs px-2">
                        <Users className="h-4 w-4 mr-1" />
                        Teacher
                      </Button>
                    </Link>
                    <Link to="/sponsor/dashboard" className="block">
                      <Button variant="outline" className="w-full text-xs px-2">
                        <Heart className="h-4 w-4 mr-1" />
                        Sponsor
                      </Button>
                    </Link>
                    <Link to="/admin" className="block">
                      <Button variant="outline" className="w-full text-xs px-2">
                        <Users className="h-4 w-4 mr-1" />
                        Admin
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
      </section>
    </PublicLayout>
  );
};

export default LoginPage;
