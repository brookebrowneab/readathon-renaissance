import { useState } from "react";
import { Link } from "react-router-dom";
import AdminPageLayout from "@/components/layout/AdminPageLayout";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Download,
  Search,
  Send,
  Eye,
  RotateCcw,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Mail,
  FileText,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { handDrawnBorder } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";
import { useAdminFinance, Payment, PaymentStatus, PaymentMethod, LARGE_PLEDGE_THRESHOLD } from "@/hooks/useAdminFinance";
import { usePayments, Payment as SquarePayment } from "@/hooks/usePayments";
import { AlertTriangle, ExternalLink, Receipt } from "lucide-react";
import { format } from "date-fns";

const statusConfig: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  completed: { label: "Completed", variant: "default", icon: <CheckCircle2 className="h-3 w-3" /> },
  pending: { label: "Pending", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  failed: { label: "Failed", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
  refunded: { label: "Refunded", variant: "outline", icon: <RefreshCw className="h-3 w-3" /> },
};

const methodLabels: Record<PaymentMethod, string> = {
  card: "Credit Card",
  cash: "Cash",
  check: "Check",
  online: "Online",
};

export default function AdminFinancePage() {
  const { toast } = useToast();
  const { 
    payments, 
    outstandingPledges, 
    allPledges,
    summary, 
    isLoading, 
    markAsPaid, 
    markAsUnpaid,
    bulkMarkAsPaid,
    sendReminders,
    isUpdating,
    isSendingReminders,
  } = useAdminFinance();

  const [pledgeFilter, setPledgeFilter] = useState<string>("all");
  const [showLargeOnly, setShowLargeOnly] = useState(false);

  // Fetch actual Square payments from the payments table
  const { payments: squarePayments, isLoading: isLoadingPayments } = usePayments();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedPledges, setSelectedPledges] = useState<string[]>([]);
  const [isManualPaymentOpen, setIsManualPaymentOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const paymentDate = format(new Date(payment.date), 'yyyy-MM-dd');
    const matchesDateFrom = !dateFrom || paymentDate >= dateFrom;
    const matchesDateTo = !dateTo || paymentDate <= dateTo;
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handleSendReminder = async (pledgeId: string) => {
    try {
      await sendReminders([pledgeId]);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleBulkReminder = async () => {
    if (selectedPledges.length === 0) {
      toast({
        title: "No Pledges Selected",
        description: "Please select at least one pledge to send reminders.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendReminders(selectedPledges);
      setSelectedPledges([]);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleMarkAsPaid = async (pledgeId: string) => {
    await markAsPaid(pledgeId);
    setSelectedPayment(null);
  };

  const handleMarkAsUnpaid = async (pledgeId: string) => {
    await markAsUnpaid(pledgeId);
    setSelectedPayment(null);
  };

  const handleBulkMarkAsPaid = async () => {
    if (selectedPledges.length === 0) {
      toast({
        title: "No Pledges Selected",
        description: "Please select at least one pledge to mark as paid.",
        variant: "destructive",
      });
      return;
    }
    await bulkMarkAsPaid(selectedPledges);
    setSelectedPledges([]);
  };

  const handleRefund = () => {
    toast({
      title: "Refund Processed",
      description: "The refund has been initiated successfully.",
    });
    setIsRefundDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Payment Recorded",
      description: "Manual payment has been recorded successfully.",
    });
    setIsManualPaymentOpen(false);
  };

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate CSV
    const headers = ['Date', 'Sponsor', 'Email', 'Student', 'Amount', 'Status', 'Method'];
    const rows = payments.map(p => [
      format(new Date(p.date), 'yyyy-MM-dd'),
      p.payerName,
      p.payerEmail,
      p.studentName,
      p.amount.toFixed(2),
      p.status,
      methodLabels[p.method],
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your financial report has been downloaded.",
    });
    setIsExportOpen(false);
  };

  const togglePledgeSelection = (pledgeId: string) => {
    setSelectedPledges((prev) =>
      prev.includes(pledgeId)
        ? prev.filter((id) => id !== pledgeId)
        : [...prev, pledgeId]
    );
  };

  const toggleAllPledges = () => {
    if (selectedPledges.length === outstandingPledges.length) {
      setSelectedPledges([]);
    } else {
      setSelectedPledges(outstandingPledges.map((p) => p.id));
    }
  };

  const headerActions = (
    <>
      <Dialog open={isManualPaymentOpen} onOpenChange={setIsManualPaymentOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Manual Payment
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Manual Payment</DialogTitle>
            <DialogDescription>
              Enter details for cash or check payments.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleManualPayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payer">Payer Name</Label>
              <Input id="payer" placeholder="Enter payer name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payerEmail">Payer Email</Label>
              <Input id="payerEmail" type="email" placeholder="Enter email" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" type="number" step="0.01" min="0" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select defaultValue="cash">
                  <SelectTrigger id="method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number (Optional)</Label>
              <Input id="reference" placeholder="Check number or receipt ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedPledge">Link to Pledge (Optional)</Label>
              <Select>
                <SelectTrigger id="linkedPledge">
                  <SelectValue placeholder="Select a pledge" />
                </SelectTrigger>
                <SelectContent>
                  {outstandingPledges.map((pledge) => (
                    <SelectItem key={pledge.id} value={pledge.id}>
                      {pledge.sponsorName} - ${pledge.amount.toFixed(2)} ({pledge.studentName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsManualPaymentOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogTrigger asChild>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Financial Report</DialogTitle>
            <DialogDescription>
              Generate a CSV report of financial data.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExport} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exportFrom">From Date</Label>
                <Input id="exportFrom" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exportTo">To Date</Label>
                <Input id="exportTo" type="date" />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Include Data</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="includePayments" defaultChecked />
                  <label htmlFor="includePayments" className="text-sm">Completed Payments</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includePending" defaultChecked />
                  <label htmlFor="includePending" className="text-sm">Pending Payments</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeOutstanding" defaultChecked />
                  <label htmlFor="includeOutstanding" className="text-sm">Outstanding Pledges</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeRefunds" />
                  <label htmlFor="includeRefunds" className="text-sm">Refunded Payments</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeFailed" />
                  <label htmlFor="includeFailed" className="text-sm">Failed Payments</label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsExportOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <FileText className="mr-2 h-4 w-4" />
                Generate CSV
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Link to="/login">
        <Button variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Exit
        </Button>
      </Link>
    </>
  );

  if (isLoading) {
    return (
      <AdminPageLayout 
        title="Financial Management" 
        subtitle="Track payments, pledges, and generate reports"
        actions={headerActions}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout 
      title="Financial Management" 
      subtitle="Track payments, pledges, and generate reports"
      actions={headerActions}
    >
        {/* Financial Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Pledged</p>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-serif text-2xl text-primary">${summary.totalPledged.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">From all sponsors</p>
          </div>
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </div>
            <p className="font-serif text-2xl text-accent">${summary.totalCollected.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Payments received</p>
          </div>
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
            <p className="font-serif text-2xl text-warning">${summary.outstanding.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </div>
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-serif text-2xl text-primary">{summary.collectionRate}%</p>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${summary.collectionRate}%` }}
              />
            </div>
          </div>
          <button 
            onClick={() => setShowLargeOnly(!showLargeOnly)}
            className={cn(
              "bg-background p-4 text-left transition-all cursor-pointer hover:ring-2 hover:ring-destructive/50",
              showLargeOnly && "ring-2 ring-destructive"
            )}
            style={handDrawnBorder}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Large Pledges</p>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="font-serif text-2xl text-destructive">{summary.largePledgeCount}</p>
            <p className="text-xs text-muted-foreground mt-1">&gt;${LARGE_PLEDGE_THRESHOLD.toLocaleString()}</p>
          </button>
        </div>

        {/* Tabs for Payments, Pledges and Outstanding Pledges */}
        <Tabs defaultValue="pledges" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pledges">
              All Pledges
              <Badge variant="secondary" className="ml-2">
                {allPledges.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="outstanding">
              Outstanding
              <Badge variant="secondary" className="ml-2">
                {outstandingPledges.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* All Pledges Tab */}
          <TabsContent value="pledges" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>All Pledges</CardTitle>
                    {showLargeOnly && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Showing Large Only
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <Select value={pledgeFilter} onValueChange={setPledgeFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Pledges</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="large">Large (&gt;${LARGE_PLEDGE_THRESHOLD.toLocaleString()})</SelectItem>
                      </SelectContent>
                    </Select>
                    {showLargeOnly && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowLargeOnly(false)}
                      >
                        Clear Filter
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sponsor</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPledges
                      .filter(pledge => {
                        if (showLargeOnly && !pledge.isLarge) return false;
                        if (pledgeFilter === "paid") return pledge.isPaid;
                        if (pledgeFilter === "unpaid") return !pledge.isPaid;
                        if (pledgeFilter === "large") return pledge.isLarge;
                        return true;
                      })
                      .map((pledge) => (
                        <TableRow key={pledge.id} className={cn(pledge.isLarge && "bg-destructive/5")}>
                          <TableCell className="font-medium">
                            {format(new Date(pledge.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{pledge.sponsorName}</p>
                              <p className="text-sm text-muted-foreground">{pledge.sponsorEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>{pledge.studentName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {pledge.pledgeType === 'per_minute' ? 'Per Minute' : 'Flat'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className={cn("font-medium", pledge.isLarge && "text-destructive flex items-center gap-1")}>
                              {pledge.isLarge && <AlertTriangle className="h-4 w-4" />}
                              ${pledge.amount.toFixed(2)}
                            </div>
                            {pledge.pledgeType === 'per_minute' && (
                              <span className="text-xs text-muted-foreground block">
                                ({pledge.childMinutes} min)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={pledge.isPaid ? "default" : "secondary"} className="gap-1">
                              {pledge.isPaid ? (
                                <><CheckCircle2 className="h-3 w-3" /> Paid</>
                              ) : (
                                <><Clock className="h-3 w-3" /> Pending</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            {!pledge.isPaid && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsPaid(pledge.id)}
                                disabled={isUpdating}
                              >
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              </Button>
                            )}
                            {pledge.isPaid && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsUnpaid(pledge.id)}
                                disabled={isUpdating}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    {allPledges.filter(pledge => {
                      if (showLargeOnly && !pledge.isLarge) return false;
                      if (pledgeFilter === "paid") return pledge.isPaid;
                      if (pledgeFilter === "unpaid") return !pledge.isPaid;
                      if (pledgeFilter === "large") return pledge.isLarge;
                      return true;
                    }).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No pledges found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab - Shows actual Square payment transactions */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Payment Transactions</CardTitle>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full md:w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Pledge Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="flat">One-Time</SelectItem>
                        <SelectItem value="per_minute">Per Minute</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full md:w-auto"
                        placeholder="From"
                      />
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full md:w-auto"
                        placeholder="To"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingPayments ? (
                  <div className="text-center py-8 text-muted-foreground">Loading payments...</div>
                ) : squarePayments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No payment transactions yet</p>
                    <p className="text-sm mt-1">Payment records will appear here once sponsors make payments.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Payer</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Square ID</TableHead>
                        <TableHead className="text-right">Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {squarePayments
                        .filter((payment) => {
                          const matchesSearch =
                            (payment.payer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                            (payment.payer_email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                            (payment.student_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
                          const matchesType = statusFilter === "all" || payment.pledge_type === statusFilter;
                          const paymentDate = format(new Date(payment.created_at), 'yyyy-MM-dd');
                          const matchesDateFrom = !dateFrom || paymentDate >= dateFrom;
                          const matchesDateTo = !dateTo || paymentDate <= dateTo;
                          return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
                        })
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              <div>
                                {format(new Date(payment.created_at), 'MMM d, yyyy')}
                                <span className="text-xs text-muted-foreground block">
                                  {format(new Date(payment.created_at), 'h:mm a')}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{payment.payer_name || 'Unknown'}</p>
                                <p className="text-sm text-muted-foreground">{payment.payer_email || ''}</p>
                              </div>
                            </TableCell>
                            <TableCell>{payment.student_name || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {payment.pledge_type === 'per_minute' ? 'Per Minute' : 'One-Time'}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              ${payment.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="capitalize">
                              {payment.payment_method}
                            </TableCell>
                            <TableCell>
                              {payment.square_payment_id ? (
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                  {payment.square_payment_id.slice(0, 8)}...
                                </code>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {payment.square_receipt_url ? (
                                <a 
                                  href={payment.square_receipt_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View
                                </a>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      {squarePayments.filter((payment) => {
                        const matchesSearch =
                          (payment.payer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                          (payment.payer_email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                          (payment.student_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
                        const matchesType = statusFilter === "all" || payment.pledge_type === statusFilter;
                        const paymentDate = format(new Date(payment.created_at), 'yyyy-MM-dd');
                        const matchesDateFrom = !dateFrom || paymentDate >= dateFrom;
                        const matchesDateTo = !dateTo || paymentDate <= dateTo;
                        return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
                      }).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No payments found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outstanding Pledges Tab */}
          <TabsContent value="outstanding" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Outstanding Pledges</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleBulkReminder}
                      disabled={selectedPledges.length === 0 || isSendingReminders}
                    >
                      {isSendingReminders ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="mr-2 h-4 w-4" />
                      )}
                      {isSendingReminders ? "Sending..." : `Send Reminder (${selectedPledges.length})`}
                    </Button>
                    <Button
                      onClick={handleBulkMarkAsPaid}
                      disabled={selectedPledges.length === 0 || isUpdating}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Paid ({selectedPledges.length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {outstandingPledges.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50 text-success" />
                    <p className="font-medium">All payments collected!</p>
                    <p className="text-sm mt-1">No outstanding pledges at this time.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedPledges.length === outstandingPledges.length && outstandingPledges.length > 0}
                            onCheckedChange={toggleAllPledges}
                          />
                        </TableHead>
                        <TableHead>Sponsor</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Days Outstanding</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outstandingPledges.map((pledge) => (
                        <TableRow key={pledge.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPledges.includes(pledge.id)}
                              onCheckedChange={() => togglePledgeSelection(pledge.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{pledge.sponsorName}</p>
                              <p className="text-sm text-muted-foreground">{pledge.sponsorEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>{pledge.studentName}</TableCell>
                          <TableCell className="font-medium">
                            ${pledge.amount.toFixed(2)}
                            {pledge.pledgeType === 'per_minute' && (
                              <span className="text-xs text-muted-foreground block">
                                ({pledge.childMinutes} min)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={pledge.daysSincePledge > 10 ? "destructive" : "secondary"}>
                              {pledge.daysSincePledge} days
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendReminder(pledge.id)}
                              disabled={isSendingReminders}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsPaid(pledge.id)}
                              disabled={isUpdating}
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      {/* Payment Details Sheet */}
      <Sheet open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Payment Details</SheetTitle>
            <SheetDescription>
              Full information about this payment.
            </SheetDescription>
          </SheetHeader>
          {selectedPayment && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant={statusConfig[selectedPayment.status].variant} className="gap-1 text-sm">
                  {statusConfig[selectedPayment.status].icon}
                  {statusConfig[selectedPayment.status].label}
                </Badge>
                <span className="text-2xl font-bold">${selectedPayment.amount.toFixed(2)}</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Date</Label>
                    <p className="font-medium">{format(new Date(selectedPayment.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Method</Label>
                    <p className="font-medium">{methodLabels[selectedPayment.method]}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Sponsor</Label>
                  <p className="font-medium">{selectedPayment.payerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedPayment.payerEmail}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Student</Label>
                  <p className="font-medium">{selectedPayment.studentName}</p>
                </div>

                {selectedPayment.pledgeType === 'per_minute' && (
                  <div>
                    <Label className="text-muted-foreground">Calculation</Label>
                    <p className="font-medium">
                      ${(selectedPayment.amount / selectedPayment.childMinutes).toFixed(2)}/min × {selectedPayment.childMinutes} min
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t space-y-2">
                {selectedPayment.status === "pending" && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleMarkAsPaid(selectedPayment.id)}
                    disabled={isUpdating}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Paid
                  </Button>
                )}
                
                {selectedPayment.status === "completed" && (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleMarkAsUnpaid(selectedPayment.id)}
                      disabled={isUpdating}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Mark as Unpaid
                    </Button>
                    
                    <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full text-destructive">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Process Refund
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Refund</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to refund ${selectedPayment.amount.toFixed(2)} to {selectedPayment.payerName}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleRefund}>
                            Confirm Refund
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminPageLayout>
  );
}
