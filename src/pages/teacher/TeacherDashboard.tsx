import { useState, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Clock,
  TrendingUp,
  UserCheck,
  Download,
  BookOpen,
  Search,
  Calendar,
  Loader2,
  LogOut,
} from "lucide-react";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { useTeacherStudents, useTeacherStudentLogs } from "@/hooks/useTeacherStudents";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/hooks/useAuth";
import { differenceInDays, parseISO, format, isToday, isYesterday } from "date-fns";
import { handDrawnBorder } from "@/lib/admin-styles";

type SortOption = "name" | "progress" | "last-active";
type FilterOption = "all" | "needs-attention" | "goal-reached";

type StudentStatus = "exceeding" | "on-track" | "needs-encouragement" | "not-started";

const TeacherDashboard = () => {
  const { user, teacherProfile, isLoading: authLoading } = useTeacherAuth();
  const { signOut } = useAuth();
  const { students, isLoading: studentsLoading } = useTeacherStudents();
  const { data: activeEvent, isLoading: eventLoading } = useActiveEvent();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  
  const studentIds = useMemo(() => students.map(s => s.id), [students]);
  const { lastLoggedByStudent, booksByStudent, isLoading: logsLoading } = useTeacherStudentLogs(studentIds);

  const isLoading = authLoading || studentsLoading || eventLoading;

  // Calculate student status
  const getStudentStatus = (totalMinutes: number, goalMinutes: number): StudentStatus => {
    if (totalMinutes === 0) return "not-started";
    const progress = totalMinutes / goalMinutes;
    if (progress >= 1) return "exceeding";
    if (progress >= 0.5) return "on-track";
    return "needs-encouragement";
  };

  // Format last logged date
  const formatLastLogged = (dateStr: string | undefined): string => {
    if (!dateStr) return "No activity";
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    const daysAgo = differenceInDays(new Date(), date);
    if (daysAgo < 7) return `${daysAgo} days ago`;
    return format(date, "MMM d");
  };

  // Calculate stats
  const stats = useMemo(() => {
    const participating = students.filter((s) => s.total_minutes > 0).length;
    const totalMinutes = students.reduce((sum, s) => sum + s.total_minutes, 0);
    const avgPerStudent = participating > 0 ? Math.round(totalMinutes / participating) : 0;

    return {
      totalStudents: students.length,
      participating,
      totalMinutes,
      avgPerStudent,
    };
  }, [students]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = students.map(student => ({
      ...student,
      status: getStudentStatus(student.total_minutes, student.goal_minutes),
      lastLogged: formatLastLogged(lastLoggedByStudent[student.id]),
      books: booksByStudent[student.id] || [],
    }));

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(query));
    }

    // Filter
    if (filterBy === "needs-attention") {
      result = result.filter(
        (s) => s.status === "needs-encouragement" || s.status === "not-started"
      );
    } else if (filterBy === "goal-reached") {
      result = result.filter((s) => s.status === "exceeding");
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "progress") {
      result.sort((a, b) => b.total_minutes / b.goal_minutes - a.total_minutes / a.goal_minutes);
    } else if (sortBy === "last-active") {
      const order: Record<string, number> = { "Today": 0, "Yesterday": 1 };
      result.sort((a, b) => {
        const aOrder = order[a.lastLogged] ?? (a.lastLogged === "No activity" ? 999 : 50);
        const bOrder = order[b.lastLogged] ?? (b.lastLogged === "No activity" ? 999 : 50);
        return aOrder - bOrder;
      });
    }

    return result;
  }, [students, searchQuery, sortBy, filterBy, lastLoggedByStudent, booksByStudent]);

  // Redirect if not a teacher - after all hooks
  if (!authLoading && (!user || !teacherProfile)) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case "exceeding":
        return <Badge variant="success">Goal Reached</Badge>;
      case "on-track":
        return <Badge variant="info">On Track</Badge>;
      case "needs-encouragement":
        return <Badge variant="warning">Needs Encouragement</Badge>;
      case "not-started":
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  // Calculate days remaining for active event
  const daysRemaining = activeEvent 
    ? Math.max(0, differenceInDays(parseISO(activeEvent.end_date), new Date()))
    : 0;

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-warm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
                {teacherProfile?.name}'s Dashboard
              </h1>
              <p className="text-muted-foreground capitalize">
                {teacherProfile?.teacher_type === "homeroom" ? "Homeroom Teacher" : 
                 teacherProfile?.teacher_type === "partner" ? "Partner Teacher" :
                 teacherProfile?.teacher_type === "staff" ? "Staff" : 
                 teacherProfile?.teacher_type}
                {teacherProfile?.has_full_access && " • Full Access"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Event Status */}
          {activeEvent && (
            <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-4 flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-blue/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{activeEvent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {daysRemaining} days remaining • {stats.participating} of {stats.totalStudents} students participating
                  </p>
                </div>
              </div>
              <Badge variant="info">Active</Badge>
            </div>
          )}

          {/* Stats Row */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-background p-4 shadow-sm" style={handDrawnBorder}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                </div>
              </div>

              <div className="bg-background p-4 shadow-sm" style={handDrawnBorder}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.participating}</p>
                    <p className="text-sm text-muted-foreground">Participating</p>
                  </div>
                </div>
              </div>

              <div className="bg-background p-4 shadow-sm" style={handDrawnBorder}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalMinutes.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Minutes</p>
                  </div>
                </div>
              </div>

              <div className="bg-background p-4 shadow-sm" style={handDrawnBorder}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.avgPerStudent}</p>
                    <p className="text-sm text-muted-foreground">Avg per Student</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="last-active">Last Active</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                  <SelectItem value="goal-reached">Goal Reached</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button asChild>
                <Link to="/teacher/log">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Log Reading
                </Link>
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Student Grid */}
          {studentsLoading || logsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-background p-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  style={handDrawnBorder}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <ReadingGoalRing
                        progress={student.total_minutes}
                        goal={student.goal_minutes}
                        size={56}
                      />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-medium text-foreground truncate">
                        {student.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {student.total_minutes.toLocaleString()} / {student.goal_minutes.toLocaleString()} min
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        Last: {student.lastLogged}
                      </p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {getStatusBadge(student.status)}
                        {student.books.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {student.books.length} {student.books.length === 1 ? 'book' : 'books'}
                          </Badge>
                        )}
                      </div>
                      {student.books.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-1">Recent books:</p>
                          <div className="flex flex-wrap gap-1">
                            {student.books.slice(0, 3).map((book, i) => (
                              <span 
                                key={i} 
                                className="text-xs bg-muted px-1.5 py-0.5 rounded truncate max-w-[120px]"
                                title={book}
                              >
                                {book}
                              </span>
                            ))}
                            {student.books.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{student.books.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!studentsLoading && filteredStudents.length === 0 && (
            <div className="text-center py-12">
              {students.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground">No students found.</p>
                  <p className="text-sm text-muted-foreground">
                    Students will appear here once they are assigned to your class.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No students match your search.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;
