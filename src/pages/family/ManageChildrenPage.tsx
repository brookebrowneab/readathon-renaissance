import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ReadingGoalRing } from "@/components/legacy";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ReadingLogsTable, ReadingLog } from "@/components/family/ReadingLogsTable";
import { EditChildDialog, ChildProfile } from "@/components/family/EditChildDialog";
import { toast } from "sonner";

// Hand-drawn border style (consistent with other pages)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Mock reading logs data
const mockReadingLogs: Record<string, ReadingLog[]> = {
  "1": [
    { id: "log1", logged_at: "2026-01-22", minutes: 30, book_title: "Harry Potter", student_name: "Emma Johnson" },
    { id: "log2", logged_at: "2026-01-21", minutes: 45, book_title: "Percy Jackson", student_name: "Emma Johnson" },
    { id: "log3", logged_at: "2026-01-20", minutes: 25, book_title: null, student_name: "Emma Johnson" },
    { id: "log4", logged_at: "2026-01-19", minutes: 40, book_title: "The Hobbit", student_name: "Emma Johnson" },
    { id: "log5", logged_at: "2026-01-18", minutes: 35, book_title: "Harry Potter", student_name: "Emma Johnson" },
  ],
  "2": [
    { id: "log6", logged_at: "2026-01-22", minutes: 20, book_title: "Diary of a Wimpy Kid", student_name: "Lucas Johnson" },
    { id: "log7", logged_at: "2026-01-21", minutes: 25, book_title: "Dog Man", student_name: "Lucas Johnson" },
    { id: "log8", logged_at: "2026-01-19", minutes: 30, book_title: null, student_name: "Lucas Johnson" },
  ],
};

// Extended child type with sharing settings
interface ChildData {
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
  daysActive: number;
  sponsors: number;
  sharePublicLink: boolean;
}

// Mock data with sharing settings
const initialChildren: ChildData[] = [
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
    sharePublicLink: true,
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
    sharePublicLink: true,
  },
];

const ManageChildrenPage = () => {
  const [children, setChildren] = useState<ChildData[]>(initialChildren);
  const [readingLogs, setReadingLogs] = useState<Record<string, ReadingLog[]>>(mockReadingLogs);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditLog = (childId: string, logId: string, minutes: number, bookTitle: string) => {
    setReadingLogs((prev) => ({
      ...prev,
      [childId]: prev[childId].map((log) =>
        log.id === logId ? { ...log, minutes, book_title: bookTitle || null } : log
      ),
    }));
    toast.success("Reading log updated");
  };

  const handleDeleteLog = (childId: string, logId: string) => {
    setReadingLogs((prev) => ({
      ...prev,
      [childId]: prev[childId].filter((log) => log.id !== logId),
    }));
    toast.success("Reading log deleted");
  };

  const handleEditChild = (child: ChildData) => {
    setEditingChild({
      id: child.id,
      name: child.name,
      gradeInfo: child.gradeInfo,
      className: child.className,
      goalMinutes: child.goalMinutes,
      sharePublicLink: child.sharePublicLink,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveChild = (updatedProfile: ChildProfile) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === updatedProfile.id
          ? {
              ...child,
              name: updatedProfile.name,
              gradeInfo: updatedProfile.gradeInfo,
              className: updatedProfile.className,
              goalMinutes: updatedProfile.goalMinutes,
              avatarInitials: updatedProfile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2),
              sharePublicLink: updatedProfile.sharePublicLink,
            }
          : child
      )
    );
    toast.success("Profile updated successfully");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      
      <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
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
                  Manage your children's profiles and reading logs
                </p>
              </div>
              <Button asChild style={handDrawnBorder}>
                <Link to="/onboarding/add-child">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Child
                </Link>
              </Button>
            </div>
          </div>

          {/* Children List with Reading Logs */}
          {children.length > 0 ? (
            <div className="space-y-6">
              {children.map((child) => (
                <Collapsible
                  key={child.id}
                  open={expandedChild === child.id}
                  onOpenChange={(open) => setExpandedChild(open ? child.id : null)}
                >
                  <div 
                    className="bg-background shadow-md"
                    style={handDrawnBorder}
                  >
                    {/* Child Header - Always Visible */}
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center font-serif text-xl text-primary">
                            {child.avatarInitials}
                          </div>
                          <div>
                            <h3 className="font-serif text-xl font-normal text-foreground">
                              {child.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {child.gradeInfo} • {child.className}
                            </p>
                          </div>
                          <div className="hidden md:flex items-center gap-6 ml-8">
                            <div className="text-center">
                              <p className="text-2xl font-serif text-primary">{child.minutesRead}</p>
                              <p className="text-xs text-muted-foreground">mins read</p>
                            </div>
                            <ReadingGoalRing progress={child.minutesRead} goal={child.goalMinutes} size={60} />
                            <div className="text-center">
                              <p className="text-2xl font-serif text-accent">{child.sponsors}</p>
                              <p className="text-xs text-muted-foreground">sponsors</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hidden md:inline-flex"
                            onClick={() => handleEditChild(child)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit Profile
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background">
                              <DropdownMenuItem 
                                className="md:hidden"
                                onClick={() => handleEditChild(child)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="md:hidden" />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from Program
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-1">
                              {expandedChild === child.id ? (
                                <>
                                  Hide Logs
                                  <ChevronUp className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  View Logs
                                  <ChevronDown className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>

                      {/* Mobile Stats */}
                      <div className="flex items-center justify-around mt-4 md:hidden">
                        <div className="text-center">
                          <p className="text-xl font-serif text-primary">{child.minutesRead}</p>
                          <p className="text-xs text-muted-foreground">mins read</p>
                        </div>
                        <ReadingGoalRing progress={child.minutesRead} goal={child.goalMinutes} size={50} />
                        <div className="text-center">
                          <p className="text-xl font-serif text-accent">{child.sponsors}</p>
                          <p className="text-xs text-muted-foreground">sponsors</p>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Reading Logs Table */}
                    <CollapsibleContent>
                      <div className="border-t border-border p-6 bg-muted/20">
                        <h4 className="font-serif text-lg text-foreground mb-4">Reading Logs</h4>
                        <ReadingLogsTable
                          logs={readingLogs[child.id] || []}
                          childName={child.name}
                          onEdit={(logId, minutes, bookTitle) => handleEditLog(child.id, logId, minutes, bookTitle)}
                          onDelete={(logId) => handleDeleteLog(child.id, logId)}
                        />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
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

      {/* Edit Child Dialog */}
      <EditChildDialog
        child={editingChild}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveChild}
      />
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
