import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Trophy,
  Star,
  BookOpen,
  CreditCard,
  AlertTriangle,
  Bell,
  Calendar,
  Edit,
  StopCircle,
  ChevronRight,
  UserPlus,
  LogOut,
  Activity,
  School,
  Filter,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EditEventDialog } from "@/components/admin/EditEventDialog";
import { useActiveEvent, formatEventDates } from "@/hooks/useActiveEvent";

// Hand-drawn border style (consistent with DashboardPage)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const mockMetrics = {
  totalStudents: 487,
  totalMinutes: 89450,
  totalPledges: 1247,
  amountPledged: 12847.50,
  amountCollected: 8234.00,
};

const mockDailyData = [
  { date: "Mar 1", minutes: 2400, students: 320 },
  { date: "Mar 2", minutes: 1800, students: 280 },
  { date: "Mar 3", minutes: 3200, students: 380 },
  { date: "Mar 4", minutes: 2800, students: 350 },
  { date: "Mar 5", minutes: 4100, students: 420 },
  { date: "Mar 6", minutes: 3800, students: 400 },
  { date: "Mar 7", minutes: 4500, students: 445 },
  { date: "Mar 8", minutes: 3200, students: 360 },
  { date: "Mar 9", minutes: 2100, students: 290 },
  { date: "Mar 10", minutes: 4800, students: 460 },
];

const mockGradeData = [
  { grade: "K", minutes: 8200, students: 45 },
  { grade: "1st", minutes: 12400, students: 52 },
  { grade: "2nd", minutes: 14800, students: 58 },
  { grade: "3rd", minutes: 18200, students: 62 },
  { grade: "4th", minutes: 16500, students: 55 },
  { grade: "5th", minutes: 19350, students: 65 },
];

const mockTopStudents = [
  { name: "Sophia L.", grade: "3rd", minutes: 840, school: "Lincoln Elementary" },
  { name: "Emma S.", grade: "3rd", minutes: 720, school: "Lincoln Elementary" },
  { name: "Jackson M.", grade: "5th", minutes: 695, school: "Washington Elementary" },
  { name: "Olivia R.", grade: "4th", minutes: 680, school: "Lincoln Elementary" },
  { name: "Liam T.", grade: "2nd", minutes: 645, school: "Jefferson Elementary" },
];

const mockTopClasses = [
  { name: "Room 204", teacher: "Mrs. Anderson", grade: "3rd", avgMinutes: 285, total: 6840 },
  { name: "Room 112", teacher: "Mr. Chen", grade: "5th", avgMinutes: 272, total: 7072 },
  { name: "Room 305", teacher: "Ms. Garcia", grade: "4th", avgMinutes: 265, total: 6360 },
  { name: "Room 201", teacher: "Mrs. Johnson", grade: "3rd", avgMinutes: 258, total: 6192 },
  { name: "Room 108", teacher: "Mr. Williams", grade: "2nd", avgMinutes: 245, total: 5635 },
];

const mockTopSponsors = [
  { name: "Johnson Family", pledges: 5, amount: 425.00 },
  { name: "Smith Foundation", pledges: 12, amount: 380.00 },
  { name: "Garcia Family", pledges: 3, amount: 350.00 },
  { name: "Chen Family", pledges: 4, amount: 285.00 },
  { name: "Williams Corp", pledges: 8, amount: 240.00 },
];

const mockActivityFeed = [
  { id: "1", type: "reading", message: "Emma S. logged 45 minutes", time: "2 min ago" },
  { id: "2", type: "pledge", message: "New pledge: $25 for Liam T.", time: "5 min ago" },
  { id: "3", type: "registration", message: "New student: Noah P. joined", time: "12 min ago" },
  { id: "4", type: "payment", message: "Payment received: $50 from Johnson Family", time: "18 min ago" },
  { id: "5", type: "reading", message: "Room 204 logged classroom reading (24 students)", time: "25 min ago" },
  { id: "6", type: "pledge", message: "New pledge: $0.10/min for Sophia L.", time: "32 min ago" },
  { id: "7", type: "registration", message: "New class registered: Room 305", time: "45 min ago" },
  { id: "8", type: "payment", message: "Payment received: $75 from Chen Family", time: "1 hour ago" },
];

const mockAlerts = [
  { id: "1", type: "payment", message: "42 pledges pending collection ($2,450)", severity: "warning" },
  { id: "2", type: "registration", message: "8 unconfirmed student registrations", severity: "info" },
  { id: "3", type: "system", message: "Event ends in 12 days", severity: "info" },
];

type ChartMetric = "minutes" | "students";
type ActivityFilter = "all" | "reading" | "pledge" | "registration" | "payment";

