import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  BookOpen,
  ChevronLeft,
  Filter
} from "lucide-react";
import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for pending reading logs
const mockPendingLogs = [
  { id: "1", studentName: "Emma S.", minutes: 45, date: "Today", bookTitle: "Charlotte's Web", submittedBy: "Student", flagged: false },
  { id: "2", studentName: "Noah P.", minutes: 120, date: "Today", bookTitle: "Magic Tree House", submittedBy: "Parent", flagged: true },
  { id: "3", studentName: "Sophia L.", minutes: 60, date: "Yesterday", bookTitle: "Harry Potter", submittedBy: "Student", flagged: false },
  { id: "4", studentName: "Mason W.", minutes: 25, date: "Today", bookTitle: null, submittedBy: "Student", flagged: false },
  { id: "5", studentName: "Mia F.", minutes: 180, date: "Yesterday", bookTitle: "Diary of a Wimpy Kid", submittedBy: "Parent", flagged: true },
  { id: "6", studentName: "Liam K.", minutes: 30, date: "2 days ago", bookTitle: "Percy Jackson", submittedBy: "Student", flagged: false },
  { id: "7", studentName: "Olivia T.", minutes: 90, date: "Today", bookTitle: "Wonder", submittedBy: "Teacher", flagged: false },
];

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const handDrawnBorderSubtle = {
  borderBottom: 'solid 1px #41403E',
};

export default function VerifyLogsPage() {
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<string>("all");

  const handleLogToggle = (id: string) => {
    setSelectedLogs(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map(log => log.id));
    }
  };

  const handleBulkApprove = () => {
    console.log("Approving:", selectedLogs);
    setSelectedLogs([]);
  };

  const handleBulkReject = () => {
    console.log("Rejecting:", selectedLogs);
    setSelectedLogs([]);
  };

  const filteredLogs = mockPendingLogs.filter(log => {
    if (filterBy === "flagged") return log.flagged;
    if (filterBy === "student") return log.submittedBy === "Student";
    if (filterBy === "parent") return log.submittedBy === "Parent";
    return true;
  });

  const flaggedCount = mockPendingLogs.filter(log => log.flagged).length;

  return (
    <div className="min-h-screen flex flex-col bg-background-warm">
      <MainNav />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground tracking-tight">
                Verify Reading Logs
              </h1>
              <p className="text-muted-foreground mt-1">
                Review and approve reading entries submitted by your children
              </p>
            </div>
            
            {flaggedCount > 0 && (
              <Badge variant="outline" className="self-start sm:self-center border-amber-500 text-amber-600 bg-amber-50">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {flaggedCount} flagged for review
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div 
          className="bg-background p-6 mb-8"
          style={handDrawnBorder}
        >
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="font-serif text-2xl md:text-3xl text-foreground tracking-tight">
                {mockPendingLogs.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                Pending Logs
              </p>
            </div>
            <div 
              className="text-center"
              style={{ borderLeft: 'solid 1px #41403E' }}
            >
              <p className="font-serif text-2xl md:text-3xl text-foreground tracking-tight">
                {mockPendingLogs.reduce((sum, log) => sum + log.minutes, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                Total Minutes
              </p>
            </div>
            <div 
              className="text-center"
              style={{ borderLeft: 'solid 1px #41403E' }}
            >
              <p className="font-serif text-2xl md:text-3xl text-amber-600 tracking-tight">
                {flaggedCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                Needs Review
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="flagged">Flagged Only</SelectItem>
                <SelectItem value="student">By Student</SelectItem>
                <SelectItem value="parent">By Parent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedLogs.length > 0 && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleBulkApprove}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve ({selectedLogs.length})
              </Button>
              <Button size="sm" variant="outline" onClick={handleBulkReject}>
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div 
          className="bg-background overflow-hidden"
          style={handDrawnBorder}
        >
          <Table>
            <TableHeader>
              <TableRow style={handDrawnBorderSubtle}>
                <TableHead className="w-[50px] pt-4">
                  <Checkbox
                    checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-serif text-foreground pt-4">Student</TableHead>
                <TableHead className="font-serif text-foreground pt-4">Book</TableHead>
                <TableHead className="font-serif text-foreground text-center pt-4">Minutes</TableHead>
                <TableHead className="font-serif text-foreground pt-4">Date</TableHead>
                <TableHead className="font-serif text-foreground pt-4">Source</TableHead>
                <TableHead className="font-serif text-foreground text-right pt-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log, index) => (
                <TableRow 
                  key={log.id}
                  className={log.flagged ? "bg-amber-50/50" : ""}
                  style={index < filteredLogs.length - 1 ? handDrawnBorderSubtle : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedLogs.includes(log.id)}
                      onCheckedChange={() => handleLogToggle(log.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{log.studentName}</span>
                      {log.flagged && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.bookTitle || <span className="italic">No book specified</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-serif text-lg ${log.flagged ? "text-amber-600 font-medium" : ""}`}>
                      {log.minutes}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {log.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {log.submittedBy}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length === 0 && (
          <div 
            className="bg-background p-12 text-center"
            style={handDrawnBorder}
          >
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground">
              No reading logs need verification right now.
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Flagged entries (marked with <AlertTriangle className="h-3 w-3 inline text-amber-500" />) 
            indicate unusually long reading sessions that may need verification.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
