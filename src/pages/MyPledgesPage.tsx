import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

interface Pledge {
  id: string;
  student_name: string;
  amount: number;
  pledge_type: string;
  payment_status: string;
  is_paid: boolean;
  expected_payment_method: string | null;
  created_at: string;
}

const MyPledgesPage = () => {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPledges = async () => {
      try {
        setIsLoading(true);
        
        // Get current user's sponsor profile
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Show demo data for non-authenticated users
          setPledges([
            {
              id: "1",
              student_name: "Emma Johnson",
              amount: 50,
              pledge_type: "flat",
              payment_status: "pending",
              is_paid: false,
              expected_payment_method: "card",
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              student_name: "Lucas Johnson",
              amount: 0.25,
              pledge_type: "per_minute",
              payment_status: "paid",
              is_paid: true,
              expected_payment_method: "check",
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]);
          setIsLoading(false);
          return;
        }

        // Get sponsor record for current user
        const { data: sponsor } = await supabase
          .from("sponsors")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (sponsor) {
          // Fetch pledges for this sponsor
          const { data: pledgesData, error: pledgesError } = await supabase
            .from("pledges")
            .select("*")
            .eq("sponsor_id", sponsor.id)
            .order("created_at", { ascending: false });

          if (pledgesError) throw pledgesError;
          setPledges(pledgesData || []);
        } else {
          // User might be a parent - for now show empty
          setPledges([]);
        }
      } catch (err) {
        console.error("Error fetching pledges:", err);
        setError("Failed to load pledges");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPledges();
  }, []);

  const totalPledged = pledges.reduce((sum, p) => {
    if (p.pledge_type === "flat") return sum + p.amount;
    // For per-minute pledges, we'd need reading minutes - show base amount for now
    return sum + p.amount * 100; // Estimate based on 100 minutes
  }, 0);

  const paidCount = pledges.filter(p => p.is_paid).length;
  const pendingCount = pledges.filter(p => !p.is_paid).length;

  const getStatusBadge = (pledge: Pledge) => {
    if (pledge.is_paid) {
      return <Badge className="bg-success/10 text-success border-success/20">Paid</Badge>;
    }
    if (pledge.payment_status === "pending") {
      return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
    }
    return <Badge variant="secondary">{pledge.payment_status}</Badge>;
  };

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "check":
        return <FileText className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Back Link */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground">
              My Pledges
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              View and manage pledges you've made to support readers
            </p>
          </div>

          {/* Summary Stats */}
          <div 
            className="grid grid-cols-3 gap-4 p-4 bg-background mb-6"
            style={handDrawnBorder}
          >
            <div className="text-center">
              <p className="text-2xl font-serif text-primary">${totalPledged.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Total Pledged</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-2xl font-serif text-success">{paidCount}</p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-serif text-muted-foreground">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading pledges...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div 
              className="p-6 bg-destructive/10 text-center"
              style={handDrawnBorder}
            >
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && pledges.length === 0 && (
            <div 
              className="p-8 bg-background text-center"
              style={handDrawnBorder}
            >
              <DollarSign className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">No pledges yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any pledges to support readers.
              </p>
              <Button asChild>
                <Link to="/sponsor">Make a Pledge</Link>
              </Button>
            </div>
          )}

          {/* Pledges List */}
          {!isLoading && !error && pledges.length > 0 && (
            <div className="space-y-4">
              {pledges.map((pledge) => (
                <div
                  key={pledge.id}
                  className="p-4 bg-background"
                  style={handDrawnBorder}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {pledge.student_name}
                        </span>
                        {getStatusBadge(pledge)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(pledge.created_at), "MMM d, yyyy")}
                        </span>
                        {pledge.expected_payment_method && (
                          <span className="flex items-center gap-1">
                            {getPaymentMethodIcon(pledge.expected_payment_method)}
                            {pledge.expected_payment_method === "card" ? "Card" : "Check"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-serif text-xl text-primary">
                        ${pledge.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pledge.pledge_type === "flat" ? "flat amount" : "per minute"}
                      </p>
                    </div>
                  </div>

                  {!pledge.is_paid && (
                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      <Button size="sm" className="flex-1">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPledgesPage;
