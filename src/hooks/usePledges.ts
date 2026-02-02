import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { sendSponsorThankYou } from "@/lib/notifications";

export interface Pledge {
  id: string;
  child_id: string | null;
  event_id: string | null;
  sponsor_id: string | null;
  student_name: string;
  pledge_type: string;
  amount: number;
  is_paid: boolean;
  payment_status: string;
  expected_payment_method: string | null;
  created_at: string;
}

export interface PledgeInsert {
  child_id: string;
  student_name: string;
  pledge_type: "flat" | "per_minute";
  amount: number;
  event_id?: string | null;
  sponsor_id?: string | null;
  expected_payment_method?: string | null;
  // For sending thank you email
  sponsorEmail?: string;
  sponsorName?: string;
}

export const usePledges = (childId?: string) => {
  const queryClient = useQueryClient();

  const { data: pledges = [], isLoading, error } = useQuery({
    queryKey: ["pledges", childId],
    queryFn: async () => {
      let query = supabase.from("pledges").select("*");
      
      if (childId) {
        query = query.eq("child_id", childId);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Pledge[];
    },
    enabled: childId !== undefined,
  });

  const addPledge = useMutation({
    mutationFn: async ({ sponsorEmail, sponsorName, ...pledge }: PledgeInsert) => {
      const { data, error } = await supabase
        .from("pledges")
        .insert(pledge)
        .select()
        .single();

      if (error) throw error;

      // Send thank you email if we have sponsor info
      if (sponsorEmail && sponsorName) {
        sendSponsorThankYou({
          sponsorEmail,
          sponsorName,
          studentName: pledge.student_name,
          pledgeType: pledge.pledge_type,
          amount: pledge.amount,
          isClassPledge: false,
        }).catch(err => console.error("Failed to send thank you email:", err));
      }

      return data as Pledge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pledges"] });
      toast.success("Pledge created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create pledge: " + error.message);
    },
  });

  const updatePledge = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pledge> & { id: string }) => {
      const { data, error } = await supabase
        .from("pledges")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Pledge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pledges"] });
      toast.success("Pledge updated");
    },
    onError: (error) => {
      toast.error("Failed to update pledge: " + error.message);
    },
  });

  const deletePledge = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pledges")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pledges"] });
      toast.success("Pledge deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete pledge: " + error.message);
    },
  });

  return {
    pledges,
    isLoading,
    error,
    addPledge,
    updatePledge,
    deletePledge,
  };
};
