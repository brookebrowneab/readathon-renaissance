import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ParentPledge {
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

export interface PledgesByChild {
  childId: string;
  childName: string;
  pledges: ParentPledge[];
  totalAmount: number;
  sponsorCount: number;
}

export const useParentPledges = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["parent-pledges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First get the parent's children
      const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id, name")
        .eq("user_id", user.id);

      if (childrenError) throw childrenError;
      if (!children || children.length === 0) {
        return { pledges: [], pledgesByChild: [], totalPledges: 0, totalSponsors: 0 };
      }

      const childIds = children.map((c) => c.id);

      // Fetch all pledges for these children
      const { data: pledges, error: pledgesError } = await supabase
        .from("pledges")
        .select("*")
        .in("child_id", childIds)
        .order("created_at", { ascending: false });

      if (pledgesError) throw pledgesError;

      // Group pledges by child
      const pledgesByChild: PledgesByChild[] = children.map((child) => {
        const childPledges = (pledges || []).filter((p) => p.child_id === child.id);
        const uniqueSponsors = new Set(childPledges.map((p) => p.sponsor_id).filter(Boolean));
        
        return {
          childId: child.id,
          childName: child.name,
          pledges: childPledges as ParentPledge[],
          totalAmount: childPledges.reduce((sum, p) => {
            // For per-minute pledges, we'd need actual reading minutes
            // For now, just sum the base amounts
            return sum + p.amount;
          }, 0),
          sponsorCount: uniqueSponsors.size || childPledges.length, // fallback to pledge count if no sponsor_id
        };
      });

      const totalPledges = pledgesByChild.reduce((sum, c) => sum + c.totalAmount, 0);
      const totalSponsors = pledgesByChild.reduce((sum, c) => sum + c.sponsorCount, 0);

      return {
        pledges: (pledges || []) as ParentPledge[],
        pledgesByChild,
        totalPledges,
        totalSponsors,
      };
    },
  });

  return {
    pledges: data?.pledges || [],
    pledgesByChild: data?.pledgesByChild || [],
    totalPledges: data?.totalPledges || 0,
    totalSponsors: data?.totalSponsors || 0,
    isLoading,
    error,
    refetch,
  };
};
