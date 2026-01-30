import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Heart, 
  Trash2, 
  AlertTriangle, 
  Users, 
  GraduationCap, 
  Link as LinkIcon,
  Eye,
  Check,
  X,
  ExternalLink,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { useChildren, Child } from "@/hooks/useChildren";
import { useParentInvitations, useUpdateInvitationStatus, useDeleteInvitation, SponsorInvitation } from "@/hooks/useSponsorInvitations";
import { EditChildDialog } from "@/components/family/EditChildDialog";
import { supabase } from "@/integrations/supabase/client";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AccountSettingsPage = () => {
  const { user, signOut } = useAuth();
  const { isTeacher } = useTeacherAuth();
  const navigate = useNavigate();
  
  // Children management
  const { children, isLoading: childrenLoading, updateChild, deleteChild } = useChildren();
  const { data: invitations = [], isLoading: invitationsLoading } = useParentInvitations();
  const updateInvitation = useUpdateInvitationStatus();
  const deleteInvitation = useDeleteInvitation();
  
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || ""
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);
  const [childDeleteConfirmation, setChildDeleteConfirmation] = useState("");
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingChild, setIsDeletingChild] = useState(false);

  // Group invitations by child
  const pendingInvitationsByChild = invitations
    .filter(inv => inv.status === "pending")
    .reduce((acc, inv) => {
      const childId = inv.child_id;
      if (!acc[childId]) acc[childId] = [];
      acc[childId].push(inv);
      return acc;
    }, {} as Record<string, SponsorInvitation[]>);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error("Failed to update profile", {
        description: error.message
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error("Failed to update password", {
        description: error.message
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleTogglePublicLink = async (child: Child) => {
    updateChild.mutate({
      id: child.id,
      share_public_link: !child.share_public_link,
    });
  };

  const handleApproveInvitation = (invitationId: string) => {
    updateInvitation.mutate({
      invitationId,
      status: "approved",
      canInviteOthers: false,
    });
  };

  const handleDeclineInvitation = (invitationId: string) => {
    updateInvitation.mutate({
      invitationId,
      status: "declined",
    });
  };

  const handleDeleteChild = async () => {
    if (!childToDelete || childDeleteConfirmation !== childToDelete.name) {
      toast.error(`Please type "${childToDelete?.name}" to confirm`);
      return;
    }

    setIsDeletingChild(true);
    try {
      // Get unpaid pledges for notification (optional - could add edge function later)
      const { data: unpaidPledges } = await supabase
        .from("pledges")
        .select("*, sponsors(*)")
        .eq("child_id", childToDelete.id)
        .eq("is_paid", false);

      // Delete the child (cascades to reading_logs, pledges, invitations)
      deleteChild.mutate(childToDelete.id, {
        onSuccess: () => {
          toast.success(`${childToDelete.name} removed from Read-a-thon`, {
            description: unpaidPledges?.length 
              ? `${unpaidPledges.length} unpaid pledge(s) were cancelled.`
              : undefined
          });
          setChildToDelete(null);
          setChildDeleteConfirmation("");
        },
        onError: (error) => {
          toast.error("Failed to remove child", {
            description: error.message
          });
        }
      });
    } catch (error: any) {
      toast.error("Failed to remove child", {
        description: error.message
      });
    } finally {
      setIsDeletingChild(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      // Delete children (which cascades to reading_logs, pledges via child_id)
      await supabase.from("children").delete().eq("user_id", user?.id);
      
      // Delete sponsor profile if exists
      await supabase.from("sponsors").delete().eq("user_id", user?.id);
      
      // Delete class pledges
      await supabase.from("class_pledges").delete().eq("sponsor_user_id", user?.id);
      
      // Delete profile
      await supabase.from("profiles").delete().eq("user_id", user?.id);

      // Sign out the user
      await signOut();
      
      toast.success("Account data deleted", {
        description: "Your account data has been removed. Contact support to fully delete your auth account."
      });
      
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to delete account", {
        description: error.message
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveChild = (updates: any) => {
    updateChild.mutate(updates, {
      onSuccess: () => {
        setEditingChild(null);
        toast.success("Child profile updated");
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile, children, and security settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Quick Links - Only show for non-teachers */}
            {!isTeacher && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">My Pledges</CardTitle>
                  </div>
                  <CardDescription>
                    View and manage all your pledges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link to="/my-pledges">
                      <Heart className="h-4 w-4 mr-2" />
                      View My Pledges
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Children's Accounts Section - Only for parents */}
            {!isTeacher && children.length > 0 && (
              <Card id="children">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Children's Accounts</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your children's profiles, student logins, and sponsor access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {children.map((child) => {
                    const pendingForChild = pendingInvitationsByChild[child.id] || [];
                    const isExpanded = expandedChildId === child.id;
                    
                    return (
                      <Collapsible 
                        key={child.id} 
                        open={isExpanded}
                        onOpenChange={() => setExpandedChildId(isExpanded ? null : child.id)}
                      >
                        <div className="border rounded-lg p-4">
                          {/* Child Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-serif text-lg text-primary">
                                {child.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">{child.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {child.grade_info || "No grade"} • {child.class_name || "No teacher"}
                                </p>
                              </div>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </CollapsibleTrigger>
                          </div>

                          {/* Quick Info Badges */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant={child.student_login_enabled ? "default" : "outline"} className="text-xs">
                              <KeyRound className="h-3 w-3 mr-1" />
                              {child.student_login_enabled ? "Login enabled" : "Login disabled"}
                            </Badge>
                            <Badge variant={child.share_public_link ? "default" : "outline"} className="text-xs">
                              <LinkIcon className="h-3 w-3 mr-1" />
                              {child.share_public_link ? "Public link" : "Private"}
                            </Badge>
                            {pendingForChild.length > 0 && (
                              <Badge variant="warning" className="text-xs">
                                {pendingForChild.length} pending request{pendingForChild.length !== 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-2 mb-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingChild(child)}
                            >
                              Edit Profile
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link to={`/family/children/${child.id}`}>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Details
                              </Link>
                            </Button>
                          </div>

                          <CollapsibleContent className="space-y-4">
                            <Separator />

                            {/* Student Login Info */}
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium flex items-center gap-2">
                                <KeyRound className="h-4 w-4" />
                                Student Login
                              </h5>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Username:</span>{" "}
                                  <span className="font-mono">{child.student_username || "Not set"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>{" "}
                                  {child.student_login_enabled ? (
                                    <span className="text-success">Enabled</span>
                                  ) : (
                                    <span className="text-muted-foreground">Disabled</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Public Link Toggle */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div>
                                <p className="text-sm font-medium">Public Sponsor Link</p>
                                <p className="text-xs text-muted-foreground">
                                  Allow anyone to sponsor without invitation
                                </p>
                              </div>
                              <Switch
                                checked={child.share_public_link}
                                onCheckedChange={() => handleTogglePublicLink(child)}
                                disabled={updateChild.isPending}
                              />
                            </div>

                            {/* Pending Sponsor Requests */}
                            {pendingForChild.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  Pending Sponsor Requests
                                </h5>
                                <div className="space-y-2">
                                  {pendingForChild.map((invitation) => (
                                    <div 
                                      key={invitation.id}
                                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                                    >
                                      <div>
                                        <p className="text-sm font-medium">{invitation.invitee_email}</p>
                                        <p className="text-xs text-muted-foreground">
                                          Requested to sponsor
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleApproveInvitation(invitation.id)}
                                          disabled={updateInvitation.isPending}
                                        >
                                          <Check className="h-3 w-3 mr-1" />
                                          Approve
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeclineInvitation(invitation.id)}
                                          disabled={updateInvitation.isPending}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Danger Zone for Child */}
                            <div className="pt-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => setChildToDelete(child)}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Remove from Read-a-thon
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove {child.name}?</AlertDialogTitle>
                                    <AlertDialogDescription className="space-y-3">
                                      <p>
                                        This will permanently remove {child.name} from the Read-a-thon. This action cannot be undone.
                                      </p>
                                      <ul className="list-disc list-inside text-sm space-y-1">
                                        <li>All reading logs will be deleted</li>
                                        <li>Unpaid pledges will be cancelled</li>
                                        <li>Sponsors will be notified</li>
                                      </ul>
                                      <div className="pt-2">
                                        <Label htmlFor="childDeleteConfirm" className="text-foreground">
                                          Type <span className="font-mono font-bold">{child.name}</span> to confirm:
                                        </Label>
                                        <Input
                                          id="childDeleteConfirm"
                                          value={childDeleteConfirmation}
                                          onChange={(e) => setChildDeleteConfirmation(e.target.value)}
                                          placeholder={child.name}
                                          className="mt-2"
                                        />
                                      </div>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => {
                                      setChildToDelete(null);
                                      setChildDeleteConfirmation("");
                                    }}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteChild}
                                      disabled={childDeleteConfirmation !== child.name || isDeletingChild}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {isDeletingChild ? "Removing..." : "Remove Child"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Profile Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                </div>
                <CardDescription>
                  Update your display name and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isSavingProfile}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Change Password</CardTitle>
                </div>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button 
                  onClick={handleChangePassword} 
                  disabled={isSavingPassword || !newPassword || !confirmPassword}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone - Only show for non-teachers */}
            {!isTeacher && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                  </div>
                  <CardDescription>
                    Permanently delete your account and all associated data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data including:
                          </p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            <li>All your children's profiles and reading logs</li>
                            <li>All pledges you've made</li>
                            <li>Your sponsor profile (if applicable)</li>
                            <li>All associated data</li>
                          </ul>
                          <div className="pt-2">
                            <Label htmlFor="deleteConfirm" className="text-foreground">
                              Type <span className="font-mono font-bold">DELETE</span> to confirm:
                            </Label>
                            <Input
                              id="deleteConfirm"
                              value={deleteConfirmation}
                              onChange={(e) => setDeleteConfirmation(e.target.value)}
                              placeholder="DELETE"
                              className="mt-2"
                            />
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmation !== "DELETE" || isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting..." : "Delete Account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Child Dialog */}
      <EditChildDialog
        child={editingChild}
        open={!!editingChild}
        onOpenChange={(open) => !open && setEditingChild(null)}
        onSave={handleSaveChild}
        isSaving={updateChild.isPending}
      />
    </div>
  );
};

export default AccountSettingsPage;
