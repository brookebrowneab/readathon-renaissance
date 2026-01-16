import { Link } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  UserPlus,
  DollarSign,
  ChevronRight,
  Calendar,
  Clock,
  Eye,
  LogOut,
  Star,
  Bell,
  Mail,
} from "lucide-react";
import booksShelfBanner from "@/assets/books-shelf-banner.png";

// Mock data
const mockUser = {
  name: "Sarah Johnson",
  email: "sarah@example.com",
};

const mockChildren = [
  {
    id: "1",
    name: "Emma Johnson",
    avatarInitials: "EJ",
    minutesRead: 245,
    goalMinutes: 300,
    gradeInfo: "3rd Grade",
    className: "Mrs. Peterson's Class",
    classMinutesRead: 4280,
    gradeMinutesRead: 12450,
    minutesToday: 25,
    longestStreak: 45,
  },
  {
    id: "2",
    name: "Lucas Johnson",
    avatarInitials: "LJ",
    minutesRead: 180,
    goalMinutes: 250,
    gradeInfo: "1st Grade",
    className: "Mr. Garcia's Class",
    classMinutesRead: 3150,
    gradeMinutesRead: 9820,
    minutesToday: 15,
    longestStreak: 30,
  },
];

const mockRecentActivity = [
  {
    id: "1",
    childName: "Emma",
    minutes: 25,
    date: "Today",
    bookTitle: "Charlotte's Web",
  },
  {
    id: "2",
    childName: "Lucas",
    minutes: 15,
    date: "Today",
    bookTitle: "Diary of a Wimpy Kid",
  },
  {
    id: "3",
    childName: "Emma",
    minutes: 30,
    date: "Yesterday",
    bookTitle: "Charlotte's Web",
  },
  {
    id: "4",
    childName: "Lucas",
    minutes: 20,
    date: "Yesterday",
    bookTitle: null,
  },
];

const mockSponsorshipData = {
  totalPledges: 145.5,
  byChild: [
    { name: "Emma", amount: 85.0, sponsors: 4 },
    { name: "Lucas", amount: 60.5, sponsors: 3 },
  ],
};

// Mock pending sponsor requests
const mockPendingSponsorRequests = 2;

