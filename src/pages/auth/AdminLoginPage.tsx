import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
});

type LoginFormData = z.infer<typeof loginSchema>;

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, signIn, signUp, refreshAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate("/admin-dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
        return;
      }
      // Auth state change will trigger redirect if admin
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignUp = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(data.email, data.password);
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered");
        } else {
          toast.error(error.message);
        }
        return;
      }

      const { error: bootstrapError } = await supabase.functions.invoke("bootstrap-admin", {
        body: {},
      });

      if (bootstrapError) {
        toast.error(bootstrapError.message || "Failed to grant admin access");
        return;
      }

      const nowAdmin = await refreshAdmin();
      if (!nowAdmin) {
        toast.error("Account created, but admin access was not granted.");
        return;
      }

      toast.success("Admin account created! You are now signed in.");
      navigate("/admin-dashboard");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBootstrapAdmin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("bootstrap-admin", { body: {} });
      if (error) {
        toast.error(error.message || "Unable to grant admin access");
        return;
      }

      const nowAdmin = await refreshAdmin();
      if (!nowAdmin) {
        toast.error("Admin access was not granted.");
        return;
      }

      navigate("/admin-dashboard");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show message if logged in but not admin
  if (!isLoading && user && !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center p-4">
          <div 
            className="bg-background p-8 max-w-md w-full text-center shadow-md"
            style={handDrawnBorder}
          >
            <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have admin privileges. Please contact an administrator if you believe this is an error.
            </p>
            <div className="space-y-3">
              <Button onClick={handleBootstrapAdmin} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Complete Admin Setup"
                )}
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="w-full">
                Return to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 bg-background-warm flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>

          <div 
            className="bg-background p-8 shadow-md"
            style={handDrawnBorder}
          >
            <div className="text-center mb-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">Admin Access</h1>
              <p className="text-sm text-muted-foreground mt-2">Sign in to manage the read-a-thon</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="admin@school.edu" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSignUp)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="admin@school.edu" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Admin Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
