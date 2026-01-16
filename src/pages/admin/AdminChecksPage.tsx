import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  Search,
  CheckCircle,
  XCircle,
  Mail,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "sonner";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

interface PendingCheck {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  studentName: string;
  amount: number;
  pledgeDate: string;
  status: "pending" | "received" | "bounced";
  notes: string;
}

const mockChecks: PendingCheck[] = [
  { id: "1", sponsorName: "Martha Johnson", sponsorEmail: "martha@example.com", studentName: "Emma J.", amount: 50.00, pledgeDate: "Dec 15, 2024", status: "pending", notes: "" },
  { id: "2", sponsorName: "Robert Williams", sponsorEmail: "robert@example.com", studentName: "Liam B.", amount: 100.00, pledgeDate: "Dec 12, 2024", status: "pending", notes: "Check mailed 12/14" },
  { id: "3", sponsorName: "Patricia Brown", sponsorEmail: "patricia@example.com", studentName: "Olivia M.", amount: 75.00, pledgeDate: "Dec 10, 2024", status: "pending", notes: "" },
  { id: "4", sponsorName: "Charles Davis", sponsorEmail: "charles@example.com", studentName: "Noah W.", amount: 25.00, pledgeDate: "Dec 18, 2024", status: "pending", notes: "Grandmother" },
  { id: "5", sponsorName: "Jennifer Miller", sponsorEmail: "jennifer@example.com", studentName: "Sophia R.", amount: 40.00, pledgeDate: "Dec 8, 2024", status: "received", notes: "Received 12/20" },
  { id: "6", sponsorName: "Thomas Anderson", sponsorEmail: "thomas@example.com", studentName: "Mason T.", amount: 60.00, pledgeDate: "Dec 5, 2024", status: "bounced", notes: "NSF - contacted sponsor" },
];

const AdminChecksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCheck, setSelectedCheck] = useState<PendingCheck | null>(null);
  const [actionType, setActionType] = useState<"received" | "bounced" | null>(null);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingChecks = mockChecks.filter((c) => c.status === "pending");
  const receivedChecks = mockChecks.filter((c) => c.status === "received");
  const bouncedChecks = mockChecks.filter((c) => c.status === "bounced");

  const filteredChecks = mockChecks.filter(
    (check) =>
      check.sponsorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPending = pendingChecks.reduce((sum, c) => sum + c.amount, 0);

  const handleAction = (check: PendingCheck, action: "received" | "bounced") => {
    setSelectedCheck(check);
    setActionType(action);
    setNotes(check.notes);
  };

  const processAction = async () => {
    if (!selectedCheck || !actionType) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsProcessing(false);

    toast.success(
      actionType === "received"
        ? `Check from ${selectedCheck.sponsorName} marked as received!`
        : `Check from ${selectedCheck.sponsorName} marked as bounced. Sponsor will be notified.`
    );

    setSelectedCheck(null);
    setActionType(null);
    setNotes("");
  };

  const getStatusBadge = (status: PendingCheck["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "received":
        return <Badge variant="success">Received</Badge>;
      case "bounced":
        return <Badge variant="destructive">Bounced</Badge>;
    }
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
                  Check Management
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
              {pendingChecks.length} pending checks totaling ${totalPending.toFixed(2)}
            </p>
          </div>
          <Button variant="outline" onClick={() => toast.success("Exporting check report...")} style={handDrawnBorder}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-serif text-2xl text-foreground">{pendingChecks.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-serif text-2xl text-foreground">{receivedChecks.length}</p>
                <p className="text-sm text-muted-foreground">Received</p>
              </div>
            </div>
          </div>

          <div className="bg-background p-4" style={handDrawnBorder}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-serif text-2xl text-foreground">{bouncedChecks.length}</p>
                <p className="text-sm text-muted-foreground">Bounced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sponsors or students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-background overflow-hidden" style={handDrawnBorder}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Pledge Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{check.sponsorName}</p>
                        <p className="text-sm text-muted-foreground">{check.sponsorEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{check.studentName}</TableCell>
                    <TableCell className="text-right font-serif text-lg">
                      ${check.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{check.pledgeDate}</TableCell>
                    <TableCell>{getStatusBadge(check.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground max-w-[150px] truncate block">
                        {check.notes || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {check.status === "pending" && (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-success hover:text-success"
                            onClick={() => handleAction(check, "received")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleAction(check, "bounced")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {check.status === "bounced" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.success(`Reminder sent to ${check.sponsorName}`)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredChecks.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No checks match your search.
            </div>
          )}
        </div>

        {/* Mailing Instructions */}
        <div className="bg-background p-6 mt-8" style={handDrawnBorder}>
          <h2 className="font-serif text-xl text-foreground mb-4">Check Mailing Instructions</h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Sponsors have been instructed to mail checks to:
            </p>
            <address className="text-foreground not-italic font-medium">
              Janney Elementary PTA<br />
              Read-a-thon Fund<br />
              4130 Albemarle St. NW<br />
              Washington, DC 20016
            </address>
          </div>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={!!selectedCheck && !!actionType} onOpenChange={() => {
        setSelectedCheck(null);
        setActionType(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">
              {actionType === "received" ? "Mark Check as Received" : "Mark Check as Bounced"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "received"
                ? `Confirm receipt of $${selectedCheck?.amount.toFixed(2)} check from ${selectedCheck?.sponsorName}.`
                : `Mark this check as bounced. The sponsor will be notified to provide alternate payment.`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium text-foreground">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={actionType === "received" ? "e.g., Check #1234, received 12/20" : "e.g., NSF - bank returned"}
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedCheck(null);
              setActionType(null);
            }} style={handDrawnBorder}>
              Cancel
            </Button>
            <Button
              onClick={processAction}
              disabled={isProcessing}
              variant={actionType === "bounced" ? "destructive" : "default"}
            >
              {actionType === "received" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Mark Received"}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Mark Bounced"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminChecksPage;
