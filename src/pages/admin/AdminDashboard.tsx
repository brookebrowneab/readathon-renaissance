import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Clock,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Mail,
  Download,
  Settings,
  ChevronDown,
  TrendingUp,
  CheckCircle,
  FileText,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data
const mockSchool = {
  name: "Lincoln Elementary",
  eventName: "Spring Read-a-thon 2024",
  status: "active" as const,
  daysRemaining: 12,
};

const mockMetrics = {
  studentsEnrolled: 147,
  studentsChange: "+8 this week",
  totalMinutes: 38420,
  minutesChange: "+2,340 today",
  totalPledged: 4230,
  pledgedChange: "+$125 today",
  totalCollected: 2180,
  collectedChange: "51% collected",
};

const mockAlerts = [
  { id: "1", type: "checks", count: 8, label: "pending check payments", link: "/admin/checks" },
  { id: "2", type: "collection", count: 23, label: "pledges awaiting collection", link: "/admin/outstanding" },
  { id: "3", type: "review", count: 3, label: "high-value pledges need review", link: "/admin/review" },
];

interface ActivityItem {
  id: string;
  type: "pledge" | "payment" | "enrollment";
  message: string;
  time: string;
}

const mockActivity: ActivityItem[] = [
  { id: "1", type: "pledge", message: "New pledge: $50 from Betty S. for Emma J.", time: "5 min ago" },
  { id: "2", type: "payment", message: "Payment: $75 from John D.", time: "1 hour ago" },
  { id: "3", type: "enrollment", message: "New student enrolled: Jacob M.", time: "2 hours ago" },
  { id: "4", type: "pledge", message: "New pledge: $25 from Sarah K. for Noah B.", time: "3 hours ago" },
  { id: "5", type: "payment", message: "Payment: $100 from Mary L.", time: "4 hours ago" },
  { id: "6", type: "enrollment", message: "New student enrolled: Sophia R.", time: "5 hours ago" },
  { id: "7", type: "pledge", message: "Pledge updated: Mike T. increased to $0.10/min", time: "6 hours ago" },
  { id: "8", type: "payment", message: "Payment: $35 from Lisa M.", time: "Yesterday" },
];

interface OutstandingPayment {
  id: string;
  sponsorName: string;
  studentName: string;
  amount: number;
  daysOutstanding: number;
}

const mockOutstanding: OutstandingPayment[] = [
  { id: "1", sponsorName: "Betty S.", studentName: "Emma J.", amount: 50, daysOutstanding: 3 },
  { id: "2", sponsorName: "John D.", studentName: "Sophie K.", amount: 25, daysOutstanding: 7 },
  { id: "3", sponsorName: "Mike T.", studentName: "Liam B.", amount: 42.5, daysOutstanding: 5 },
  { id: "4", sponsorName: "Sarah K.", studentName: "Olivia M.", amount: 30, daysOutstanding: 2 },
  { id: "5", sponsorName: "David R.", studentName: "Noah W.", amount: 75, daysOutstanding: 10 },
];

const AdminDashboard = () => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  const togglePaymentSelection = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSendReminders = async () => {
    setIsSendingReminders(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSendingReminders(false);
    setShowReminderModal(false);
    toast.success("Payment reminders sent successfully!");
  };

  const handleSendSelectedReminders = async () => {
    if (selectedPayments.length === 0) {
      toast.error("Please select at least one payment");
      return;
    }
    toast.success(`Reminders sent to ${selectedPayments.length} sponsor(s)!`);
    setSelectedPayments([]);
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "pledge":
        return <DollarSign className="h-4 w-4 text-brand-blue" />;
      case "payment":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "enrollment":
        return <UserPlus className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <AdminLayout>
      <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
              {mockSchool.name} Read-a-thon
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-muted-foreground">{mockSchool.eventName}</span>
              <Badge variant={mockSchool.status === "active" ? "success" : "secondary"}>
                {mockSchool.status === "active" ? "Active" : "Ended"}
              </Badge>
              {mockSchool.status === "active" && (
                <span className="text-muted-foreground">
                  • {mockSchool.daysRemaining} days remaining
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <BookContainer variant="default" className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-brand-blue" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{mockMetrics.studentsEnrolled}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {mockMetrics.studentsChange}
                  </p>
                </div>
              </div>
            </BookContainer>

            <BookContainer variant="default" className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-accent-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{mockMetrics.totalMinutes.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Minutes Read</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {mockMetrics.minutesChange}
                  </p>
                </div>
              </div>
            </BookContainer>

            <BookContainer variant="default" className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">${mockMetrics.totalPledged.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pledged</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    {mockMetrics.pledgedChange}
                  </p>
                </div>
              </div>
            </BookContainer>

            <BookContainer variant="default" className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">${mockMetrics.totalCollected.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Collected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockMetrics.collectedChange}
                  </p>
                </div>
              </div>
            </BookContainer>
          </div>

          {/* Attention Needed */}
          {mockAlerts.length > 0 && (
            <div className="mb-8">
              <h2 className="font-medium text-foreground mb-4">Attention Needed</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAlerts.map((alert) => (
                  <Link key={alert.id} to={alert.link}>
                    <BookContainer
                      variant="default"
                      className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-warning"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground text-lg">{alert.count}</p>
                          <p className="text-sm text-muted-foreground">{alert.label}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                      </div>
                    </BookContainer>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="font-medium text-foreground mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowReminderModal(true)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Payment Reminders
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => toast.success("Downloading students report...")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Students Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Downloading pledges report...")}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pledges Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Downloading payments report...")}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payments Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" asChild>
                <Link to="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <BookContainer variant="default" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-foreground">Recent Activity</h2>
                <Link to="/admin/activity" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {mockActivity.slice(0, 8).map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">{item.message}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </BookContainer>

            {/* Outstanding Payments */}
            <BookContainer variant="default" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-foreground">Outstanding Payments</h2>
                <Link to="/admin/outstanding" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">
                        <Checkbox
                          checked={selectedPayments.length === mockOutstanding.length}
                          onCheckedChange={(checked) =>
                            setSelectedPayments(checked ? mockOutstanding.map((p) => p.id) : [])
                          }
                        />
                      </TableHead>
                      <TableHead>Sponsor</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOutstanding.slice(0, 5).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPayments.includes(payment.id)}
                            onCheckedChange={() => togglePaymentSelection(payment.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{payment.sponsorName}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.studentName}</TableCell>
                        <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "text-sm",
                              payment.daysOutstanding >= 7 ? "text-destructive font-medium" : "text-muted-foreground"
                            )}
                          >
                            {payment.daysOutstanding}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to="/admin/outstanding">View All</Link>
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleSendSelectedReminders}
                  disabled={selectedPayments.length === 0}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminders ({selectedPayments.length})
                </Button>
              </div>
            </BookContainer>
          </div>
        </div>

        {/* Send Reminders Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Reminders</DialogTitle>
            <DialogDescription>
              This will send reminder emails to all sponsors with outstanding pledges.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>{mockOutstanding.length}</strong> sponsors will receive payment reminder emails.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReminders} loading={isSendingReminders}>
              <Mail className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
