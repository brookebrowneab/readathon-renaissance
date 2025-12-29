import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  ArrowLeft,
  Search,
  Mail,
  Download,
  AlertTriangle,
  Clock,
  DollarSign,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
}

const mockPayments: OutstandingPayment[] = [
  { id: "1", sponsorName: "Betty Smith", sponsorEmail: "betty@example.com", studentName: "Emma J.", studentGrade: "3rd", pledgeType: "per-minute", amount: 50.00, daysOutstanding: 3, lastReminder: null },
  { id: "2", sponsorName: "John Davis", sponsorEmail: "john@example.com", studentName: "Sophie K.", studentGrade: "2nd", pledgeType: "fixed", amount: 25.00, daysOutstanding: 7, lastReminder: "2 days ago" },
  { id: "3", sponsorName: "Mike Thompson", sponsorEmail: "mike@example.com", studentName: "Liam B.", studentGrade: "4th", pledgeType: "per-minute", amount: 42.50, daysOutstanding: 5, lastReminder: "1 week ago" },
  { id: "4", sponsorName: "Sarah Kim", sponsorEmail: "sarah@example.com", studentName: "Olivia M.", studentGrade: "1st", pledgeType: "fixed", amount: 30.00, daysOutstanding: 2, lastReminder: null },
  { id: "5", sponsorName: "David Roberts", sponsorEmail: "david@example.com", studentName: "Noah W.", studentGrade: "5th", pledgeType: "per-minute", amount: 75.00, daysOutstanding: 10, lastReminder: "3 days ago" },
  { id: "6", sponsorName: "Lisa Martinez", sponsorEmail: "lisa@example.com", studentName: "Ava T.", studentGrade: "3rd", pledgeType: "fixed", amount: 100.00, daysOutstanding: 14, lastReminder: "1 week ago" },
  { id: "7", sponsorName: "James Wilson", sponsorEmail: "james@example.com", studentName: "Ethan D.", studentGrade: "2nd", pledgeType: "per-minute", amount: 35.00, daysOutstanding: 4, lastReminder: null },
  { id: "8", sponsorName: "Emily Brown", sponsorEmail: "emily@example.com", studentName: "Isabella C.", studentGrade: "4th", pledgeType: "fixed", amount: 50.00, daysOutstanding: 8, lastReminder: "5 days ago" },
];

type FilterOption = "all" | "overdue" | "no-reminder";

const AdminOutstandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const filteredPayments = mockPayments.filter((payment) => {
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
    return matchesSearch;
  });

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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    toast.success(`Reminders sent to ${selectedPayments.length} sponsor(s)!`);
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
              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
                Outstanding Payments
              </h1>
              <p className="text-muted-foreground">
                {filteredPayments.length} payments totaling ${totalOutstanding.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleSendReminders}
                disabled={selectedPayments.length === 0 || isSending}
                loading={isSending}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Reminders ({selectedPayments.length})
              </Button>
            </div>
          </div>

          {/* Filters */}
          <BookContainer variant="default" className="p-4 mb-6">
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
              <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outstanding</SelectItem>
                  <SelectItem value="overdue">Overdue (7+ days)</SelectItem>
                  <SelectItem value="no-reminder">No Reminder Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </BookContainer>

          {/* Table */}
          <BookContainer variant="default" className="overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
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
                  {filteredPayments.map((payment) => (
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
                        ${payment.amount.toFixed(2)}
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
                          onClick={() => {
                            toast.success(`Reminder sent to ${payment.sponsorName}`);
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

            {filteredPayments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No outstanding payments match your criteria.
              </div>
            )}
        </BookContainer>
      </div>
    </AdminLayout>
  );
};

export default AdminOutstandingPage;
