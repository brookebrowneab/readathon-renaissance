import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockTeacher = {
  name: "Ms. Johnson",
  grade: "3rd",
  schoolName: "Lincoln Elementary",
};

const mockEvent = {
  name: "Spring Read-a-thon 2024",
  daysRemaining: 12,
};

interface Student {
  id: string;
  firstName: string;
  lastInitial: string;
  minutesRead: number;
  goalMinutes: number;
  lastLogged: string | null;
  status: "exceeding" | "on-track" | "needs-encouragement" | "not-started";
}

const mockStudents: Student[] = [
  { id: "1", firstName: "Emma", lastInitial: "J", minutesRead: 520, goalMinutes: 500, lastLogged: "Today", status: "exceeding" },
  { id: "2", firstName: "Liam", lastInitial: "S", minutesRead: 380, goalMinutes: 500, lastLogged: "Today", status: "on-track" },
  { id: "3", firstName: "Olivia", lastInitial: "M", minutesRead: 247, goalMinutes: 500, lastLogged: "Yesterday", status: "on-track" },
  { id: "4", firstName: "Noah", lastInitial: "B", minutesRead: 180, goalMinutes: 500, lastLogged: "3 days ago", status: "needs-encouragement" },
  { id: "5", firstName: "Ava", lastInitial: "W", minutesRead: 420, goalMinutes: 500, lastLogged: "Today", status: "on-track" },
  { id: "6", firstName: "Ethan", lastInitial: "D", minutesRead: 550, goalMinutes: 500, lastLogged: "Yesterday", status: "exceeding" },
  { id: "7", firstName: "Sophia", lastInitial: "C", minutesRead: 95, goalMinutes: 500, lastLogged: "5 days ago", status: "needs-encouragement" },
  { id: "8", firstName: "Mason", lastInitial: "T", minutesRead: 0, goalMinutes: 500, lastLogged: null, status: "not-started" },
  { id: "9", firstName: "Isabella", lastInitial: "R", minutesRead: 315, goalMinutes: 500, lastLogged: "Today", status: "on-track" },
  { id: "10", firstName: "Lucas", lastInitial: "H", minutesRead: 0, goalMinutes: 500, lastLogged: null, status: "not-started" },
  { id: "11", firstName: "Mia", lastInitial: "K", minutesRead: 480, goalMinutes: 500, lastLogged: "Yesterday", status: "on-track" },
  { id: "12", firstName: "Jackson", lastInitial: "L", minutesRead: 125, goalMinutes: 500, lastLogged: "4 days ago", status: "needs-encouragement" },
];

type SortOption = "name" | "progress" | "last-active";
type FilterOption = "all" | "needs-attention" | "goal-reached";

const TeacherDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const stats = useMemo(() => {
    const participating = mockStudents.filter((s) => s.minutesRead > 0).length;
    const totalMinutes = mockStudents.reduce((sum, s) => sum + s.minutesRead, 0);
    const avgPerStudent = participating > 0 ? Math.round(totalMinutes / participating) : 0;

    return {
      totalStudents: mockStudents.length,
      participating,
      totalMinutes,
      avgPerStudent,
    };
  }, []);

  const filteredStudents = useMemo(() => {
    let result = [...mockStudents];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(query) ||
          s.lastInitial.toLowerCase().includes(query)
      );
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
      result.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === "progress") {
      result.sort((a, b) => b.minutesRead / b.goalMinutes - a.minutesRead / a.goalMinutes);
    } else if (sortBy === "last-active") {
      // Simple sort - Today first, then Yesterday, etc.
      const order = { Today: 0, Yesterday: 1 };
      result.sort((a, b) => {
        const aOrder = a.lastLogged ? (order[a.lastLogged as keyof typeof order] ?? 99) : 999;
        const bOrder = b.lastLogged ? (order[b.lastLogged as keyof typeof order] ?? 99) : 999;
        return aOrder - bOrder;
      });
    }

    return result;
  }, [searchQuery, sortBy, filterBy]);

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "exceeding":
        return <Badge variant="success">Exceeding</Badge>;
      case "on-track":
        return <Badge variant="info">On Track</Badge>;
      case "needs-encouragement":
        return <Badge variant="warning">Needs Encouragement</Badge>;
      case "not-started":
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
              {mockTeacher.name}'s Class
            </h1>
            <p className="text-muted-foreground">
              {mockTeacher.grade} Grade • {mockTeacher.schoolName}
            </p>
          </div>

          {/* Event Status */}
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-4 flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-blue/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <p className="font-medium text-foreground">{mockEvent.name}</p>
                <p className="text-sm text-muted-foreground">
                  {mockEvent.daysRemaining} days remaining • {stats.participating} students participating
                </p>
              </div>
            </div>
            <Badge variant="info">Active</Badge>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <BookContainer variant="default" className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </BookContainer>

            <BookContainer variant="default" className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.participating}</p>
                  <p className="text-sm text-muted-foreground">Participating</p>
                </div>
              </div>
            </BookContainer>

            <BookContainer variant="default" className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMinutes.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                </div>
              </div>
            </BookContainer>

            <BookContainer variant="default" className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.avgPerStudent}</p>
                  <p className="text-sm text-muted-foreground">Avg per Student</p>
                </div>
              </div>
            </BookContainer>
          </div>

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
                Download Report
              </Button>
            </div>
          </div>

          {/* Student Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStudents.map((student) => (
              <Link key={student.id} to={`/teacher/student/${student.id}`}>
                <BookContainer
                  variant="default"
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <ReadingGoalRing
                      progress={student.minutesRead}
                      goal={student.goalMinutes}
                      size={64}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {student.firstName} {student.lastInitial}.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.minutesRead} / {student.goalMinutes} min (
                        {Math.round((student.minutesRead / student.goalMinutes) * 100)}%)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {student.lastLogged ? `Last: ${student.lastLogged}` : "No activity"}
                      </p>
                      <div className="mt-2">{getStatusBadge(student.status)}</div>
                    </div>
                  </div>
                </BookContainer>
              </Link>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students match your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;