import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "./useActiveEvent";
import { differenceInDays, parseISO, subDays, startOfDay, format } from "date-fns";

export interface DashboardMetrics {
  studentsEnrolled: number;
  studentsChange: string;
  totalMinutes: number;
  minutesChange: string;
  totalPledged: number;
  pledgedChange: string;
  totalCollected: number;
  collectionPercent: string;
}

export interface DashboardAlert {
  id: string;
  type: "checks" | "collection" | "review" | "large_pledge" | "large_reading";
  count: number;
  label: string;
  link: string;
}

export interface ActivityItem {
  id: string;
  type: "pledge" | "payment" | "enrollment";
  message: string;
  time: string;
  created_at: string;
}

export interface OutstandingPayment {
  id: string;
  sponsorName: string;
  studentName: string;
  amount: number;
  daysOutstanding: number;
  pledgeType: string;
  totalMinutes: number;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export function useAdminDashboard() {
  const { data: activeEvent, isLoading: eventLoading } = useActiveEvent();

  // Fetch all children count
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ['admin-dashboard-children'],
    queryFn: async () => {
      const { data: allChildren, error: allError } = await supabase
        .from('children')
        .select('id, created_at, total_minutes');

      if (allError) throw allError;

      // Count children added in last 7 days
      const weekAgo = subDays(new Date(), 7);
      const recentChildren = allChildren?.filter(c => 
        new Date(c.created_at) > weekAgo
      ) || [];

      const totalMinutes = allChildren?.reduce((sum, c) => sum + (c.total_minutes || 0), 0) || 0;

      return {
        total: allChildren?.length || 0,
        recentCount: recentChildren.length,
        totalMinutes,
      };
    },
  });

  // Fetch reading logs for today's minutes
  const { data: readingData, isLoading: readingLoading } = useQuery({
    queryKey: ['admin-dashboard-reading'],
    queryFn: async () => {
      const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
      
      const { data: todayLogs, error } = await supabase
        .from('reading_logs')
        .select('minutes')
        .gte('logged_at', today);

      if (error) throw error;

      const todayMinutes = todayLogs?.reduce((sum, log) => sum + log.minutes, 0) || 0;

      return {
        todayMinutes,
      };
    },
  });

  // Fetch pledges data
  const { data: pledgesData, isLoading: pledgesLoading } = useQuery({
    queryKey: ['admin-dashboard-pledges', activeEvent?.id],
    queryFn: async () => {
      const { data: pledges, error } = await supabase
        .from('pledges')
        .select(`
          id,
          amount,
          pledge_type,
          is_paid,
          payment_status,
          expected_payment_method,
          created_at,
          child_id,
          sponsor:sponsors(name),
          child:children(name, total_minutes)
        `)
        .eq('event_id', activeEvent?.id || '');

      if (error) throw error;

      let totalPledged = 0;
      let totalCollected = 0;
      let todayPledged = 0;
      const today = startOfDay(new Date());
      const outstanding: OutstandingPayment[] = [];
      let pendingChecks = 0;
      let largePledges = 0; // Over $1500

      pledges?.forEach(pledge => {
        const childMinutes = pledge.child?.total_minutes || 0;
        let pledgeAmount = 0;

        if (pledge.pledge_type === 'per_minute') {
          pledgeAmount = Number(pledge.amount) * childMinutes;
        } else {
          pledgeAmount = Number(pledge.amount);
        }

        totalPledged += pledgeAmount;

        if (pledge.is_paid) {
          totalCollected += pledgeAmount;
        } else {
          // Track outstanding
          const createdAt = new Date(pledge.created_at);
          const daysOutstanding = differenceInDays(new Date(), createdAt);
          
          outstanding.push({
            id: pledge.id,
            sponsorName: pledge.sponsor?.name || 'Unknown',
            studentName: pledge.child?.name || 'Unknown',
            amount: pledgeAmount,
            daysOutstanding,
            pledgeType: pledge.pledge_type,
            totalMinutes: childMinutes,
          });

          // Track pending checks
          if (pledge.expected_payment_method === 'check') {
            pendingChecks++;
          }
        }

        // Track unusually large pledges (over $1500) - regardless of payment status
        if (pledgeAmount > 1500) {
          largePledges++;
        }

        // Check if created today
        if (new Date(pledge.created_at) >= today) {
          todayPledged += pledgeAmount;
        }
      });

      // Sort outstanding by days (oldest first)
      outstanding.sort((a, b) => b.daysOutstanding - a.daysOutstanding);

      return {
        totalPledged,
        totalCollected,
        todayPledged,
        outstanding,
        pendingChecks,
        largePledges,
        awaitingCollection: outstanding.length,
      };
    },
    enabled: !!activeEvent?.id,
  });

  // Fetch unusually large reading logs (over 480 minutes / 8 hours in a day)
  const { data: largeLogsData, isLoading: largeLogsLoading } = useQuery({
    queryKey: ['admin-dashboard-large-logs'],
    queryFn: async () => {
      const { data: logs, error } = await supabase
        .from('reading_logs')
        .select('id, minutes')
        .gt('minutes', 480);

      if (error) throw error;
      return logs?.length || 0;
    },
  });

  // Fetch recent activity
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-dashboard-activity', activeEvent?.id],
    queryFn: async () => {
      const activities: ActivityItem[] = [];

      // Get recent pledges
      const { data: recentPledges } = await supabase
        .from('pledges')
        .select(`
          id,
          amount,
          pledge_type,
          created_at,
          sponsor:sponsors(name),
          child:children(name)
        `)
        .eq('event_id', activeEvent?.id || '')
        .order('created_at', { ascending: false })
        .limit(10);

      recentPledges?.forEach(pledge => {
        const amountStr = pledge.pledge_type === 'per_minute' 
          ? `$${pledge.amount}/min` 
          : `$${pledge.amount}`;
        activities.push({
          id: `pledge-${pledge.id}`,
          type: 'pledge',
          message: `New pledge: ${amountStr} from ${pledge.sponsor?.name || 'Unknown'} for ${pledge.child?.name || 'Unknown'}`,
          time: getRelativeTime(new Date(pledge.created_at)),
          created_at: pledge.created_at,
        });
      });

      // Get recent paid pledges (as payments)
      const { data: recentPayments } = await supabase
        .from('pledges')
        .select(`
          id,
          amount,
          pledge_type,
          created_at,
          sponsor:sponsors(name),
          child:children(name, total_minutes)
        `)
        .eq('event_id', activeEvent?.id || '')
        .eq('is_paid', true)
        .order('created_at', { ascending: false })
        .limit(10);

      recentPayments?.forEach(pledge => {
        const childMinutes = pledge.child?.total_minutes || 0;
        const amount = pledge.pledge_type === 'per_minute' 
          ? Number(pledge.amount) * childMinutes 
          : Number(pledge.amount);
        activities.push({
          id: `payment-${pledge.id}`,
          type: 'payment',
          message: `Payment: $${amount.toFixed(2)} from ${pledge.sponsor?.name || 'Unknown'}`,
          time: getRelativeTime(new Date(pledge.created_at)),
          created_at: pledge.created_at,
        });
      });

      // Get recent enrollments
      const { data: recentChildren } = await supabase
        .from('children')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      recentChildren?.forEach(child => {
        activities.push({
          id: `enrollment-${child.id}`,
          type: 'enrollment',
          message: `New student enrolled: ${child.name}`,
          time: getRelativeTime(new Date(child.created_at)),
          created_at: child.created_at,
        });
      });

      // Sort all activities by created_at
      activities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return activities.slice(0, 10);
    },
    enabled: !!activeEvent?.id,
  });

  // Calculate metrics
  const metrics: DashboardMetrics = {
    studentsEnrolled: childrenData?.total || 0,
    studentsChange: childrenData?.recentCount ? `+${childrenData.recentCount} this week` : 'No change',
    totalMinutes: childrenData?.totalMinutes || 0,
    minutesChange: readingData?.todayMinutes ? `+${readingData.todayMinutes.toLocaleString()} today` : 'No logs today',
    totalPledged: pledgesData?.totalPledged || 0,
    pledgedChange: pledgesData?.todayPledged ? `+$${pledgesData.todayPledged.toFixed(0)} today` : 'No pledges today',
    totalCollected: pledgesData?.totalCollected || 0,
    collectionPercent: pledgesData?.totalPledged 
      ? `${Math.round((pledgesData.totalCollected / pledgesData.totalPledged) * 100)}% collected`
      : '0% collected',
  };

  // Build alerts
  const alerts: DashboardAlert[] = [];
  
  if (pledgesData?.pendingChecks && pledgesData.pendingChecks > 0) {
    alerts.push({
      id: 'checks',
      type: 'checks',
      count: pledgesData.pendingChecks,
      label: 'pending check payments',
      link: '/admin/checks',
    });
  }

  if (pledgesData?.awaitingCollection && pledgesData.awaitingCollection > 0) {
    alerts.push({
      id: 'collection',
      type: 'collection',
      count: pledgesData.awaitingCollection,
      label: 'pledges awaiting collection',
      link: '/admin/outstanding',
    });
  }

  if (pledgesData?.largePledges && pledgesData.largePledges > 0) {
    alerts.push({
      id: 'large_pledge',
      type: 'large_pledge',
      count: pledgesData.largePledges,
      label: 'unusually large pledges (>$1,500)',
      link: '/admin/outstanding?filter=large',
    });
  }

  if (largeLogsData && largeLogsData > 0) {
    alerts.push({
      id: 'large_reading',
      type: 'large_reading',
      count: largeLogsData,
      label: 'reading logs over 8 hours',
      link: '/admin/reading?filter=large',
    });
  }

  // Calculate days remaining
  const daysRemaining = activeEvent?.end_date 
    ? Math.max(0, differenceInDays(parseISO(activeEvent.end_date), new Date()))
    : 0;

  return {
    event: activeEvent,
    metrics,
    alerts,
    activity: activityData || [],
    outstanding: pledgesData?.outstanding || [],
    daysRemaining,
    isLoading: eventLoading || childrenLoading || readingLoading || pledgesLoading || activityLoading || largeLogsLoading,
  };
}
