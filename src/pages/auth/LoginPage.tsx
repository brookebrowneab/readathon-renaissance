import { Link, useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookContainer, Logo, BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, BookOpen, Users } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
    console.log("Login:", { email, password });
  };

  const handleDemoMode = () => {
    navigate("/dashboard");
  };

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex">
        {/* Left Side - Illustration (Desktop Only) */}
        <div className="hidden lg:flex lg:w-[40%] bg-primary items-center justify-center p-12 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-hover" />
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 text-center text-primary-foreground">
            <div className="mb-8">
              <BookOpen className="h-24 w-24 mx-auto mb-6 opacity-90" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome to Read-a-thon</h2>
            <p className="text-lg opacity-90 max-w-sm">
              Track reading progress, collect pledges, and celebrate achievements together.
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
                  <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
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

                  <Button type="submit" className="w-full">
                    Sign In
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

                {/* Demo Modes */}
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleDemoMode}
                  >
                    Parent Demo
                  </Button>
                  <div className="grid grid-cols-3 gap-2">
                    <Link to="/student-login" className="block">
                      <Button variant="outline" className="w-full text-xs px-2">
                        <BookIcon size="small" variant="primary" className="mr-1" />
                        Student
                      </Button>
                    </Link>
                    <Link to="/teacher-dashboard" className="block">
                      <Button variant="outline" className="w-full text-xs px-2">
                        <Users className="h-4 w-4 mr-1" />
                        Teacher
                      </Button>
                    </Link>
                    <Link to="/admin-dashboard" className="block">
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
            </BookContainer>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LoginPage;
