import { Link, useParams } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReadingGoalRing } from "@/components/legacy";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Settings,
  UserPlus,
  Calendar,
  Star,
  Users,
  DollarSign,
  ChevronRight,
  Clock,
  Flame,
} from "lucide-react";

// Hand-drawn border style (consistent with other pages)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Mock data (expanded from DashboardPage)
const mockChildren: Record<string, {
  id: string;
  name: string;
  avatarInitials: string;
  minutesRead: number;
  goalMinutes: number;
  gradeInfo: string;
  className: string;
  teacher: string;
  classMinutesRead: number;
  gradeMinutesRead: number;
  minutesToday: number;
  longestStreak: number;
  daysActive: number;
}> = {
  "1": {
    id: "1",
    name: "Emma Johnson",
    avatarInitials: "EJ",
    minutesRead: 245,
    goalMinutes: 300,
    gradeInfo: "3rd Grade",
    className: "Mrs. Peterson's Class",
    teacher: "Mrs. Peterson",
    classMinutesRead: 4280,
    gradeMinutesRead: 12450,
    minutesToday: 25,
    longestStreak: 45,
    daysActive: 18,
  },
  "2": {
    id: "2",
    name: "Lucas Johnson",
    avatarInitials: "LJ",
    minutesRead: 180,
    goalMinutes: 250,
    gradeInfo: "1st Grade",
    className: "Mr. Garcia's Class",
    teacher: "Mr. Garcia",
    classMinutesRead: 3150,
    gradeMinutesRead: 9820,
    minutesToday: 15,
    longestStreak: 30,
    daysActive: 12,
  },
};

const mockReadingHistory = [
  { id: "1", date: "Today", minutes: 25, bookTitle: "Charlotte's Web" },
  { id: "2", date: "Yesterday", minutes: 30, bookTitle: "Charlotte's Web" },
  { id: "3", date: "Jan 14", minutes: 20, bookTitle: "Diary of a Wimpy Kid" },
  { id: "4", date: "Jan 13", minutes: 35, bookTitle: null },
  { id: "5", date: "Jan 12", minutes: 15, bookTitle: "Diary of a Wimpy Kid" },
];

const mockSponsors = [
  { id: "1", name: "Grandma Mary", relationship: "Grandmother", pledgeType: "per-minute" as const, pledgeAmount: 0.10, status: "pledged" as const },
  { id: "2", name: "Uncle Bob", relationship: "Uncle", pledgeType: "flat" as const, pledgeAmount: 25, status: "paid" as const },
  { id: "3", name: "Aunt Sarah", relationship: "Aunt", pledgeType: "per-minute" as const, pledgeAmount: 0.05, status: "pledged" as const },
  { id: "4", name: "Coach Williams", relationship: "Coach", pledgeType: "flat" as const, pledgeAmount: 50, status: "pledged" as const },
];

const ChildDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const child = mockChildren[id || "1"];
  
  if (!child) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl text-foreground mb-4">Child not found</h1>
            <Button asChild>
              <Link to="/children">Back to Children</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate sponsor totals
  const totalPledged = mockSponsors.reduce((sum, s) => {
    if (s.pledgeType === "flat") return sum + s.pledgeAmount;
    return sum + (s.pledgeAmount * child.minutesRead);
  }, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/children">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Children
                    </Link>
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center font-serif text-2xl text-primary">
                      {child.avatarInitials}
                    </div>
                    <div>
                      <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                        {child.name}
                      </h1>
                      <p className="text-muted-foreground text-sm md:text-base">
                        {child.gradeInfo} • {child.className}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild style={handDrawnBorder}>
                    <Link to={`/family/children/${child.id}/settings`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Progress Overview */}
              <section>
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6">
                    Reading Progress
                  </h2>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex justify-center">
                      <ReadingGoalRing progress={child.minutesRead} goal={child.goalMinutes} size={140} />
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center rounded-lg bg-accent/10 p-4 border border-accent/20">
                        <Clock className="h-5 w-5 text-accent mb-1" />
                        <span className="text-xs text-muted-foreground">Read Today</span>
                        <span className="font-serif text-2xl text-accent">{child.minutesToday} min</span>
                      </div>
                      <div className="relative flex flex-col items-center rounded-lg bg-muted/30 p-4">
                        <Star className="absolute -right-1 -top-1 h-4 w-4 fill-accent text-accent" />
                        <Flame className="h-5 w-5 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">Longest Streak</span>
                        <span className="font-serif text-2xl text-primary">{child.longestStreak} min</span>
                      </div>
                      <div className="flex flex-col items-center rounded-lg bg-muted/30 p-4">
                        <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Days Active</span>
                        <span className="font-serif text-2xl text-foreground">{child.daysActive}</span>
                      </div>
                      <div className="flex flex-col items-center rounded-lg bg-muted/30 p-4">
                        <BookOpen className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Goal</span>
                        <span className="font-serif text-2xl text-foreground">{child.goalMinutes} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reading History */}
              <section>
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl md:text-2xl text-foreground">
                      Reading Log
                    </h2>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                      <Link to="/reading-logs">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {mockReadingHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm md:text-base">
                            {entry.minutes} minutes
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {entry.bookTitle || "No book specified"} • {entry.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 font-serif text-lg text-primary">
                          {entry.minutes}m
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link to={`/log-reading?child=${child.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Reading
                    </Link>
                  </Button>
                </div>
              </section>

              {/* Sponsors */}
              <section>
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl md:text-2xl text-foreground">
                      Sponsors
                      <Badge variant="secondary" className="ml-2">
                        {mockSponsors.length}
                      </Badge>
                    </h2>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {mockSponsors.map((sponsor) => (
                      <div
                        key={sponsor.id}
                        className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
                      >
                        <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm md:text-base">
                            {sponsor.name}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {sponsor.relationship} • {sponsor.pledgeType === "per-minute" ? `$${sponsor.pledgeAmount.toFixed(2)}/min` : `$${sponsor.pledgeAmount} flat`}
                          </p>
                        </div>
                        <Badge variant={sponsor.status === "paid" ? "default" : "outline"}>
                          {sponsor.status === "paid" ? "Paid" : "Pledged"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Pledged</p>
                      <p className="font-serif text-2xl text-primary">${totalPledged.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary/30" />
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/children/${child.id}/invite`}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite More Sponsors
                    </Link>
                  </Button>
                </div>
              </section>

              {/* Class & Grade Context */}
              <section>
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <h2 className="font-serif text-xl md:text-2xl text-foreground mb-4">
                    Class & Grade
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-border">
                      <p className="text-muted-foreground text-sm">{child.className}</p>
                      <p className="text-xs text-muted-foreground">Teacher: {child.teacher}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center rounded-lg bg-muted/20 p-4">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Class Total</span>
                        <span className="font-serif text-2xl text-foreground">{child.classMinutesRead.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">minutes</span>
                      </div>
                      <div className="flex flex-col items-center rounded-lg bg-muted/20 p-4">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Grade Total</span>
                        <span className="font-serif text-2xl text-foreground">{child.gradeMinutesRead.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Quick Actions Sidebar (Desktop) */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 space-y-4">
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <h3 className="font-serif text-xl text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" asChild>
                      <Link to={`/log-reading?child=${child.id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Log Reading
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to={`/children/${child.id}/invite`}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Sponsors
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to={`/family/children/${child.id}/settings`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Settings
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Stats Summary */}
                <div 
                  className="bg-background p-6 shadow-md"
                  style={handDrawnBorder}
                >
                  <h3 className="font-serif text-xl text-foreground mb-4">Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center rounded-lg bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">Total Minutes</span>
                      <span className="font-serif text-2xl text-primary">{child.minutesRead}</span>
                    </div>
                    <div className="relative flex flex-col items-center rounded-lg bg-muted/30 p-3">
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-accent text-accent" />
                      <span className="text-xs text-muted-foreground">Sponsors</span>
                      <span className="font-serif text-2xl text-primary">{mockSponsors.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Spacer for Bottom Tab Bar */}
        <div className="h-20 md:hidden" />
      </main>
      
      <Footer />
      <BottomTabBar role="parent" />
    </div>
  );
};

export default ChildDetailsPage;
