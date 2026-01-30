import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SponsorInvitation {
  id: string;
  child_id: string;
  inviter_user_id: string;
  invitee_email: string;
  invitee_user_id: string | null;
  status: "pending" | "approved" | "declined";
  can_invite_others: boolean;
  invited_by_parent: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  child?: {
    id: string;
    name: string;
    grade_info: string | null;
    share_public_link: boolean;
  } | null;
}

// Fetch invitations for children owned by the current user (parent view)
export function useParentInvitations() {
  return useQuery({
    queryKey: ["sponsor-invitations", "parent"],
    queryFn: async (): Promise<SponsorInvitation[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get all children owned by user, then get their invitations
      const { data: children } = await supabase
        .from("children")
        .select("id")
        .eq("user_id", user.id);

      if (!children?.length) return [];

      const childIds = children.map(c => c.id);

      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .select(`
          *,
          child:children(id, name, grade_info, share_public_link)
        `)
        .in("child_id", childIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as SponsorInvitation[];
    },
  });
}

// Fetch invitations sent by the current user
export function useSentInvitations() {
  return useQuery({
    queryKey: ["sponsor-invitations", "sent"],
    queryFn: async (): Promise<SponsorInvitation[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .select(`
          *,
          child:children(id, name, grade_info, share_public_link)
        `)
        .eq("inviter_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as SponsorInvitation[];
    },
  });
}

// Fetch invitations received by the current user (by email or user_id)
export function useReceivedInvitations() {
  return useQuery({
    queryKey: ["sponsor-invitations", "received"],
    queryFn: async (): Promise<SponsorInvitation[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get invitations where user is invitee (by user_id or email)
      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .select(`
          *,
          child:children(id, name, grade_info, share_public_link)
        `)
        .or(`invitee_user_id.eq.${user.id},invitee_email.eq.${user.email}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as SponsorInvitation[];
    },
  });
}

// Check if a sponsor is approved for a specific child
export function useIsSponsorApproved(childId: string | undefined) {
  return useQuery({
    queryKey: ["sponsor-approved", childId],
    queryFn: async (): Promise<boolean> => {
      if (!childId) return false;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if child has public link enabled (auto-approve)
      const { data: child } = await supabase
        .from("children")
        .select("share_public_link")
        .eq("id", childId)
        .single();

      if (child?.share_public_link) return true;

      // Check if there's an approved invitation for this sponsor
      const { data: invitation } = await (supabase as any)
        .from("sponsor_invitations")
        .select("status")
        .eq("child_id", childId)
        .or(`invitee_user_id.eq.${user.id},invitee_email.eq.${user.email}`)
        .eq("status", "approved")
        .maybeSingle();

      return !!invitation;
    },
    enabled: !!childId,
  });
}

// Create a new invitation
export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      childId,
      inviteeEmail,
      invitedByParent = false,
    }: {
      childId: string;
      inviteeEmail: string;
      invitedByParent?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if child is owned by user (parent) or sponsor has permission
      const { data: child } = await supabase
        .from("children")
        .select("user_id")
        .eq("id", childId)
        .single();

      const isParent = child?.user_id === user.id;

      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .insert({
          child_id: childId,
          inviter_user_id: user.id,
          invitee_email: inviteeEmail.toLowerCase(),
          invited_by_parent: isParent || invitedByParent,
          // If parent sends, auto-approve. Otherwise pending.
          status: isParent ? "approved" : "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-invitations"] });
      toast.success("Invitation sent!");
    },
    onError: (error) => {
      toast.error("Failed to send invitation", {
        description: error.message,
      });
    },
  });
}

// Approve or decline an invitation (parent action)
export function useUpdateInvitationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invitationId,
      status,
      canInviteOthers = false,
    }: {
      invitationId: string;
      status: "approved" | "declined";
      canInviteOthers?: boolean;
    }) => {
      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .update({
          status,
          can_invite_others: status === "approved" ? canInviteOthers : false,
        })
        .eq("id", invitationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorable-children"] });
      queryClient.invalidateQueries({ queryKey: ["sponsor-approved"] });
      toast.success(
        variables.status === "approved"
          ? "Sponsor approved!"
          : "Request declined"
      );
    },
    onError: (error) => {
      toast.error("Failed to update invitation", {
        description: error.message,
      });
    },
  });
}

// Link invitation to user when they make a pledge
export function useLinkInvitationToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      childId,
    }: {
      childId: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Find invitation for this user/email and link it
      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .update({
          invitee_user_id: user.id,
        })
        .eq("child_id", childId)
        .or(`invitee_email.eq.${user.email}`)
        .is("invitee_user_id", null)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-invitations"] });
    },
  });
}

// Delete an invitation
export function useDeleteInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await (supabase as any)
        .from("sponsor_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-invitations"] });
      toast.success("Invitation deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete invitation", {
        description: error.message,
      });
    },
  });
}