const AdminDashboardPage = () => {
  const [chartMetric, setChartMetric] = useState<ChartMetric>("minutes");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [editEventOpen, setEditEventOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { data: activeEvent, isLoading: eventLoading } = useActiveEvent();
  const eventDates = formatEventDates(activeEvent);

  const filteredActivity = mockActivityFeed.filter(
    (item) => activityFilter === "all" || item.type === activityFilter
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "reading": return <BookOpen className="h-4 w-4 text-primary" />;
      case "pledge": return <DollarSign className="h-4 w-4 text-accent" />;
      case "registration": return <UserPlus className="h-4 w-4 text-secondary" />;
      case "payment": return <CreditCard className="h-4 w-4 text-accent" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "setup": return <Badge variant="secondary">Setup</Badge>;
      case "active": return <Badge variant="info">Active</Badge>;
      case "ended": return <Badge variant="outline">Ended</Badge>;
      default: return null;
    }
  };

  const handleEventSave = () => {
    queryClient.invalidateQueries({ queryKey: ['active-event'] });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative inline-block">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.05] relative">
                <span className="relative">
                  Admin Dashboard
                  {/* Highlighter effect */}
                  <span 
                    className="absolute inset-0 -skew-y-1 bg-accent/30 -z-10 transform -rotate-[0.5deg]"
                    style={{
                      top: '45%',
                      height: '55%',
                      left: '-2%',
                      right: '-2%',
                      borderRadius: '4px 8px 4px 6px',
                    }}
                    aria-hidden="true"
                  />
                </span>
              </h1>
            </div>
            <Link to="/login">
              <Button 
                variant="ghost" 
                size="sm"
                style={handDrawnBorder}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Exit Demo
              </Button>
            </Link>
          </div>

          {/* Event Status Hero */}
          <div className="mb-8">
            <div 
              className="bg-background p-6 shadow-md"
              style={handDrawnBorder}
            >
              {activeEvent ? (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-serif text-2xl font-normal text-foreground md:text-3xl">
                          {activeEvent.name}
                        </h2>
                        {getStatusBadge(eventDates.status)}
                      </div>
                      <p className="text-muted-foreground">
                        {eventDates.startDate} – {eventDates.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-handwritten text-4xl text-primary">{eventDates.daysRemaining}</p>
                      <p className="text-sm text-muted-foreground">days left</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        style={handDrawnBorder}
                        onClick={() => setEditEventOpen(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Event
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-destructive hover:text-destructive" style={handDrawnBorder}>
                            <StopCircle className="h-4 w-4 mr-2" />
                            End Event
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>End this event?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will close the event for new reading logs and begin the pledge collection process.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              End Event
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="font-serif text-2xl text-foreground mb-2">No Active Read-a-thon</h2>
                  <p className="text-muted-foreground mb-4">Create a new event to get started</p>
                  <Button onClick={() => setEditEventOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Read-a-thon
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Alerts */}
          {mockAlerts.length > 0 && (
            <div className="mb-8 space-y-2">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 p-4 bg-background shadow-sm"
                  style={handDrawnBorder}
                >
                  {alert.severity === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-accent shrink-0" />
                  ) : (
                    <Bell className="h-5 w-5 text-primary shrink-0" />
                  )}
                  <p className="flex-1 text-sm text-foreground">{alert.message}</p>
                  <Button variant="ghost" size="sm">
                    View <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <MetricCard
              label="Total Students"
              value={mockMetrics.totalStudents.toLocaleString()}
              icon={Users}
              color="blue"
            />
            <MetricCard
              label="Total Minutes"
              value={mockMetrics.totalMinutes.toLocaleString()}
              icon={Clock}
              color="blue"
              subtext={`${Math.round(mockMetrics.totalMinutes / mockMetrics.totalStudents)} avg/student`}
            />
            <MetricCard
              label="Total Pledges"
              value={mockMetrics.totalPledges.toLocaleString()}
              icon={TrendingUp}
              color="green"
            />
            <MetricCard
              label="Amount Pledged"
              value={`$${mockMetrics.amountPledged.toLocaleString()}`}
              icon={DollarSign}
              color="green"
            />
            <MetricCard
              label="Amount Collected"
              value={`$${mockMetrics.amountCollected.toLocaleString()}`}
              icon={CreditCard}
              color="green"
              subtext={`${Math.round((mockMetrics.amountCollected / mockMetrics.amountPledged) * 100)}% of pledged`}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Charts - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Activity Chart */}
              <div 
                className="bg-background p-6 shadow-md"
                style={handDrawnBorder}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl text-primary">Daily Activity</h2>
                  <div className="flex gap-2">
                    <Button
                      variant={chartMetric === "minutes" ? "default" : "outline"}
                      size="sm"
                      className={cn(chartMetric === "minutes" && "bg-primary text-primary-foreground hover:bg-primary/90")}
                      onClick={() => setChartMetric("minutes")}
                    >
                      Minutes
                    </Button>
                    <Button
                      variant={chartMetric === "students" ? "default" : "outline"}
                      size="sm"
                      className={cn(chartMetric === "students" && "bg-primary text-primary-foreground hover:bg-primary/90")}
                      onClick={() => setChartMetric("students")}
                    >
                      Students
                    </Button>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockDailyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line
                        type="monotone"
                        dataKey={chartMetric}
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grade Distribution Chart */}
              <div 
                className="bg-muted/30 p-6 shadow-md"
                style={handDrawnBorder}
              >
                <h2 className="font-serif text-xl text-primary mb-4">Participation by Grade</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockGradeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="grade" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Performers */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Top Students */}
                <div 
                  className="bg-background p-4 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="h-5 w-5 text-accent" />
                    <h3 className="font-serif text-lg text-primary">Top Students</h3>
                  </div>
                  <div className="space-y-2">
                    {mockTopStudents.slice(0, 5).map((student, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                          i === 0 ? "bg-accent text-foreground" :
                          i === 1 ? "bg-gray-300 text-foreground" :
                          i === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {i + 1}
                        </span>
                        <span className="flex-1 truncate">{student.name}</span>
                        <span className="font-handwritten text-primary">{student.minutes}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Classes */}
                <div 
                  className="bg-muted/30 p-4 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <School className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-lg text-primary">Top Classes</h3>
                  </div>
                  <div className="space-y-2">
                    {mockTopClasses.slice(0, 5).map((cls, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                          i === 0 ? "bg-accent text-foreground" :
                          i === 1 ? "bg-gray-300 text-foreground" :
                          i === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {i + 1}
                        </span>
                        <span className="flex-1 truncate">{cls.name}</span>
                        <span className="font-handwritten text-primary">{cls.avgMinutes}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Sponsors */}
                <div 
                  className="bg-background p-4 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-accent fill-accent" />
                    <h3 className="font-serif text-lg text-primary">Top Sponsors</h3>
                  </div>
                  <div className="space-y-2">
                    {mockTopSponsors.slice(0, 5).map((sponsor, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                          i === 0 ? "bg-accent text-foreground" :
                          i === 1 ? "bg-gray-300 text-foreground" :
                          i === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {i + 1}
                        </span>
                        <span className="flex-1 truncate">{sponsor.name}</span>
                        <span className="font-handwritten text-accent">${sponsor.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed - 1 column */}
            <div className="space-y-6">
              <div 
                className="bg-background p-6 shadow-md"
                style={handDrawnBorder}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl text-primary">Recent Activity</h2>
                  <Select value={activityFilter} onValueChange={(v) => setActivityFilter(v as ActivityFilter)}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="pledge">Pledges</SelectItem>
                      <SelectItem value="registration">Registrations</SelectItem>
                      <SelectItem value="payment">Payments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{item.message}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div 
                className="bg-muted/30 p-6 shadow-md"
                style={handDrawnBorder}
              >
                <h3 className="font-serif text-lg text-primary mb-4">Today's Highlights</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">New readings</span>
                    <span className="font-handwritten text-xl text-primary">142</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Minutes logged</span>
                    <span className="font-handwritten text-xl text-primary">3,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">New pledges</span>
                    <span className="font-handwritten text-xl text-accent">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payments received</span>
                    <span className="font-handwritten text-xl text-accent">$425</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div 
                className="bg-background p-6 shadow-md"
                style={handDrawnBorder}
              >
                <h3 className="font-serif text-xl text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button 
                    className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" 
                    asChild
                  >
                    <Link to="/admin-users">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/admin-finance">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Financial Management
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Spacer for bottom tab bar */}
        <div className="h-20 md:hidden" />
      </main>

      <Footer />
      <BottomTabBar role="admin" />

      <EditEventDialog 
        open={editEventOpen} 
        onOpenChange={setEditEventOpen}
        event={activeEvent ? {
          id: activeEvent.id,
          name: activeEvent.name,
          start_date: new Date(activeEvent.start_date),
          end_date: new Date(activeEvent.end_date),
          last_log_date: new Date(activeEvent.last_log_date),
          is_active: activeEvent.is_active,
        } : null}
        onSave={handleEventSave}
      />
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green";
  subtext?: string;
}

const MetricCard = ({ label, value, icon: Icon, color, subtext }: MetricCardProps) => (
  <div 
    className="bg-background p-4 shadow-md"
    style={handDrawnBorder}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn(
          "font-handwritten text-2xl mt-1",
          color === "blue" ? "text-primary" : "text-accent"
        )}>
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        )}
      </div>
      <div className={cn(
        "h-10 w-10 rounded-lg flex items-center justify-center",
        color === "blue" ? "bg-primary/10" : "bg-accent/10"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          color === "blue" ? "text-primary" : "text-accent"
        )} />
      </div>
    </div>
  </div>
);

export default AdminDashboardPage;
