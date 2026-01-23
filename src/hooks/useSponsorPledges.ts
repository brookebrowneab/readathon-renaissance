import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSponsorAuth } from "./useSponsorAuth";

export interface SponsorPledge {
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
  // Joined data
  child?: {
    id: string;
    name: string;
    total_minutes: number;
    goal_minutes: number;
    grade_info: string | null;
  } | null;
  event?: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  } | null;
}

export interface SponsorPledgeStats {
  totalPledged: number;
  totalPaid: number;
  pendingAmount: number;
  pledgeCount: number;
  paidCount: number;
  pendingCount: number;
  childrenSupported: number;
  yearsSponsoring: number;
}

export const useSponsorPledges = () => {
  const { sponsor, loading: authLoading } = useSponsorAuth();
  const queryClient = useQueryClient();

  const {
    data: pledges = [],
    isLoading: pledgesLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sponsor-pledges", sponsor?.id],
    queryFn: async () => {
      if (!sponsor?.id) return [];

      const { data, error } = await supabase
        .from("pledges")
        .select(`
          *,
          child:children(id, name, total_minutes, goal_minutes, grade_info),
          event:events(id, name, start_date, end_date)
        `)
        .eq("sponsor_id", sponsor.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SponsorPledge[];
    },
    enabled: !!sponsor?.id,
  });

  // Calculate stats
  const stats: SponsorPledgeStats = pledges.reduce(
    (acc, pledge) => {
      const pledgeAmount =
        pledge.pledge_type === "per_minute" && pledge.child
          ? pledge.amount * pledge.child.total_minutes
          : pledge.amount;

      if (pledge.is_paid) {
        acc.totalPaid += pledgeAmount;
        acc.paidCount += 1;
      } else {
        acc.pendingAmount += pledgeAmount;
        acc.pendingCount += 1;
      }
      acc.totalPledged += pledgeAmount;
      acc.pledgeCount += 1;

      return acc;
    },
    {
      totalPledged: 0,
      totalPaid: 0,
      pendingAmount: 0,
      pledgeCount: 0,
      paidCount: 0,
      pendingCount: 0,
      childrenSupported: 0,
      yearsSponsoring: 0,
    }
  );

  // Count unique children
  const uniqueChildren = new Set(pledges.map((p) => p.child_id).filter(Boolean));
  stats.childrenSupported = uniqueChildren.size;

  // Count unique years
  const uniqueYears = new Set(
    pledges.map((p) => new Date(p.created_at).getFullYear())
  );
  stats.yearsSponsoring = uniqueYears.size;

  // Group pledges by child
  const pledgesByChild = pledges.reduce((acc, pledge) => {
    const childId = pledge.child_id || "unknown";
    const childName = pledge.child?.name || pledge.student_name;

    if (!acc[childId]) {
      acc[childId] = {
        childId,
        childName,
        child: pledge.child,
        pledges: [],
        totalAmount: 0,
      };
    }

    const pledgeAmount =
      pledge.pledge_type === "per_minute" && pledge.child
        ? pledge.amount * pledge.child.total_minutes
        : pledge.amount;

    acc[childId].pledges.push(pledge);
    acc[childId].totalAmount += pledgeAmount;

    return acc;
  }, {} as Record<string, { childId: string; childName: string; child: SponsorPledge["child"]; pledges: SponsorPledge[]; totalAmount: number }>);

  // Update pledge payment status
  const updatePledge = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<{ is_paid: boolean; payment_status: string }>) => {
      const { data, error } = await supabase
        .from("pledges")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-pledges"] });
      toast.success("Pledge updated");
    },
    onError: (error) => {
      toast.error("Failed to update pledge: " + error.message);
    },
  });

  return {
    pledges,
    pledgesByChild: Object.values(pledgesByChild),
    stats,
    isLoading: authLoading || pledgesLoading,
    error,
    refetch,
    updatePledge,
    sponsor,
  };
};
