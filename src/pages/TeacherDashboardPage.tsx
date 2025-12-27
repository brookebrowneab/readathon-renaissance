import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Users,
  Clock,
  Trophy,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  Mail,
  Search,
  Filter,
  ChevronRight,
  LogOut,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockTeacher = {
  name: "Mrs. Anderson",
  className: "Room 204",
  grade: "3rd Grade",
  school: "Lincoln Elementary",
};

const mockEventInfo = {
  name: "Spring Read-a-thon 2024",
  daysRemaining: 12,
  isActive: true,
};

const mockClassStats = {
  totalStudents: 24,
  participatingStudents: 22,
  totalMinutes: 4250,
  classGoal: 7200, // 300 min × 24 students
  averagePerStudent: 177,
  pendingApprovals: 5,
};

const mockStudents = [
  { id: "1", name: "Emma S.", minutes: 245, goal: 300, lastActive: "Today", status: "exceeding" },
  { id: "2", name: "Liam T.", minutes: 220, goal: 300, lastActive: "Today", status: "on-track" },
  { id: "3", name: "Olivia R.", minutes: 195, goal: 300, lastActive: "Yesterday", status: "on-track" },
  { id: "4", name: "Noah P.", minutes: 180, goal: 300, lastActive: "Today", status: "on-track" },
  { id: "5", name: "Ava M.", minutes: 165, goal: 300, lastActive: "2 days ago", status: "on-track" },
  { id: "6", name: "Mason W.", minutes: 145, goal: 300, lastActive: "Today", status: "needs-attention" },
  { id: "7", name: "Sophia L.", minutes: 310, goal: 300, lastActive: "Today", status: "exceeding" },
  { id: "8", name: "Jackson K.", minutes: 120, goal: 300, lastActive: "3 days ago", status: "needs-attention" },
  { id: "9", name: "Isabella H.", minutes: 275, goal: 300, lastActive: "Today", status: "on-track" },
  { id: "10", name: "Lucas G.", minutes: 88, goal: 300, lastActive: "5 days ago", status: "needs-attention" },
  { id: "11", name: "Mia F.", minutes: 340, goal: 300, lastActive: "Today", status: "exceeding" },
  { id: "12", name: "Ethan D.", minutes: 210, goal: 300, lastActive: "Yesterday", status: "on-track" },
];

const mockPendingApprovals = [
  { id: "1", studentName: "Emma S.", minutes: 45, date: "Today", bookTitle: "Charlotte's Web" },
  { id: "2", studentName: "Noah P.", minutes: 30, date: "Today", bookTitle: "Magic Tree House" },
  { id: "3", studentName: "Sophia L.", minutes: 60, date: "Yesterday", bookTitle: "Harry Potter" },
  { id: "4", studentName: "Mason W.", minutes: 25, date: "Today", bookTitle: null },
  { id: "5", studentName: "Mia F.", minutes: 40, date: "Today", bookTitle: "Diary of a Wimpy Kid" },
];

const mockClassComparison = [
  { name: "Room 204 (You)", minutes: 4250, position: 2 },
  { name: "Room 201", minutes: 4890, position: 1 },
  { name: "Room 203", minutes: 3980, position: 3 },
  { name: "Room 202", minutes: 3750, position: 4 },
];

type SortOption = "name" | "progress" | "activity";
type FilterOption = "all" | "needs-attention" | "goal-reached";

