import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  Search,
  Mail,
  Download,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sendPaymentReminders } from "@/lib/notifications";
import { TablePagination, usePagination } from "@/components/ui/table-pagination";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

interface OutstandingPayment {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  studentName: string;
  studentGrade: string;
  pledgeType: "fixed" | "per-minute";
  amount: number;
  daysOutstanding: number;
  lastReminder: string | null;
  totalMinutes: number;
}

type FilterOption = "all" | "overdue" | "no-reminder" | "large";

const LARGE_PLEDGE_THRESHOLD = 1500;
const AdminOutstandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<FilterOption>(
    searchParams.get('filter') === 'large' ? 'large' : 'all'
  );
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Sync URL filter param
  useEffect(() => {
    if (searchParams.get('filter') === 'large') {
      setFilterBy('large');
    }
  }, [searchParams]);

  const handleFilterChange = (value: FilterOption) => {
    setFilterBy(value);
    if (value === 'large') {
      setSearchParams({ filter: 'large' });
    } else {
      setSearchParams({});
    }
  };
  // Fetch real pledges from database
  const { data: pledgesData = [], isLoading } = useQuery({
    queryKey: ["admin-outstanding-pledges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pledges")
        .select(`
          *,
          child:children(id, name, total_minutes, grade_info),
          sponsor:sponsors(id, name, email)
        `)
        .eq("is_paid", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Transform database pledges to display format
  const payments: OutstandingPayment[] = useMemo(() => {
    return pledgesData.map((pledge) => {
      const createdAt = new Date(pledge.created_at);
      const now = new Date();
      const daysOutstanding = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      
      const totalMinutes = pledge.child?.total_minutes || 0;
      const calculatedAmount = pledge.pledge_type === "per_minute" 
        ? pledge.amount * totalMinutes 
        : pledge.amount;
      
      return {
        id: pledge.id,
        sponsorName: pledge.sponsor?.name || "Unknown Sponsor",
        sponsorEmail: pledge.sponsor?.email || "unknown@email.com",
        studentName: pledge.child?.name || pledge.student_name,
        studentGrade: pledge.child?.grade_info || "N/A",
        pledgeType: pledge.pledge_type === "per_minute" ? "per-minute" : "fixed",
        amount: calculatedAmount,
        daysOutstanding,
        lastReminder: null, // TODO: Track reminder history
        totalMinutes,
      } as OutstandingPayment;
    });
  }, [pledgesData]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.sponsorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.sponsorEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterBy === "overdue") {
      return matchesSearch && payment.daysOutstanding >= 7;
    }
    if (filterBy === "no-reminder") {
      return matchesSearch && !payment.lastReminder;
    }
    if (filterBy === "large") {
      return matchesSearch && payment.amount > LARGE_PLEDGE_THRESHOLD;
    }
    return matchesSearch;
  });

  const largePledgesCount = payments.filter(p => p.amount > LARGE_PLEDGE_THRESHOLD).length;

  // Pagination
  const {
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    paginatedItems,
  } = usePagination(filteredPayments.length, 25);

  const paginatedPayments = useMemo(() => paginatedItems(filteredPayments), [filteredPayments, currentPage, pageSize]);

  const totalOutstanding = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const toggleSelection = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedPayments(filteredPayments.map((p) => p.id));
  };

  const selectNone = () => {
    setSelectedPayments([]);
  };

  const handleSendReminders = async () => {
    if (selectedPayments.length === 0) {
      toast.error("Please select at least one payment");
      return;
    }
    
    setIsSending(true);
    
    // Build the pledge data for selected payments
    const selectedPledgeData = filteredPayments
      .filter((p) => selectedPayments.includes(p.id))
      .map((p) => ({
        pledgeId: p.id,
        recipientEmail: p.sponsorEmail,
        recipientName: p.sponsorName,
        studentName: p.studentName,
        amount: p.pledgeType === "per-minute" ? p.amount / (p.totalMinutes || 1) : p.amount,
        pledgeType: p.pledgeType === "per-minute" ? "per_minute" as const : "flat" as const,
        totalMinutes: p.totalMinutes,
        daysSincePledge: p.daysOutstanding,
      }));
    
    const result = await sendPaymentReminders(selectedPledgeData);
    
    setIsSending(false);
    
    if (result.success && result.summary) {
      if (result.summary.sent > 0) {
        toast.success(`Successfully sent ${result.summary.sent} reminder(s)!`);
      }
      if (result.summary.failed > 0) {
        toast.error(`Failed to send ${result.summary.failed} reminder(s)`);
      }
    } else {
      toast.error(result.error || "Failed to send reminders");
    }
    
    setSelectedPayments([]);
  };

  const handleExport = () => {
    toast.success("Exporting outstanding payments...");
  };

  return (
    <AdminLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="relative inline-block mb-2">
              <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground relative">
                <span className="relative">
                  Outstanding Payments
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
            <p className="text-muted-foreground">
              {filteredPayments.length} payments totaling ${totalOutstanding.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} style={handDrawnBorder}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={handleSendReminders}
              disabled={selectedPayments.length === 0 || isSending}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isSending ? "Sending..." : `Send Reminders (${selectedPayments.length})`}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-background p-4 mb-6" style={handDrawnBorder}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sponsors or students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={(v) => handleFilterChange(v as FilterOption)}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outstanding</SelectItem>
                <SelectItem value="overdue">Overdue (7+ days)</SelectItem>
                <SelectItem value="no-reminder">No Reminder Sent</SelectItem>
                <SelectItem value="large">
                  Large Pledges (&gt;$1,500) {largePledgesCount > 0 && `(${largePledgesCount})`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-background overflow-hidden" style={handDrawnBorder}>
          <div className="p-4 border-b border-foreground/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="ghost" size="sm" onClick={selectNone}>
                Select None
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedPayments.length} selected
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead>Last Reminder</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPayments.includes(payment.id)}
                        onCheckedChange={() => toggleSelection(payment.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.sponsorName}</p>
                        <p className="text-sm text-muted-foreground">{payment.sponsorEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.studentName}</p>
                        <p className="text-sm text-muted-foreground">{payment.studentGrade} Grade</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {payment.pledgeType === "per-minute" ? "Per Minute" : "Fixed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={payment.amount > LARGE_PLEDGE_THRESHOLD ? "text-destructive font-bold" : ""}>
                        ${payment.amount.toFixed(2)}
                        {payment.amount > LARGE_PLEDGE_THRESHOLD && (
                          <AlertTriangle className="h-3 w-3 inline ml-1" />
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1",
                          payment.daysOutstanding >= 14
                            ? "text-destructive font-bold"
                            : payment.daysOutstanding >= 7
                            ? "text-warning font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {payment.daysOutstanding >= 7 && (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {payment.daysOutstanding}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payment.lastReminder ? (
                        <span className="text-sm text-muted-foreground">{payment.lastReminder}</span>
                      ) : (
                        <Badge variant="outline" className="text-xs">Never</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const result = await sendPaymentReminders([{
                            pledgeId: payment.id,
                            recipientEmail: payment.sponsorEmail,
                            recipientName: payment.sponsorName,
                            studentName: payment.studentName,
                            amount: payment.pledgeType === "per-minute" ? payment.amount / (payment.totalMinutes || 1) : payment.amount,
                            pledgeType: payment.pledgeType === "per-minute" ? "per_minute" : "flat",
                            totalMinutes: payment.totalMinutes,
                            daysSincePledge: payment.daysOutstanding,
                          }]);
                          if (result.success) {
                            toast.success(`Reminder sent to ${payment.sponsorName}`);
                          } else {
                            toast.error(result.error || "Failed to send reminder");
                          }
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {isLoading && (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {!isLoading && filteredPayments.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No outstanding payments match your criteria.
            </div>
          )}

          {!isLoading && filteredPayments.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredPayments.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOutstandingPage;
