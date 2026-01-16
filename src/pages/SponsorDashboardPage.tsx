import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  CreditCard,
  Copy,
  Mail,
  Share2,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  FileText,
  Receipt,
  Plus,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type PledgeStatus = "active" | "paid" | "pending";
type PledgeType = "per-minute" | "flat";

interface Pledge {
  id: string;
  childName: string;
  childGrade: string;
  pledgeType: PledgeType;
  amount: number;
  maxCap?: number;
  status: PledgeStatus;
  minutesRead: number;
  goalMinutes: number;
  projectedAmount: number;
  createdAt: string;
  sponsorLink: string;
  allowSponsorSharing: boolean; // Whether this sponsor can share
}

interface Payment {
  id: string;
  date: string;
  childName: string;
  amount: number;
  method: string;
  receiptUrl: string;
  transactionId: string;
}

// Mock data
const mockSponsor = {
  name: "John Smith",
  email: "john@example.com",
  totalPledged: 185.00,
  totalPaid: 75.00,
  childrenSupported: 3,
};

const mockPledges: Pledge[] = [
  {
    id: "1",
    childName: "Emma S.",
    childGrade: "3rd Grade",
    pledgeType: "per-minute",
    amount: 0.10,
    maxCap: 50,
    status: "active",
    minutesRead: 245,
    goalMinutes: 300,
    projectedAmount: 30.00,
    createdAt: "2024-03-01",
    sponsorLink: "/sponsor/emma-123",
    allowSponsorSharing: true, // Parent allowed sharing for this child
  },
  {
    id: "2",
    childName: "Lucas T.",
    childGrade: "2nd Grade",
    pledgeType: "flat",
    amount: 25,
    status: "paid",
    minutesRead: 180,
    goalMinutes: 250,
    projectedAmount: 25.00,
    createdAt: "2024-03-05",
    sponsorLink: "/sponsor/lucas-456",
    allowSponsorSharing: false, // Parent did not allow sharing
  },
  {
    id: "3",
    childName: "Sophia M.",
    childGrade: "4th Grade",
    pledgeType: "per-minute",
    amount: 0.05,
    status: "pending",
    minutesRead: 320,
    goalMinutes: 300,
    projectedAmount: 16.00,
    createdAt: "2024-03-08",
    sponsorLink: "/sponsor/sophia-789",
    allowSponsorSharing: true,
  },
];

const mockPayments: Payment[] = [
  {
    id: "1",
    date: "2024-03-10",
    childName: "Lucas T.",
    amount: 25.00,
    method: "Credit Card",
    receiptUrl: "#",
    transactionId: "sq_txn_12345",
  },
  {
    id: "2",
    date: "2024-02-15",
    childName: "Oliver R.",
    amount: 50.00,
    method: "Credit Card",
    receiptUrl: "#",
    transactionId: "sq_txn_67890",
  },
];

const statusConfig: Record<PledgeStatus, { label: string; variant: "default" | "secondary" | "outline"; icon: React.ReactNode }> = {
  active: { label: "Active", variant: "default", icon: <TrendingUp className="h-3 w-3" /> },
  paid: { label: "Paid", variant: "secondary", icon: <CheckCircle2 className="h-3 w-3" /> },
  pending: { label: "Pending Payment", variant: "outline", icon: <Clock className="h-3 w-3" /> },
};

