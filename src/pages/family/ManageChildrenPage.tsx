import { Link } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ReadingGoalRing } from "@/components/legacy";
import {
  BookOpen,
  Plus,
  ChevronRight,
  ArrowLeft,
  Settings,
  UserPlus,
  Trash2,
  MoreVertical,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import openBookBanner from "@/assets/open-book-banner.png";

// Hand-drawn border style (consistent with other pages)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Mock data (same as DashboardPage for consistency)
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
    daysActive: 18,
    sponsors: 4,
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
    daysActive: 12,
    sponsors: 3,
  },
];

const ManageChildrenPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      <main className="flex-1 bg-background-warm">
        <div className="container py-8">
          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
                  <span className="font-handwritten text-4xl text-primary">Your</span> Readers
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  Manage your children's profiles and reading progress
                </p>
              </div>
              <Button asChild style={handDrawnBorder}>
                <Link to="/onboarding/add-child">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Child
                </Link>
              </Button>
            </div>

            {/* Banner Image */}
            <div className="relative">
              <img src={openBookBanner} alt="Open book illustration" className="w-full h-auto max-h-32 object-contain" />
            </div>
          </div>

          {/* Children Grid */}
          {mockChildren.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {mockChildren.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Spacer for Bottom Tab Bar */}
        <div className="h-20 md:hidden" />
      </main>
      
      <Footer />
      <BottomTabBar role="parent" />
    </div>
  );
};

// Child Card Component
interface ChildCardProps {
  child: {
    id: string;
    name: string;
    avatarInitials: string;
    minutesRead: number;
    goalMinutes: number;
    gradeInfo: string;
    className: string;
    minutesToday: number;
    longestStreak: number;
    daysActive: number;
    sponsors: number;
  };
}

const ChildCard = ({ child }: ChildCardProps) => {
  return (
    <div 
      className="bg-background p-6 shadow-md"
      style={handDrawnBorder}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-serif text-lg text-primary">
            {child.avatarInitials}
          </div>
          <div>
            <h3 className="font-serif text-xl font-normal text-foreground">
              {child.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {child.gradeInfo} • {child.className}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/family/children/${child.id}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/children/${child.id}/invite`}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Sponsors
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove from Program
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Progress */}
      <div className="flex justify-center mb-4">
        <ReadingGoalRing progress={child.minutesRead} goal={child.goalMinutes} size={100} />
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex flex-col items-center rounded-lg bg-accent/10 p-3 border border-accent/20">
          <span className="text-xs text-muted-foreground">Read Today</span>
          <span className="font-serif text-lg text-accent">{child.minutesToday} min</span>
        </div>
        <div className="relative flex flex-col items-center rounded-lg bg-muted/30 p-3">
          <Star className="absolute -right-1 -top-1 h-4 w-4 fill-accent text-accent" />
          <span className="text-xs text-muted-foreground">Longest Streak</span>
          <span className="font-serif text-lg text-primary">{child.longestStreak} min</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex flex-col items-center rounded-lg bg-muted/30 p-2">
          <span className="text-xs text-muted-foreground">Days Active</span>
          <span className="font-serif text-lg text-foreground">{child.daysActive}</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-muted/30 p-2">
          <span className="text-xs text-muted-foreground">Sponsors</span>
          <span className="font-serif text-lg text-foreground">{child.sponsors}</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/children/${child.id}`}>
            Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link to={`/log-reading?child=${child.id}`}>
            <BookOpen className="h-4 w-4 mr-1" />
            Log Reading
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = () => {
  return (
    <div 
      className="bg-background p-12 shadow-md text-center"
      style={handDrawnBorder}
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <BookOpen className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-serif text-2xl text-foreground mb-2">
        No children enrolled yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Add your first child to start tracking their reading progress and connecting with sponsors.
      </p>
      <Button asChild style={handDrawnBorder}>
        <Link to="/onboarding/add-child">
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Child
        </Link>
      </Button>
    </div>
  );
};

export default ManageChildrenPage;
