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
  UserPlus,
  Loader2,
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
import { ReadingLogsTable } from "@/components/family/ReadingLogsTable";
import { EditChildDialog } from "@/components/family/EditChildDialog";
import { useChildren, Child, ChildUpdate } from "@/hooks/useChildren";
import { useAllChildrenReadingLogs } from "@/hooks/useReadingLogs";
import { ChildReadingLogsSection } from "@/components/family/ChildReadingLogsSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Hand-drawn border style (consistent with other pages)
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const ManageChildrenPage = () => {
  const { children, isLoading, updateChild, deleteChild } = useChildren();
  const { data: allLogs = {}, isLoading: logsLoading } = useAllChildrenReadingLogs();
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmChild, setDeleteConfirmChild] = useState<Child | null>(null);

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setIsEditDialogOpen(true);
  };

  const handleSaveChild = (updates: ChildUpdate) => {
    updateChild.mutate(updates, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditingChild(null);
      },
    });
  };

  const handleDeleteChild = (child: Child) => {
    setDeleteConfirmChild(child);
  };

  const confirmDeleteChild = () => {
    if (deleteConfirmChild) {
      deleteChild.mutate(deleteConfirmChild.id, {
        onSuccess: () => {
          setDeleteConfirmChild(null);
        },
      });
    }
  };

  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate total minutes from logs
  const getChildMinutes = (childId: string) => {
    const logs = allLogs[childId] || [];
    return logs.reduce((sum, log) => sum + log.minutes, 0);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 bg-background-warm flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

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
              {children.map((child) => {
                const totalMinutes = getChildMinutes(child.id);
                
                return (
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
                              {getAvatarInitials(child.name)}
                            </div>
                            <div>
                              <h3 className="font-serif text-xl font-normal text-foreground">
                                {child.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {child.grade_info || "No grade set"} • {child.class_name || "No class set"}
                              </p>
                            </div>
                            <div className="hidden md:flex items-center gap-6 ml-8">
                              <div className="text-center">
                                <p className="text-2xl font-serif text-primary">{totalMinutes}</p>
                                <p className="text-xs text-muted-foreground">mins read</p>
                              </div>
                              <ReadingGoalRing progress={totalMinutes} goal={child.goal_minutes} size={60} />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="hidden md:inline-flex"
                              asChild
                            >
                              <Link to={`/children/${child.id}/invite`}>
                                <UserPlus className="h-4 w-4 mr-1" />
                                Invite Sponsors
                              </Link>
                            </Button>
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
                                <DropdownMenuItem className="md:hidden" asChild>
                                  <Link to={`/children/${child.id}/invite`}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Invite Sponsors
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="md:hidden"
                                  onClick={() => handleEditChild(child)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="md:hidden" />
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteChild(child)}
                                >
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
                            <p className="text-xl font-serif text-primary">{totalMinutes}</p>
                            <p className="text-xs text-muted-foreground">mins read</p>
                          </div>
                          <ReadingGoalRing progress={totalMinutes} goal={child.goal_minutes} size={50} />
                        </div>
                      </div>

                      {/* Collapsible Reading Logs Table */}
                      <CollapsibleContent>
                        <ChildReadingLogsSection childId={child.id} childName={child.name} />
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
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
        isSaving={updateChild.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmChild} onOpenChange={(open) => !open && setDeleteConfirmChild(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteConfirmChild?.name} from the program?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all their reading logs and sponsor connections. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteChild}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteChild.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
