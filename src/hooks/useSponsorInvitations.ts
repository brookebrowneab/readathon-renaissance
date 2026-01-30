import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SponsorInvitation {
  id: string;
  child_id: string;
  inviter_user_id: string;
  invitee_email: string;
  invitee_user_id: string | null;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

// Fetch invitations sent by the current user
export function useSentInvitations() {
  return useQuery({
    queryKey: ["sponsor-invitations", "sent"],
    queryFn: async (): Promise<SponsorInvitation[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Using type assertion since table is new and types not yet regenerated
      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .select("*")
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
        .select("*")
        .or(`invitee_user_id.eq.${user.id},invitee_email.eq.${user.email}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as SponsorInvitation[];
    },
  });
}

// Create a new invitation
export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      childId,
      inviteeEmail,
    }: {
      childId: string;
      inviteeEmail: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .insert({
          child_id: childId,
          inviter_user_id: user.id,
          invitee_email: inviteeEmail.toLowerCase(),
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

// Update invitation status (accept/decline)
export function useUpdateInvitationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invitationId,
      status,
    }: {
      invitationId: string;
      status: "accepted" | "declined";
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await (supabase as any)
        .from("sponsor_invitations")
        .update({
          status,
          invitee_user_id: user.id,
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
      toast.success(
        variables.status === "accepted"
          ? "Invitation accepted!"
          : "Invitation declined"
      );
    },
    onError: (error) => {
      toast.error("Failed to update invitation", {
        description: error.message,
      });
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
