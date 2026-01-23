import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useAdminDashboard, ActivityItem } from "@/hooks/useAdminDashboard";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const AdminDashboard = () => {
  const { event, metrics, alerts, activity, outstanding, daysRemaining, isLoading } = useAdminDashboard();
  
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
        return <DollarSign className="h-4 w-4 text-accent" />;
      case "payment":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "enrollment":
        return <UserPlus className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusBadge = () => {
    if (!event) return <Badge variant="secondary">No Event</Badge>;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(event.end_date);
    const start = new Date(event.start_date);

    if (!event.is_active || today > end) {
      return <Badge variant="secondary">Ended</Badge>;
    } else if (today < start) {
      return <Badge variant="outline">Upcoming</Badge>;
    } else {
      return <Badge variant="success">Active</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-80 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="relative inline-block mb-2">
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground relative">
              <span className="relative">
                {event?.name || "Read-a-thon Dashboard"}
                {/* Highlighter effect */}
                <span 
                  className="absolute inset-0 -skew-y-1 bg-accent/30 -z-10 transform -rotate-[0.5deg]"
                  style={{
                    top: '50%',
                    height: '50%',
                    left: '-2%',
                    right: '-2%',
                    borderRadius: '4px 8px 4px 6px',
                  }}
                  aria-hidden="true"
                />
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-muted-foreground">{event?.name || "No active event"}</span>
            {getStatusBadge()}
            {event?.is_active && daysRemaining > 0 && (
              <span className="text-muted-foreground">
                • {daysRemaining} days remaining
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-2xl text-foreground">{metrics.studentsEnrolled}</p>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {metrics.studentsChange}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-2xl text-foreground">{metrics.totalMinutes.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Minutes Read</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {metrics.minutesChange}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-2xl text-foreground">${metrics.totalPledged.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pledged</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {metrics.pledgedChange}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-success" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-2xl text-foreground">${metrics.totalCollected.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Collected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.collectionPercent}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Needed */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-xl text-foreground mb-4">Attention Needed</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map((alert) => (
                <Link key={alert.id} to={alert.link}>
                  <div
                    className="bg-background p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-warning"
                    style={handDrawnBorder}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-lg text-foreground">{alert.count}</p>
                        <p className="text-sm text-muted-foreground">{alert.label}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="font-serif text-xl text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowReminderModal(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Payment Reminders
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  style={handDrawnBorder}
                >
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

            <Button variant="outline" asChild style={handDrawnBorder}>
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
          <div className="bg-background p-6" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-foreground">Recent Activity</h2>
              <span className="text-sm text-muted-foreground">
                Recent
              </span>
            </div>
            {activity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm mt-1">Activity will appear here as it happens</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activity.slice(0, 8).map((item) => (
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
            )}
          </div>

          {/* Outstanding Payments */}
          <div className="bg-background p-6" style={handDrawnBorder}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-foreground">Outstanding Payments</h2>
              <Link to="/admin/outstanding" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            {outstanding.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50 text-success" />
                <p>All payments collected!</p>
                <p className="text-sm mt-1">No outstanding payments at this time</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8">
                          <Checkbox
                            checked={selectedPayments.length === outstanding.slice(0, 5).length && outstanding.length > 0}
                            onCheckedChange={(checked) =>
                              setSelectedPayments(checked ? outstanding.slice(0, 5).map((p) => p.id) : [])
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
                      {outstanding.slice(0, 5).map((payment) => (
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
                  <Button variant="outline" size="sm" asChild className="flex-1" style={handDrawnBorder}>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Send Reminders Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Send Payment Reminders</DialogTitle>
            <DialogDescription>
              This will send reminder emails to all sponsors with outstanding pledges.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>{outstanding.length}</strong> sponsors will receive payment reminder emails.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderModal(false)} style={handDrawnBorder}>
              Cancel
            </Button>
            <Button onClick={handleSendReminders} disabled={isSendingReminders}>
              <Mail className="h-4 w-4 mr-2" />
              {isSendingReminders ? "Sending..." : "Send Reminders"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