export default function SponsorDashboardPage() {
  const { toast } = useToast();
  const [selectedPledge, setSelectedPledge] = useState<Pledge | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedAmount, setUpdatedAmount] = useState("");

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(window.location.origin + link);
    toast({
      title: "Link Copied",
      description: "Sponsor link copied to clipboard!",
    });
  };

  const handleUpdatePledge = (pledge: Pledge) => {
    setSelectedPledge(pledge);
    setUpdatedAmount(pledge.amount.toString());
    setIsUpdateDialogOpen(true);
  };

  const submitPledgeUpdate = () => {
    toast({
      title: "Pledge Updated",
      description: `Your pledge for ${selectedPledge?.childName} has been updated.`,
    });
    setIsUpdateDialogOpen(false);
    setSelectedPledge(null);
  };

  const handleCancelPledge = (pledge: Pledge) => {
    toast({
      title: "Pledge Cancelled",
      description: `Your pledge for ${pledge.childName} has been cancelled.`,
    });
  };

  const handlePayNow = (pledge: Pledge) => {
    toast({
      title: "Redirecting to Payment",
      description: `Processing payment for ${pledge.childName}...`,
    });
  };

  const handleEmailInvite = (childName: string) => {
    toast({
      title: "Email Invite",
      description: `Opening email to invite others to sponsor ${childName}.`,
    });
  };

  const handleDownloadReceipt = (payment: Payment) => {
    toast({
      title: "Downloading Receipt",
      description: `Downloading receipt for payment to ${payment.childName}.`,
    });
  };

  // Calculate summary stats
  const activePledges = mockPledges.filter(p => p.status === "active").length;
  const pendingPayments = mockPledges.filter(p => p.status === "pending").length;
  const totalProjected = mockPledges.reduce((sum, p) => sum + p.projectedAmount, 0);

  // Hand-drawn border style matching homepage
  const handDrawnBorder = {
    border: 'solid 1px #41403E',
    borderTopLeftRadius: '255px 15px',
    borderTopRightRadius: '15px 225px',
    borderBottomRightRadius: '225px 15px',
    borderBottomLeftRadius: '15px 255px',
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground">
                  Welcome back, {mockSponsor.name.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Thank you for supporting young readers
                </p>
              </div>
              <Link to="/login">
                <Button 
                  variant="ghost"
                  style={handDrawnBorder}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary Stats - matching homepage grid style */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 bg-background p-6 md:p-8 shadow-lg"
            style={handDrawnBorder}
          >
            <div className="text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <p className="font-serif text-2xl md:text-3xl text-foreground tracking-tight">
                {mockSponsor.childrenSupported}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Children Supported
              </p>
            </div>
            <div 
              className="text-center px-2 md:px-4"
              style={{
                borderLeft: 'solid 1px #41403E',
              }}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="font-serif text-2xl md:text-3xl text-foreground tracking-tight">
                {activePledges}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Active Pledges
              </p>
            </div>
            <div 
              className="text-center px-2 md:px-4"
              style={{
                borderLeft: 'solid 1px #41403E',
              }}
            >
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <p className="font-serif text-2xl md:text-3xl text-amber-600 tracking-tight">
                {pendingPayments}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Pending Payments
              </p>
            </div>
            <div 
              className="text-center px-2 md:px-4"
              style={{
                borderLeft: 'solid 1px #41403E',
              }}
            >
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="font-serif text-2xl md:text-3xl text-green-600 tracking-tight">
                ${mockSponsor.totalPaid.toFixed(2)}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Total Paid
              </p>
            </div>
          </div>

          <Tabs defaultValue="pledges" className="space-y-6">
            <TabsList 
              className="bg-background p-1"
              style={handDrawnBorder}
            >
              <TabsTrigger value="pledges">My Pledges</TabsTrigger>
              <TabsTrigger value="progress">Child Progress</TabsTrigger>
              <TabsTrigger value="payments">Payment History</TabsTrigger>
            </TabsList>

            {/* My Pledges Tab */}
            <TabsContent value="pledges" className="space-y-6">
              <div 
                className="bg-background p-6 shadow-lg"
                style={handDrawnBorder}
              >
                <h2 className="font-serif text-2xl text-foreground mb-6">My Pledges</h2>
                
                <div className="space-y-4">
                  {mockPledges.map((pledge) => (
                    <div
                      key={pledge.id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-muted/30"
                      style={{
                        border: 'solid 1px #41403E',
                        borderRadius: '8px',
                      }}
                    >
                      {/* Child Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif text-lg text-foreground">{pledge.childName}</h3>
                          <Badge variant={statusConfig[pledge.status].variant} className="gap-1">
                            {statusConfig[pledge.status].icon}
                            {statusConfig[pledge.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{pledge.childGrade}</p>
                      </div>

                      {/* Pledge Details */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Type</p>
                          <p className="font-medium text-sm text-foreground">
                            {pledge.pledgeType === "per-minute" ? "Per Min" : "Flat"}
                          </p>
                        </div>
                        <div 
                          className="text-center px-6"
                          style={{ borderLeft: 'solid 1px #41403E', borderRight: 'solid 1px #41403E' }}
                        >
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount</p>
                          <p className="font-serif text-xl text-foreground">
                            {pledge.pledgeType === "per-minute" 
                              ? `$${pledge.amount.toFixed(2)}/min`
                              : `$${pledge.amount.toFixed(2)}`}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Projected</p>
                          <p className="font-serif text-xl text-foreground">
                            ${pledge.projectedAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {pledge.status === "pending" && (
                          <Button size="sm" onClick={() => handlePayNow(pledge)}>
                            <CreditCard className="h-4 w-4 mr-1" />
                            Pay Now
                          </Button>
                        )}
                        {pledge.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdatePledge(pledge)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        )}
                        {pledge.status !== "paid" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Pledge?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel your pledge for {pledge.childName}?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Pledge</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleCancelPledge(pledge)}
                                >
                                  Cancel Pledge
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite Others Section - Only show for pledges with sharing enabled */}
              {mockPledges.some(p => p.allowSponsorSharing) && (
                <div 
                  className="bg-background-warm p-6 shadow-lg"
                  style={handDrawnBorder}
                >
                  <h2 className="font-serif text-2xl text-foreground mb-2">Invite Others to Sponsor</h2>
                  <p className="text-muted-foreground mb-6">
                    Share these links with friends and family to help support these amazing readers!
                  </p>
                  
                  <div className="space-y-3">
                    {mockPledges.filter(p => p.allowSponsorSharing).map((pledge) => (
                      <div
                        key={pledge.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-background"
                        style={{
                          border: 'solid 1px #41403E',
                          borderRadius: '8px',
                        }}
                      >
                        <div className="flex-1">
                          <p className="font-serif text-lg text-foreground">{pledge.childName}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {window.location.origin}{pledge.sponsorLink}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyLink(pledge.sponsorLink)}
                            style={{ border: 'solid 1px #41403E', borderRadius: '6px' }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmailInvite(pledge.childName)}
                            style={{ border: 'solid 1px #41403E', borderRadius: '6px' }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            style={{ border: 'solid 1px #41403E', borderRadius: '6px' }}
                          >
                            <Link to={pledge.sponsorLink} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note about sharing restrictions */}
              {mockPledges.some(p => !p.allowSponsorSharing) && (
                <div 
                  className="flex items-start gap-3 p-4 bg-muted/30"
                  style={{
                    border: 'solid 1px #41403E',
                    borderRadius: '8px',
                  }}
                >
                  <Lock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Sharing managed by family
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Some sponsorships have sharing managed by the family. Contact the family directly if you'd like to invite others to sponsor.
                    </p>
                  </div>
                </div>
              )}

              {/* Add Another Pledge Section */}
              <div 
                className="bg-background p-6 shadow-lg"
                style={handDrawnBorder}
              >
                <h2 className="font-serif text-2xl text-foreground mb-2">Make Another Pledge</h2>
                <p className="text-muted-foreground mb-6">
                  Want to increase your support? Add another pledge for any child you're sponsoring.
                </p>
                
                <div className="space-y-3">
                  {mockPledges.filter(p => p.status !== "paid").map((pledge) => (
                    <div
                      key={pledge.id}
                      className="flex items-center justify-between gap-4 p-4 bg-muted/30"
                      style={{
                        border: 'solid 1px #41403E',
                        borderRadius: '8px',
                      }}
                    >
                      <div>
                        <p className="font-serif text-lg text-foreground">{pledge.childName}</p>
                        <p className="text-sm text-muted-foreground">{pledge.childGrade}</p>
                      </div>
                      <Button 
                        size="sm" 
                        asChild
                      >
                        <Link to={`${pledge.sponsorLink}?additional=true`}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Pledge
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Child Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockPledges.map((pledge) => (
                  <div 
                    key={pledge.id} 
                    className="bg-background p-6 shadow-lg"
                    style={handDrawnBorder}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <h3 className="font-serif text-lg text-foreground">{pledge.childName}</h3>
                          <p className="text-sm text-muted-foreground">{pledge.childGrade}</p>
                        </div>
                        <Badge variant={statusConfig[pledge.status].variant} className="gap-1">
                          {statusConfig[pledge.status].icon}
                          {statusConfig[pledge.status].label}
                        </Badge>
                      </div>

                      <ReadingGoalRing
                        progress={pledge.minutesRead}
                        goal={pledge.goalMinutes}
                        size={100}
                      />

                      <div className="text-center">
                        <p className="font-serif text-2xl text-foreground">
                          {pledge.minutesRead} minutes
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Goal: {pledge.goalMinutes} minutes
                        </p>
                      </div>

                      {pledge.pledgeType === "per-minute" && (
                        <div 
                          className="w-full p-4 bg-muted/30"
                          style={{
                            border: 'solid 1px #41403E',
                            borderRadius: '8px',
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Your Pledge</span>
                            <span className="font-medium text-foreground">${pledge.amount.toFixed(2)}/min</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">Current Total</span>
                            <span className="font-serif text-xl text-foreground">
                              ${(pledge.minutesRead * pledge.amount).toFixed(2)}
                            </span>
                          </div>
                          {pledge.maxCap && (
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-muted-foreground">Your Cap</span>
                              <span className="font-medium text-foreground">${pledge.maxCap.toFixed(2)}</span>
                            </div>
                          )}
                          <div 
                            className="flex justify-between items-center mt-3 pt-3"
                            style={{ borderTop: 'solid 1px #41403E' }}
                          >
                            <span className="text-sm font-medium text-foreground">At Goal</span>
                            <span className="font-serif text-xl text-foreground">
                              ${Math.min(pledge.goalMinutes * pledge.amount, pledge.maxCap || Infinity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      {pledge.pledgeType === "flat" && (
                        <div 
                          className="w-full p-4 text-center bg-muted/30"
                          style={{
                            border: 'solid 1px #41403E',
                            borderRadius: '8px',
                          }}
                        >
                          <p className="text-sm text-muted-foreground">Your Flat Pledge</p>
                          <p className="font-serif text-3xl text-foreground">
                            ${pledge.amount.toFixed(2)}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => copyLink(pledge.sponsorLink)}
                          style={{ border: 'solid 1px #41403E', borderRadius: '6px' }}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        {pledge.status === "pending" && (
                          <Button size="sm" className="flex-1" onClick={() => handlePayNow(pledge)}>
                            <CreditCard className="h-4 w-4 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Payment History Tab */}
            <TabsContent value="payments" className="space-y-6">
              <div 
                className="bg-background p-6 shadow-lg"
                style={handDrawnBorder}
              >
                <h2 className="font-serif text-2xl text-foreground mb-6">Payment History</h2>

                {mockPayments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Child</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead className="text-right">Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-serif text-foreground">{payment.childName}</TableCell>
                          <TableCell>
                            <span className="font-serif text-xl text-foreground">
                              ${payment.amount.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{payment.method}</TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {payment.transactionId}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReceipt(payment)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payment history yet</p>
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div 
                className="grid grid-cols-2 gap-6 bg-background p-6 shadow-lg"
                style={handDrawnBorder}
              >
                <div className="text-center">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-serif text-3xl text-green-600 tracking-tight">
                    ${mockSponsor.totalPaid.toFixed(2)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                    Total Paid
                  </p>
                </div>
                <div 
                  className="text-center px-4"
                  style={{ borderLeft: 'solid 1px #41403E' }}
                >
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="font-serif text-3xl text-amber-600 tracking-tight">
                    ${(totalProjected - mockSponsor.totalPaid).toFixed(2)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                    Outstanding Balance
                    {pendingPayments > 0 && (
                      <span className="block">({pendingPayments} pending)</span>
                    )}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Spacer for bottom tab bar */}
        <div className="h-20 md:hidden" />
      </main>

      <Footer />
      <BottomTabBar role="sponsor" />

      {/* Update Pledge Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Pledge</DialogTitle>
            <DialogDescription>
              Update your pledge amount for {selectedPledge?.childName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {selectedPledge?.pledgeType === "per-minute" 
                  ? "Amount per minute" 
                  : "Flat amount"}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  step={selectedPledge?.pledgeType === "per-minute" ? "0.01" : "1"}
                  min="0.01"
                  className="pl-7"
                  value={updatedAmount}
                  onChange={(e) => setUpdatedAmount(e.target.value)}
                />
              </div>
            </div>
            {selectedPledge?.pledgeType === "per-minute" && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  At {selectedPledge.goalMinutes} minutes (goal):
                </p>
                <p className="font-handwritten text-xl text-primary">
                  ${(parseFloat(updatedAmount || "0") * selectedPledge.goalMinutes).toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitPledgeUpdate}>
              Update Pledge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