const TeacherDashboardPage = () => {
  const [sortBy, setSortBy] = useState<SortOption>("progress");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  // Filter and sort students
  const filteredStudents = mockStudents
    .filter((student) => {
      if (searchQuery) {
        return student.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (filterBy === "needs-attention") return student.status === "needs-attention";
      if (filterBy === "goal-reached") return student.minutes >= student.goal;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return (b.minutes / b.goal) - (a.minutes / a.goal);
      return 0; // activity sorting would use dates
    });

  const needsAttentionCount = mockStudents.filter(s => s.status === "needs-attention").length;
  const goalReachedCount = mockStudents.filter(s => s.minutes >= s.goal).length;

  const handleApprovalToggle = (id: string) => {
    setSelectedApprovals(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    console.log("Approving:", selectedApprovals);
    setSelectedApprovals([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "exceeding": return "text-brand-green";
      case "on-track": return "text-brand-blue";
      case "needs-attention": return "text-amber-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "exceeding": return <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />;
      case "on-track": return <CheckCircle className="h-4 w-4 text-brand-green" />;
      case "needs-attention": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return null;
    }
  };

  const classPercentage = Math.round((mockClassStats.totalMinutes / mockClassStats.classGoal) * 100);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                <span className="font-handwritten text-4xl text-brand-blue">Hello,</span>{" "}
                {mockTeacher.name}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {mockTeacher.className} • {mockTeacher.grade} • {mockTeacher.school}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Exit Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Event Banner */}
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand-blue/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-brand-blue" />
              </div>
              <div>
                <p className="font-medium text-foreground">{mockEventInfo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {mockEventInfo.daysRemaining} days remaining
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-handwritten text-2xl text-brand-blue">{mockClassStats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="text-center">
                <p className="font-handwritten text-2xl text-brand-blue">{mockClassStats.totalMinutes.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Min</p>
              </div>
              <div className="text-center">
                <p className="font-handwritten text-2xl text-brand-green">
                  {Math.round((mockClassStats.participatingStudents / mockClassStats.totalStudents) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">Participating</p>
              </div>
              <Badge variant="info">Active</Badge>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Class Progress */}
              <BookContainer variant="default" className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex justify-center md:justify-start">
                    <ReadingGoalRing 
                      progress={mockClassStats.totalMinutes} 
                      goal={mockClassStats.classGoal} 
                      size={140}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="font-serif text-2xl text-brand-blue">Class Progress</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <span className="text-xs text-muted-foreground">Total Minutes</span>
                        <p className="font-handwritten text-2xl text-brand-blue">
                          {mockClassStats.totalMinutes.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <span className="text-xs text-muted-foreground">Class Goal</span>
                        <p className="font-handwritten text-2xl text-brand-blue">
                          {mockClassStats.classGoal.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <span className="text-xs text-muted-foreground">Avg per Student</span>
                        <p className="font-handwritten text-2xl text-brand-blue">
                          {mockClassStats.averagePerStudent} min
                        </p>
                      </div>
                      <div className="relative rounded-lg bg-muted/50 p-3">
                        <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                        <span className="text-xs text-muted-foreground">Goal Reached</span>
                        <p className="font-handwritten text-2xl text-brand-green">
                          {goalReachedCount} students
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </BookContainer>

              {/* Student Grid */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="font-serif text-xl font-normal text-foreground">
                    Students ({filteredStudents.length})
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-40"
                      />
                    </div>
                    <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="needs-attention">
                          Needs Attention ({needsAttentionCount})
                        </SelectItem>
                        <SelectItem value="goal-reached">
                          Goal Reached ({goalReachedCount})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="progress">By Progress</SelectItem>
                        <SelectItem value="name">By Name</SelectItem>
                        <SelectItem value="activity">By Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredStudents.map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
                </div>
              </section>

              {/* Pending Approvals */}
              {mockClassStats.pendingApprovals > 0 && (
                <section>
                  <BookContainer variant="warm" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl text-brand-blue">Pending Approvals</h3>
                        <Badge variant="secondary">{mockClassStats.pendingApprovals}</Badge>
                      </div>
                      {selectedApprovals.length > 0 && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleBulkApprove}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve ({selectedApprovals.length})
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {mockPendingApprovals.map((approval) => (
                        <div 
                          key={approval.id}
                          className="flex items-center gap-3 rounded-lg bg-background/80 p-3"
                        >
                          <Checkbox
                            checked={selectedApprovals.includes(approval.id)}
                            onCheckedChange={() => handleApprovalToggle(approval.id)}
                          />
                          <div className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-4 w-4 text-brand-blue" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm">
                              {approval.studentName} • {approval.minutes} min
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {approval.bookTitle || "No book specified"} • {approval.date}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-brand-green hover:text-brand-green hover:bg-brand-green/10">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BookContainer>
                </section>
              )}
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <BookContainer variant="default" className="p-6">
                <h3 className="font-serif text-xl text-brand-blue mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-brand-blue text-white hover:bg-brand-blue/90" asChild>
                    <Link to="/teacher-log-reading">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Log Reading for Student
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Class Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Encouragement Emails
                  </Button>
                </div>
              </BookContainer>

              {/* Class Comparison */}
              <BookContainer variant="warm" className="p-6">
                <h3 className="font-serif text-xl text-brand-blue mb-4">Grade Leaderboard</h3>
                <div className="space-y-3">
                  {mockClassComparison.map((cls, index) => (
                    <div 
                      key={cls.name}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-3",
                        cls.position === 2 ? "bg-brand-blue/10 border border-brand-blue/20" : "bg-background/80"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                        index === 0 ? "bg-brand-yellow text-foreground" : 
                        index === 1 ? "bg-gray-300 text-foreground" :
                        index === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                      )}>
                        #{cls.position}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium text-sm",
                          cls.position === 2 ? "text-brand-blue" : "text-foreground"
                        )}>
                          {cls.name}
                        </p>
                      </div>
                      <span className="font-handwritten text-lg text-brand-blue">
                        {cls.minutes.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </BookContainer>

              {/* Class Leaderboard (Toggleable) */}
              <BookContainer variant="default" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-brand-blue">Top Readers</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                  >
                    {showLeaderboard ? (
                      <><EyeOff className="h-4 w-4 mr-1" /> Hide</>
                    ) : (
                      <><Eye className="h-4 w-4 mr-1" /> Show</>
                    )}
                  </Button>
                </div>
                
                {showLeaderboard && (
                  <div className="space-y-2">
                    {mockStudents
                      .sort((a, b) => b.minutes - a.minutes)
                      .slice(0, 5)
                      .map((student, index) => (
                        <div 
                          key={student.id}
                          className="flex items-center gap-3 rounded-lg bg-muted/50 p-2"
                        >
                          <div className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                            index === 0 ? "bg-brand-yellow text-foreground" : 
                            index === 1 ? "bg-gray-300 text-foreground" :
                            index === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </div>
                          <span className="flex-1 text-sm font-medium">{student.name}</span>
                          <span className="font-handwritten text-brand-blue">{student.minutes}</span>
                        </div>
                      ))}
                  </div>
                )}
              </BookContainer>

              {/* Needs Attention */}
              {needsAttentionCount > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        {needsAttentionCount} students need encouragement
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        These students haven't logged reading recently or are behind on their goal.
                      </p>
                      <Button size="sm" variant="outline" className="mt-3">
                        <Mail className="h-4 w-4 mr-1" />
                        Send Reminders
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Spacer for bottom tab bar */}
        <div className="h-20 md:hidden" />
      </main>
      
      <Footer />
      <BottomTabBar role="teacher" />
    </div>
  );
};

// Student Card Component
interface StudentCardProps {
  student: {
    id: string;
    name: string;
    minutes: number;
    goal: number;
    lastActive: string;
    status: string;
  };
}

const StudentCard = ({ student }: StudentCardProps) => {
  const percentage = Math.round((student.minutes / student.goal) * 100);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "exceeding": return "border-brand-green/30 bg-brand-green/5";
      case "on-track": return "border-border";
      case "needs-attention": return "border-amber-500/30 bg-amber-500/5";
      default: return "border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "exceeding": return <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />;
      case "on-track": return <CheckCircle className="h-4 w-4 text-brand-green" />;
      case "needs-attention": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className={cn(
      "rounded-xl border-2 bg-card p-4 transition-all hover:shadow-md",
      getStatusColor(student.status)
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-foreground">{student.name}</h4>
          {getStatusIcon(student.status)}
        </div>
        <span className="text-xs text-muted-foreground">{student.lastActive}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Mini Progress Circle */}
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              className="stroke-muted"
              strokeWidth="6"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              className={cn(
                "transition-all duration-500",
                student.status === "exceeding" ? "stroke-brand-green" :
                student.status === "needs-attention" ? "stroke-amber-500" : "stroke-brand-blue"
              )}
              strokeWidth="6"
              strokeDasharray={`${Math.min(percentage, 100) * 1.76} 176`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-handwritten text-lg text-brand-blue">{percentage}%</span>
          </div>
        </div>
        
        <div className="flex-1">
          <p className="font-handwritten text-xl text-brand-blue">
            {student.minutes} <span className="text-muted-foreground text-sm font-sans">/ {student.goal}</span>
          </p>
          <p className="text-xs text-muted-foreground">minutes</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <Button variant="ghost" size="sm" className="flex-1 text-xs h-8">
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 text-xs h-8">
          <BookOpen className="h-3 w-3 mr-1" />
          Log
        </Button>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
