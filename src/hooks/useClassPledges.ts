import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClassPledge {
  id: string;
  sponsor_user_id: string;
  class_name: string;
  teacher_id: string | null;
  event_id: string | null;
  pledge_type: "flat" | "milestone";
  amount: number;
  max_cap: number | null;
  milestone_minutes_target: number | null;
  is_unlocked: boolean;
  is_paid: boolean;
  payment_status: "pending" | "paid" | "cancelled";
  created_at: string;
}

// Fetch all class pledges for a specific class
export function useClassPledgesByClass(className: string | undefined) {
  return useQuery({
    queryKey: ["class-pledges", "by-class", className],
    queryFn: async (): Promise<ClassPledge[]> => {
      if (!className) return [];

      // Using type assertion since table is new and types not yet regenerated
      const { data, error } = await (supabase as any)
        .from("class_pledges")
        .select("*")
        .eq("class_name", className)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as ClassPledge[];
    },
    enabled: !!className,
  });
}

// Fetch class pledges made by the current user
export function useMyClassPledges() {
  return useQuery({
    queryKey: ["class-pledges", "mine"],
    queryFn: async (): Promise<ClassPledge[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await (supabase as any)
        .from("class_pledges")
        .select("*")
        .eq("sponsor_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as ClassPledge[];
    },
  });
}

// Create a new class pledge
export function useCreateClassPledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      className,
      teacherId,
      eventId,
      pledgeType,
      amount,
      maxCap,
      milestoneMinutesTarget,
    }: {
      className: string;
      teacherId?: string;
      eventId?: string;
      pledgeType: "flat" | "milestone";
      amount: number;
      maxCap?: number;
      milestoneMinutesTarget?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await (supabase as any)
        .from("class_pledges")
        .insert({
          sponsor_user_id: user.id,
          class_name: className,
          teacher_id: teacherId || null,
          event_id: eventId || null,
          pledge_type: pledgeType,
          amount,
          max_cap: maxCap || null,
          milestone_minutes_target: milestoneMinutesTarget || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-pledges"] });
      queryClient.invalidateQueries({ queryKey: ["class-fundraising"] });
      queryClient.invalidateQueries({ queryKey: ["class-milestone-status"] });
      toast.success("Class pledge created!");
    },
    onError: (error) => {
      toast.error("Failed to create pledge", {
        description: error.message,
      });
    },
  });
}

// Create multiple milestone pledges at once
export function useCreateMilestonePledges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      className,
      teacherId,
      eventId,
      milestones,
    }: {
      className: string;
      teacherId?: string;
      eventId?: string;
      milestones: Array<{ amount: number; minutesTarget: number }>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const pledges = milestones.map((m) => ({
        sponsor_user_id: user.id,
        class_name: className,
        teacher_id: teacherId || null,
        event_id: eventId || null,
        pledge_type: "milestone",
        amount: m.amount,
        milestone_minutes_target: m.minutesTarget,
      }));

      const { data, error } = await (supabase as any)
        .from("class_pledges")
        .insert(pledges)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-pledges"] });
      queryClient.invalidateQueries({ queryKey: ["class-fundraising"] });
      queryClient.invalidateQueries({ queryKey: ["class-milestone-status"] });
      toast.success("Milestone pledges created!");
    },
    onError: (error) => {
      toast.error("Failed to create pledges", {
        description: error.message,
      });
    },
  });
}

// Update a class pledge
export function useUpdateClassPledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      amount,
      maxCap,
      pledgeType,
      milestoneMinutesTarget,
    }: {
      id: string;
      amount?: number;
      maxCap?: number | null;
      pledgeType?: "flat" | "milestone";
      milestoneMinutesTarget?: number | null;
    }) => {
      const updates: Record<string, unknown> = {};
      if (amount !== undefined) updates.amount = amount;
      if (maxCap !== undefined) updates.max_cap = maxCap;
      if (pledgeType !== undefined) updates.pledge_type = pledgeType;
      if (milestoneMinutesTarget !== undefined) updates.milestone_minutes_target = milestoneMinutesTarget;

      const { data, error } = await (supabase as any)
        .from("class_pledges")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-pledges"] });
      queryClient.invalidateQueries({ queryKey: ["class-fundraising"] });
      queryClient.invalidateQueries({ queryKey: ["class-milestone-status"] });
      toast.success("Pledge updated!");
    },
    onError: (error) => {
      toast.error("Failed to update pledge", {
        description: error.message,
      });
    },
  });
}

// Delete a class pledge
export function useDeleteClassPledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("class_pledges")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-pledges"] });
      queryClient.invalidateQueries({ queryKey: ["class-fundraising"] });
      toast.success("Pledge deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete pledge", {
        description: error.message,
      });
    },
  });
}
