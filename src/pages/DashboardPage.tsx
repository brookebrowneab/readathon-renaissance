import { Link } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { StatCard } from "@/components/ui/stat-card";
import { BookContainer } from "@/components/legacy";
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
} from "lucide-react";

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
  },
  {
    id: "2",
    name: "Lucas Johnson",
    avatarInitials: "LJ",
    minutesRead: 180,
    goalMinutes: 250,
    gradeInfo: "1st Grade",
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
                    <h1 className="text-3xl font-bold text-foreground">
                      <span className="font-handwritten text-4xl text-primary">
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

                {/* Event Banner */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Spring Read-a-thon 2024
                      </p>
                      <p className="text-sm text-muted-foreground">
                        12 days remaining • Goal: 300 minutes per child
                      </p>
                    </div>
                  </div>
                  <Badge variant="info">Active</Badge>
                </div>
              </div>

              {/* Children Overview */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Your Readers
                  </h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/children">
                      Manage Children
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {mockChildren.map((child) => (
                    <ChildProgressCard key={child.id} child={child} />
                  ))}
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <DataCard
                  header="Recent Activity"
                  headerAction={
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/reading-logs">
                        View all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  }
                >
                  <div className="space-y-3">
                    {mockRecentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 py-2 border-b border-border last:border-0"
                      >
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
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
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {activity.minutes}m
                        </div>
                      </div>
                    ))}
                  </div>
                </DataCard>
              </section>

              {/* Sponsorship Summary */}
              <section>
                <DataCard
                  header="Sponsorship Summary"
                  headerAction={
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/pledges">
                        View all pledges
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  }
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Pledges
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          ${mockSponsorshipData.totalPledges.toFixed(2)}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {mockSponsorshipData.byChild.map((child) => (
                        <div
                          key={child.name}
                          className="flex items-center justify-between py-2"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {child.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {child.sponsors} sponsors
                            </p>
                          </div>
                          <p className="font-semibold text-foreground">
                            ${child.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Button variant="secondary" className="w-full" asChild>
                      <Link to="/invite">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite More Sponsors
                      </Link>
                    </Button>
                  </div>
                </DataCard>
              </section>
            </div>

            {/* Quick Actions Sidebar (Desktop) */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 space-y-4">
                <BookContainer variant="default" className="p-0">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground mb-4">
                      Quick Actions
                    </h3>
                    <Button className="w-full justify-start" asChild>
                      <Link to="/log-reading">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Reading Log
                      </Link>
                    </Button>
                    <Button
                      variant="secondary"
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
                  </div>
                </BookContainer>

                {/* Stats Summary */}
                <div className="space-y-3">
                  <StatCard
                    value="425"
                    label="Total Minutes Read"
                    icon={Clock}
                    trend={{ value: 12, isPositive: true }}
                  />
                  <StatCard
                    value="7"
                    label="Total Sponsors"
                    icon={UserPlus}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border lg:hidden z-40">
          <div className="flex gap-3">
            <Button className="flex-1" asChild>
              <Link to="/log-reading">
                <Plus className="h-4 w-4 mr-2" />
                Log Reading
              </Link>
            </Button>
            <Button variant="secondary" size="icon" asChild>
              <Link to="/invite">
                <UserPlus className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
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
  };
}

const ChildProgressCard = ({ child }: ChildProgressCardProps) => {
  const percentage = Math.round((child.minutesRead / child.goalMinutes) * 100);

  return (
    <DataCard className="relative">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
          {child.avatarInitials}
        </div>

        {/* Name & Grade */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">{child.name}</h3>
          <p className="text-sm text-muted-foreground">{child.gradeInfo}</p>
        </div>

        {/* Progress Ring */}
        <div className="relative w-[120px] h-[120px]">
          <svg
            className="w-full h-full -rotate-90 transform"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              className="stroke-secondary"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              className="stroke-primary transition-all duration-700"
              strokeWidth="10"
              strokeDasharray={`${Math.min(percentage, 100) * 3.14} 314`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">{percentage}%</span>
          </div>
        </div>

        {/* Minutes Info */}
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{child.minutesRead}</span>
          {" / "}
          {child.goalMinutes} minutes
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <Button variant="secondary" size="sm" className="flex-1" asChild>
            <Link to={`/children/${child.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/log-reading?child=${child.id}`}>
              <BookOpen className="h-4 w-4 mr-1" />
              Log
            </Link>
          </Button>
        </div>
      </div>
    </DataCard>
  );
};

export default DashboardPage;
