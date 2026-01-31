import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
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
import { TablePagination, usePagination } from "@/components/ui/table-pagination";
import { Search, BookOpen, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const LARGE_LOG_THRESHOLD = 480; // 8 hours in minutes

interface ReadingLogWithChild {
  id: string;
  student_name: string;
  minutes: number;
  book_title: string | null;
  logged_at: string;
  created_at: string;
  child_id: string | null;
  children: {
    name: string;
    class_name: string | null;
    grade_info: string | null;
  } | null;
}

export default function AdminReadingLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showLargeOnly, setShowLargeOnly] = useState(searchParams.get('filter') === 'large');

  // Sync URL filter param
  useEffect(() => {
    if (searchParams.get('filter') === 'large') {
      setShowLargeOnly(true);
    }
  }, [searchParams]);

  // Fetch all reading logs with child info
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["admin-reading-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reading_logs")
        .select(`
          id,
          student_name,
          minutes,
          book_title,
          logged_at,
          created_at,
          child_id,
          children (
            name,
            class_name,
            grade_info
          )
        `)
        .order("logged_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      return data as ReadingLogWithChild[];
    },
  });

  // Get unique grades and classes for filters
  const grades = [...new Set(logs.map(l => l.children?.grade_info).filter(Boolean))].sort();
  const classes = [...new Set(logs.map(l => l.children?.class_name).filter(Boolean))].sort();

  // Filter logs
  const filteredLogs = logs.filter(log => {
    // Large log filter
    if (showLargeOnly && log.minutes <= LARGE_LOG_THRESHOLD) {
      return false;
    }

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      log.student_name.toLowerCase().includes(searchLower) ||
      (log.book_title?.toLowerCase().includes(searchLower)) ||
      (log.children?.class_name?.toLowerCase().includes(searchLower));

    // Grade filter
    const matchesGrade = gradeFilter === "all" || log.children?.grade_info === gradeFilter;

    // Class filter
    const matchesClass = classFilter === "all" || log.children?.class_name === classFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== "all") {
      const logDate = new Date(log.logged_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === "today") {
        matchesDate = logDate >= today;
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = logDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = logDate >= monthAgo;
      }
    }

    return matchesSearch && matchesGrade && matchesClass && matchesDate;
  });

  const largeLogsCount = logs.filter(l => l.minutes > LARGE_LOG_THRESHOLD).length;

  const handleToggleLargeOnly = () => {
    const newValue = !showLargeOnly;
    setShowLargeOnly(newValue);
    if (newValue) {
      setSearchParams({ filter: 'large' });
    } else {
      setSearchParams({});
    }
  };

  // Pagination
  const {
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    paginatedItems,
  } = usePagination(filteredLogs.length, 25);

  const paginatedLogs = useMemo(() => paginatedItems(filteredLogs), [filteredLogs, currentPage, pageSize]);

  const totalMinutes = filteredLogs.reduce((sum, log) => sum + log.minutes, 0);

  return (
    <AdminLayout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl text-foreground tracking-tight">
            Reading Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            View and search all reading activity
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-background border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Logs</p>
            <p className="font-serif text-2xl">{filteredLogs.length}</p>
          </div>
          <div className="bg-background border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Minutes</p>
            <p className="font-serif text-2xl">{totalMinutes.toLocaleString()}</p>
          </div>
          <div className="bg-background border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Unique Students</p>
            <p className="font-serif text-2xl">
              {new Set(filteredLogs.map(l => l.child_id)).size}
            </p>
          </div>
          <div className="bg-background border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg. Minutes/Log</p>
            <p className="font-serif text-2xl">
              {filteredLogs.length ? Math.round(totalMinutes / filteredLogs.length) : 0}
            </p>
          </div>
          <button
            onClick={handleToggleLargeOnly}
            className={`bg-background border rounded-lg p-4 text-left transition-colors hover:border-destructive/50 ${
              showLargeOnly ? 'border-destructive bg-destructive/5' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${largeLogsCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              <p className="text-sm text-muted-foreground">Over 8 Hours</p>
            </div>
            <p className={`font-serif text-2xl ${largeLogsCount > 0 ? 'text-destructive' : ''}`}>
              {largeLogsCount}
            </p>
            {showLargeOnly && (
              <p className="text-xs text-destructive mt-1">Filtering active</p>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student, book, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map(grade => (
                <SelectItem key={grade} value={grade!}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map(cls => (
                <SelectItem key={cls} value={cls!}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-background border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead className="text-center">Minutes</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No reading logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{log.student_name}</p>
                            {log.children?.grade_info && (
                              <p className="text-xs text-muted-foreground">
                                {log.children.grade_info}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.book_title || (
                          <span className="text-muted-foreground italic">No book</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={log.minutes > LARGE_LOG_THRESHOLD ? "destructive" : "secondary"} 
                          className="font-mono"
                        >
                          {log.minutes}
                          {log.minutes > LARGE_LOG_THRESHOLD && (
                            <AlertTriangle className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.children?.class_name || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(log.logged_at), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {filteredLogs.length > 0 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredLogs.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
