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

type PaymentStatus = "completed" | "pending" | "failed" | "refunded";
type PaymentMethod = "card" | "cash" | "check" | "online";

interface Payment {
  id: string;
  date: string;
  payerName: string;
  payerEmail: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  pledgeId?: string;
  studentName?: string;
  transactionId?: string;
  receiptUrl?: string;
}

interface OutstandingPledge {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  studentName: string;
  amount: number;
  pledgeDate: string;
  daysSincePledge: number;
  remindersSent: number;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: "1",
    date: "2024-01-15",
    payerName: "John Smith",
    payerEmail: "john@example.com",
    amount: 50.00,
    status: "completed",
    method: "card",
    studentName: "Emma Smith",
    transactionId: "sq_txn_12345",
    receiptUrl: "https://square.com/receipt/12345",
  },
  {
    id: "2",
    date: "2024-01-14",
    payerName: "Sarah Johnson",
    payerEmail: "sarah@example.com",
    amount: 25.00,
    status: "pending",
    method: "online",
    studentName: "Michael Johnson",
  },
  {
    id: "3",
    date: "2024-01-13",
    payerName: "Robert Davis",
    payerEmail: "robert@example.com",
    amount: 100.00,
    status: "completed",
    method: "check",
    studentName: "Sophia Davis",
    transactionId: "chk_67890",
  },
  {
    id: "4",
    date: "2024-01-12",
    payerName: "Emily Wilson",
    payerEmail: "emily@example.com",
    amount: 75.00,
    status: "failed",
    method: "card",
    studentName: "Oliver Wilson",
  },
  {
    id: "5",
    date: "2024-01-11",
    payerName: "Michael Brown",
    payerEmail: "michael@example.com",
    amount: 30.00,
    status: "refunded",
    method: "card",
    studentName: "Ava Brown",
    transactionId: "sq_txn_11111",
  },
];

const mockOutstandingPledges: OutstandingPledge[] = [
  {
    id: "1",
    sponsorName: "Jennifer Lee",
    sponsorEmail: "jennifer@example.com",
    studentName: "Lucas Lee",
    amount: 45.00,
    pledgeDate: "2024-01-05",
    daysSincePledge: 10,
    remindersSent: 1,
  },
  {
    id: "2",
    sponsorName: "David Martinez",
    sponsorEmail: "david@example.com",
    studentName: "Isabella Martinez",
    amount: 60.00,
    pledgeDate: "2024-01-02",
    daysSincePledge: 13,
    remindersSent: 2,
  },
  {
    id: "3",
    sponsorName: "Amanda Taylor",
    sponsorEmail: "amanda@example.com",
    studentName: "Ethan Taylor",
    amount: 35.00,
    pledgeDate: "2024-01-08",
    daysSincePledge: 7,
    remindersSent: 0,
  },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedPledges, setSelectedPledges] = useState<string[]>([]);
  const [isManualPaymentOpen, setIsManualPaymentOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Financial summary calculations
  const totalPledged = 2450.00;
  const totalCollected = 1875.00;
  const outstanding = totalPledged - totalCollected;
  const collectionRate = Math.round((totalCollected / totalPledged) * 100);

  // Filter payments
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesDateFrom = !dateFrom || payment.date >= dateFrom;
    const matchesDateTo = !dateTo || payment.date <= dateTo;
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handleSendReminder = (pledgeId: string) => {
    toast({
      title: "Reminder Sent",
      description: "A payment reminder has been sent to the sponsor.",
    });
  };

  const handleBulkReminder = () => {
    if (selectedPledges.length === 0) {
      toast({
        title: "No Pledges Selected",
        description: "Please select at least one pledge to send reminders.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Reminders Sent",
      description: `Payment reminders sent to ${selectedPledges.length} sponsors.`,
    });
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
    toast({
      title: "Export Started",
      description: "Your financial report is being generated.",
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
    if (selectedPledges.length === mockOutstandingPledges.length) {
      setSelectedPledges([]);
    } else {
      setSelectedPledges(mockOutstandingPledges.map((p) => p.id));
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
                  {mockOutstandingPledges.map((pledge) => (
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

  return (
    <AdminPageLayout 
      title="Financial Management" 
      subtitle="Track payments, pledges, and generate reports"
      actions={headerActions}
    >
        {/* Financial Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Pledged</p>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-handwritten text-2xl text-primary">${totalPledged.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">From all sponsors</p>
          </div>
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </div>
            <p className="font-handwritten text-2xl text-accent">${totalCollected.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Payments received</p>
          </div>
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
            <p className="font-handwritten text-2xl text-warning">${outstanding.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </div>
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-handwritten text-2xl text-primary">{collectionRate}%</p>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs for Payments and Outstanding Pledges */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments">All Payments</TabsTrigger>
            <TabsTrigger value="outstanding">
              Outstanding Pledges
              <Badge variant="secondary" className="ml-2">
                {mockOutstandingPledges.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Payments</CardTitle>
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
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Payer</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {new Date(payment.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.payerName}</p>
                            <p className="text-sm text-muted-foreground">{payment.payerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.studentName || "—"}</TableCell>
                        <TableCell className="font-medium">
                          ${payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{methodLabels[payment.method]}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[payment.status].variant} className="gap-1">
                            {statusConfig[payment.status].icon}
                            {statusConfig[payment.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPayments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No payments found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outstanding Pledges Tab */}
          <TabsContent value="outstanding" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Outstanding Pledges</CardTitle>
                  <Button
                    variant="outline"
                    onClick={handleBulkReminder}
                    disabled={selectedPledges.length === 0}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Bulk Reminder ({selectedPledges.length})
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedPledges.length === mockOutstandingPledges.length}
                          onCheckedChange={toggleAllPledges}
                        />
                      </TableHead>
                      <TableHead>Sponsor</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Days Since Pledge</TableHead>
                      <TableHead>Reminders Sent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOutstandingPledges.map((pledge) => (
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
                        </TableCell>
                        <TableCell>
                          <Badge variant={pledge.daysSincePledge > 10 ? "destructive" : "secondary"}>
                            {pledge.daysSincePledge} days
                          </Badge>
                        </TableCell>
                        <TableCell>{pledge.remindersSent}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendReminder(pledge.id)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Remind
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    <p className="font-medium">{new Date(selectedPayment.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Method</Label>
                    <p className="font-medium">{methodLabels[selectedPayment.method]}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Payer</Label>
                  <p className="font-medium">{selectedPayment.payerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedPayment.payerEmail}</p>
                </div>

                {selectedPayment.studentName && (
                  <div>
                    <Label className="text-muted-foreground">Student</Label>
                    <p className="font-medium">{selectedPayment.studentName}</p>
                  </div>
                )}

                {selectedPayment.transactionId && (
                  <div>
                    <Label className="text-muted-foreground">Transaction ID</Label>
                    <p className="font-mono text-sm">{selectedPayment.transactionId}</p>
                  </div>
                )}

                {selectedPayment.receiptUrl && (
                  <div>
                    <Label className="text-muted-foreground">Receipt</Label>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <a href={selectedPayment.receiptUrl} target="_blank" rel="noopener noreferrer">
                        View Receipt
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {selectedPayment.status === "completed" && (
                <div className="pt-4 border-t">
                  <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
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
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminPageLayout>
  );
}
