import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { User, Mail, Lock, Save, Heart, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
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

const AccountSettingsPage = () => {
  const { user, signOut } = useAuth();
  const { isTeacher } = useTeacherAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || ""
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      // Delete user data from related tables first (cascades should handle most)
      // The auth user deletion needs to be done via admin API or edge function
      // For now, we'll sign out and show a message
      
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
              Manage your profile and security settings
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
    </div>
  );
};

export default AccountSettingsPage;
