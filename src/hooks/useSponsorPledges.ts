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

export interface SponsorClassPledge {
  id: string;
  class_name: string;
  pledge_type: string;
  amount: number;
  is_paid: boolean;
  is_unlocked: boolean;
  payment_status: string;
  milestone_minutes_target: number | null;
  max_cap: number | null;
  event_id: string | null;
  teacher_id: string | null;
  sponsor_user_id: string;
  created_at: string;
  // Joined data
  teacher?: {
    id: string;
    name: string;
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
  classesSupported: number;
  yearsSponsoring: number;
}

export const useSponsorPledges = () => {
  const { sponsor, user, loading: authLoading } = useSponsorAuth();
  const queryClient = useQueryClient();

  // Fetch individual child pledges
  const {
    data: pledges = [],
    isLoading: pledgesLoading,
    error: pledgesError,
    refetch: refetchPledges,
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

  // Fetch class pledges
  const {
    data: classPledges = [],
    isLoading: classPledgesLoading,
    error: classPledgesError,
    refetch: refetchClassPledges,
  } = useQuery({
    queryKey: ["sponsor-class-pledges", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("class_pledges")
        .select(`
          *,
          teacher:teachers(id, name),
          event:events(id, name, start_date, end_date)
        `)
        .eq("sponsor_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SponsorClassPledge[];
    },
    enabled: !!user?.id,
  });

  // Calculate stats from both pledge types
  const stats: SponsorPledgeStats = {
    totalPledged: 0,
    totalPaid: 0,
    pendingAmount: 0,
    pledgeCount: 0,
    paidCount: 0,
    pendingCount: 0,
    childrenSupported: 0,
    classesSupported: 0,
    yearsSponsoring: 0,
  };

  // Process individual pledges
  pledges.forEach((pledge) => {
    const pledgeAmount =
      pledge.pledge_type === "per_minute" && pledge.child
        ? pledge.amount * pledge.child.total_minutes
        : pledge.amount;

    if (pledge.is_paid) {
      stats.totalPaid += pledgeAmount;
      stats.paidCount += 1;
    } else {
      stats.pendingAmount += pledgeAmount;
      stats.pendingCount += 1;
    }
    stats.totalPledged += pledgeAmount;
    stats.pledgeCount += 1;
  });

  // Process class pledges
  classPledges.forEach((pledge) => {
    // For class pledges, just use the amount (milestone pledges show their tier amount)
    const pledgeAmount = pledge.amount;

    if (pledge.is_paid) {
      stats.totalPaid += pledgeAmount;
      stats.paidCount += 1;
    } else {
      stats.pendingAmount += pledgeAmount;
      stats.pendingCount += 1;
    }
    stats.totalPledged += pledgeAmount;
    stats.pledgeCount += 1;
  });

  // Count unique children
  const uniqueChildren = new Set(pledges.map((p) => p.child_id).filter(Boolean));
  stats.childrenSupported = uniqueChildren.size;

  // Count unique classes
  const uniqueClasses = new Set(classPledges.map((p) => p.class_name));
  stats.classesSupported = uniqueClasses.size;

  // Count unique years from both pledge types
  const allDates = [
    ...pledges.map((p) => new Date(p.created_at).getFullYear()),
    ...classPledges.map((p) => new Date(p.created_at).getFullYear()),
  ];
  const uniqueYears = new Set(allDates);
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

  // Group class pledges by class
  const pledgesByClass = classPledges.reduce((acc, pledge) => {
    const className = pledge.class_name;

    if (!acc[className]) {
      acc[className] = {
        className,
        teacher: pledge.teacher,
        pledges: [],
        totalAmount: 0,
      };
    }

    acc[className].pledges.push(pledge);
    acc[className].totalAmount += pledge.amount;

    return acc;
  }, {} as Record<string, { className: string; teacher: SponsorClassPledge["teacher"]; pledges: SponsorClassPledge[]; totalAmount: number }>);

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

  const refetch = () => {
    refetchPledges();
    refetchClassPledges();
  };

  // Determine if returning sponsor (has any pledges)
  const hasAnyPledges = pledges.length > 0 || classPledges.length > 0;

  return {
    pledges,
    classPledges,
    pledgesByChild: Object.values(pledgesByChild),
    pledgesByClass: Object.values(pledgesByClass),
    stats,
    isLoading: authLoading || pledgesLoading || classPledgesLoading,
    error: pledgesError || classPledgesError,
    refetch,
    updatePledge,
    sponsor,
    hasAnyPledges,
  };
};