// Mock pending reading log approvals (over 8 hours)
const mockPendingLogApprovals = [
  { id: "1", childName: "Emma", minutes: 540, date: "March 5", bookTitle: "Harry Potter" },
];

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      {/* Main Content */}
      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1 space-y-8">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                      <span className="font-handwritten text-4xl text-brand-blue">
                        Welcome,
                      </span>{" "}
                      {mockUser.name.split(" ")[0]}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Here's how your readers are doing this week
                    </p>
                  </div>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      <LogOut className="mr-2 h-4 w-4" />
                      Exit Demo
                    </Button>
                  </Link>
                </div>

                {/* School Stats - Hero Style */}
                <div className="relative pt-6 pb-8 px-6 -mx-4 md:-mx-6 rounded-lg overflow-hidden">
                  {/* Background image layer with enhanced colors */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${booksShelfBanner})`,
                      backgroundRepeat: 'repeat-x',
                      backgroundPosition: 'bottom center',
                      backgroundSize: 'auto 100%',
                      filter: 'saturate(1.5) contrast(1.2)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Janney School Total</p>
                    <div className="relative inline-block mb-1">
                      <span className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight font-normal relative z-10">
                        128,400 minutes
                      </span>
                      {/* Highlighter effect with animation */}
                      <span 
                        className="absolute -skew-y-1 bg-accent/30 transform -rotate-[0.5deg] opacity-0 animate-highlighter-grow"
                        style={{
                          top: '45%',
                          height: '55%',
                          left: '-2%',
                          right: '-2%',
                          borderRadius: '4px 8px 4px 6px',
                        }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-base text-muted-foreground">read together this year</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Spring Read-a-thon 2024</span>
                      <span className="text-foreground font-medium">• 12 days left</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Children Overview */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-normal text-foreground">
                    Your Readers
                  </h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/children">
                      Manage Children
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {mockChildren.map((child) => (
                    <ChildProgressCard key={child.id} child={child} />
                  ))}
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <BookContainer variant="warm" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl text-brand-blue">Recent Activity</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/reading-logs">
                        View all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {mockRecentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 rounded-lg bg-background/80 p-3"
                      >
                        <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-brand-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {activity.childName} read for {activity.minutes} min
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {activity.bookTitle || "No book specified"} •{" "}
                            {activity.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 font-handwritten text-lg text-brand-blue">
                          {activity.minutes}m
                        </div>
                      </div>
                    ))}
                  </div>
                </BookContainer>
              </section>

              {/* Sponsorship Summary */}
              <section>
                <BookContainer variant="warm" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl text-brand-blue">Sponsorship Summary</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/pledges">
                        View all pledges
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-4">
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      <span className="text-xs text-muted-foreground">Total Pledges</span>
                      <span className="font-handwritten text-3xl text-brand-green">
                        ${mockSponsorshipData.totalPledges.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {mockSponsorshipData.byChild.map((child) => (
                        <div
                          key={child.name}
                          className="flex flex-col items-center rounded-lg bg-muted/50 p-3"
                        >
                          <span className="text-xs text-muted-foreground">{child.name}</span>
                          <span className="font-handwritten text-2xl text-brand-blue">
                            ${child.amount.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {child.sponsors} sponsors
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-brand-blue text-white hover:bg-brand-blue/90" asChild>
                      <Link to="/invite">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite More Sponsors
                      </Link>
                    </Button>
                  </div>
                </BookContainer>
              </section>
            </div>

            {/* Quick Actions Sidebar (Desktop) */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 space-y-4">
                <BookContainer variant="default" className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-serif text-xl text-brand-blue mb-4">
                      Quick Actions
                    </h3>
                    <Button className="w-full justify-start bg-brand-blue text-white hover:bg-brand-blue/90" asChild>
                      <Link to="/log-reading">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Reading Log
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/invite">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Sponsor
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/pledges">
                        <DollarSign className="h-4 w-4 mr-2" />
                        View All Pledges
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start relative"
                      asChild
                    >
                      <Link to="/family/sponsor-requests">
                        <Bell className="h-4 w-4 mr-2" />
                        Sponsor Requests
                        {mockPendingSponsorRequests > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {mockPendingSponsorRequests}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  </div>
                </BookContainer>

                {/* Stats Summary */}
                <BookContainer variant="warm" className="p-6">
                  <h3 className="font-serif text-xl text-brand-blue mb-4">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <span className="text-xs text-muted-foreground">Total Minutes</span>
                      <span className="font-handwritten text-2xl text-brand-blue">425</span>
                    </div>
                    <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      <span className="text-xs text-muted-foreground">Sponsors</span>
                      <span className="font-handwritten text-2xl text-brand-blue">7</span>
                    </div>
                  </div>
                </BookContainer>
              </div>
            </aside>
          </div>
        </div>

        {/* Spacer for Bottom Tab Bar */}
        <div className="h-20 md:hidden" />
      </main>
      
      <Footer />
      
      {/* Bottom Tab Bar for Mobile */}
      <BottomTabBar role="parent" />
    </div>
  );
};

// Child Progress Card Component
interface ChildProgressCardProps {
  child: {
    id: string;
    name: string;
    avatarInitials: string;
    minutesRead: number;
    goalMinutes: number;
    gradeInfo: string;
    className: string;
    classMinutesRead: number;
    gradeMinutesRead: number;
    minutesToday: number;
    longestStreak: number;
  };
}

const ChildProgressCard = ({ child }: ChildProgressCardProps) => {
  const percentage = Math.round((child.minutesRead / child.goalMinutes) * 100);

  return (
    <BookContainer variant="default" className="p-6">
      <div className="flex flex-col items-center gap-4">
        <h2 className="w-full text-left font-serif text-2xl font-normal tracking-tight text-brand-blue">
          {child.name.split(" ")[0]}'s Reading
        </h2>
        
        <ReadingGoalRing progress={child.minutesRead} goal={child.goalMinutes} size={120} />
        
        {/* Personal Stats Grid */}
        <div className="mt-2 grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <span className="text-xs text-muted-foreground">Reading Goal</span>
            <span className="font-handwritten text-xl text-brand-blue">{child.goalMinutes} min</span>
          </div>
          <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
            <span className="text-xs text-muted-foreground">Minutes Read</span>
            <span className="font-handwritten text-xl text-brand-blue">{child.minutesRead} min</span>
          </div>
        </div>

        {/* Today & Streak Stats */}
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-accent/10 p-3 border border-accent/20">
            <span className="text-xs text-muted-foreground">Read Today</span>
            <span className="font-handwritten text-xl text-accent">{child.minutesToday} min</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-brand-green/10 p-3 border border-brand-green/20">
            <span className="text-xs text-muted-foreground">Longest Stretch</span>
            <span className="font-handwritten text-xl text-brand-green">{child.longestStreak} min</span>
          </div>
        </div>

        {/* Class & Grade Stats */}
        <div className="w-full space-y-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">{child.className} • {child.gradeInfo}</p>
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="flex flex-col items-center rounded-lg bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Class Total</span>
              <span className="font-serif text-lg text-foreground">{child.classMinutesRead.toLocaleString()} min</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-muted/30 p-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Grade Total</span>
              <span className="font-serif text-lg text-foreground">{child.gradeMinutesRead.toLocaleString()} min</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/children/${child.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Link>
          </Button>
          <Button size="sm" className="flex-1 bg-brand-blue text-white hover:bg-brand-blue/90" asChild>
            <Link to={`/log-reading?child=${child.id}`}>
              <BookOpen className="h-4 w-4 mr-1" />
              Log
            </Link>
          </Button>
        </div>
      </div>
    </BookContainer>
  );
};

export default DashboardPage;
