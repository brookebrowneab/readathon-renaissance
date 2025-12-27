import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookContainer, Logo, BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
    console.log("Login:", { email, password });
  };

  return (
    <PublicLayout>
      <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background-warm py-12">
        <div className="container max-w-md">
          <BookContainer variant="default" className="animate-fade-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <Logo size="medium" className="mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to your parent account</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-brand-blue hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me for 30 days
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-brand-blue text-white hover:bg-brand-blue/90">
                  Sign In
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* Demo Mode */}
              <Link to="/dashboard">
                <Button variant="secondary" className="w-full">
                  Enter Demo Mode
                </Button>
              </Link>

              {/* Student Login Link */}
              <Link to="/student-login">
                <Button variant="outline" className="w-full">
                  <BookIcon size="small" variant="primary" className="mr-2" />
                  Student Login
                </Button>
              </Link>

              {/* Register Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-medium text-brand-blue hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </BookContainer>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LoginPage;
