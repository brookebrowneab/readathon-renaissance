import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "./useActiveEvent";
import { differenceInDays, parseISO, format } from "date-fns";
import { toast } from "sonner";
import { sendPaymentReminders } from "@/lib/notifications";

export type PaymentStatus = "completed" | "pending" | "failed" | "refunded";
export type PaymentMethod = "card" | "cash" | "check" | "online";

export interface Payment {
  id: string;
  date: string;
  payerName: string;
  payerEmail: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  pledgeId: string;
  studentName: string;
  pledgeType: string;
  childMinutes: number;
}

export interface OutstandingPledge {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  studentName: string;
  amount: number;
  pledgeDate: string;
  daysSincePledge: number;
  pledgeType: string;
  childMinutes: number;
  childId: string;
  isLarge?: boolean;
}

export interface AllPledge {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  studentName: string;
  amount: number;
  pledgeType: string;
  childMinutes: number;
  childId: string;
  isPaid: boolean;
  createdAt: string;
  isLarge: boolean;
}

export const LARGE_PLEDGE_THRESHOLD = 1500;

export interface FinanceSummary {
  totalPledged: number;
  totalCollected: number;
  outstanding: number;
  collectionRate: number;
  largePledgeCount: number;
}

function mapPaymentMethod(method: string | null): PaymentMethod {
  switch (method) {
    case 'check': return 'check';
    case 'card': return 'card';
    case 'cash': return 'cash';
    default: return 'online';
  }
}

function mapPaymentStatus(isPaid: boolean, status: string): PaymentStatus {
  if (isPaid) return 'completed';
  if (status === 'failed') return 'failed';
  if (status === 'refunded') return 'refunded';
  return 'pending';
}

export function useAdminFinance() {
  const queryClient = useQueryClient();
  const { data: activeEvent } = useActiveEvent();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-finance', activeEvent?.id],
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
          sponsor:sponsors(id, name, email),
          child:children(id, name, total_minutes)
        `)
        .eq('event_id', activeEvent?.id || '');

      if (error) throw error;

      const payments: Payment[] = [];
      const outstandingPledges: OutstandingPledge[] = [];
      const allPledges: AllPledge[] = [];
      let totalPledged = 0;
      let totalCollected = 0;
      let largePledgeCount = 0;

      pledges?.forEach(pledge => {
        const childMinutes = pledge.child?.total_minutes || 0;
        let pledgeAmount = 0;

        if (pledge.pledge_type === 'per_minute') {
          pledgeAmount = Number(pledge.amount) * childMinutes;
        } else {
          pledgeAmount = Number(pledge.amount);
        }

        totalPledged += pledgeAmount;
        const isLarge = pledgeAmount > LARGE_PLEDGE_THRESHOLD;
        if (isLarge) largePledgeCount++;

        const paymentRecord: Payment = {
          id: pledge.id,
          date: pledge.created_at,
          payerName: pledge.sponsor?.name || 'Unknown',
          payerEmail: pledge.sponsor?.email || '',
          amount: pledgeAmount,
          status: mapPaymentStatus(pledge.is_paid, pledge.payment_status),
          method: mapPaymentMethod(pledge.expected_payment_method),
          pledgeId: pledge.id,
          studentName: pledge.child?.name || 'Unknown',
          pledgeType: pledge.pledge_type,
          childMinutes,
        };

        payments.push(paymentRecord);

        // Build allPledges array
        allPledges.push({
          id: pledge.id,
          sponsorName: pledge.sponsor?.name || 'Unknown',
          sponsorEmail: pledge.sponsor?.email || '',
          studentName: pledge.child?.name || 'Unknown',
          amount: pledgeAmount,
          pledgeType: pledge.pledge_type,
          childMinutes,
          childId: pledge.child_id || '',
          isPaid: pledge.is_paid,
          createdAt: pledge.created_at,
          isLarge,
        });

        if (pledge.is_paid) {
          totalCollected += pledgeAmount;
        } else {
          const createdAt = parseISO(pledge.created_at);
          const daysSincePledge = differenceInDays(new Date(), createdAt);
          
          outstandingPledges.push({
            id: pledge.id,
            sponsorName: pledge.sponsor?.name || 'Unknown',
            sponsorEmail: pledge.sponsor?.email || '',
            studentName: pledge.child?.name || 'Unknown',
            amount: pledgeAmount,
            pledgeDate: format(createdAt, 'yyyy-MM-dd'),
            daysSincePledge,
            pledgeType: pledge.pledge_type,
            childMinutes,
            childId: pledge.child_id || '',
            isLarge,
          });
        }
      });

      // Sort payments by date (newest first)
      payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Sort outstanding by days (oldest first - most urgent)
      outstandingPledges.sort((a, b) => b.daysSincePledge - a.daysSincePledge);

      // Sort allPledges by date (newest first)
      allPledges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const summary: FinanceSummary = {
        totalPledged,
        totalCollected,
        outstanding: totalPledged - totalCollected,
        collectionRate: totalPledged > 0 ? Math.round((totalCollected / totalPledged) * 100) : 0,
        largePledgeCount,
      };

      return {
        payments,
        outstandingPledges,
        allPledges,
        summary,
      };
    },
    enabled: !!activeEvent?.id,
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (pledgeId: string) => {
      const { error } = await supabase
        .from('pledges')
        .update({ 
          is_paid: true, 
          payment_status: 'paid' 
        })
        .eq('id', pledgeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-finance'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-pledges'] });
      toast.success("Payment marked as complete");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payment: ${error.message}`);
    },
  });

  const markAsUnpaidMutation = useMutation({
    mutationFn: async (pledgeId: string) => {
      const { error } = await supabase
        .from('pledges')
        .update({ 
          is_paid: false, 
          payment_status: 'pending' 
        })
        .eq('id', pledgeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-finance'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-pledges'] });
      toast.success("Payment status updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payment: ${error.message}`);
    },
  });

  const bulkMarkAsPaidMutation = useMutation({
    mutationFn: async (pledgeIds: string[]) => {
      const { error } = await supabase
        .from('pledges')
        .update({ 
          is_paid: true, 
          payment_status: 'paid' 
        })
        .in('id', pledgeIds);

      if (error) throw error;
    },
    onSuccess: (_, pledgeIds) => {
      queryClient.invalidateQueries({ queryKey: ['admin-finance'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-pledges'] });
      toast.success(`${pledgeIds.length} payment(s) marked as complete`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payments: ${error.message}`);
    },
  });

  const sendReminderMutation = useMutation({
    mutationFn: async (pledgeIds: string[]) => {
      const pledgesToRemind = data?.outstandingPledges.filter(p => pledgeIds.includes(p.id)) || [];
      
      if (pledgesToRemind.length === 0) {
        throw new Error("No valid pledges to send reminders for");
      }

      const reminderData = pledgesToRemind.map(pledge => ({
        pledgeId: pledge.id,
        recipientEmail: pledge.sponsorEmail,
        recipientName: pledge.sponsorName,
        studentName: pledge.studentName,
        amount: pledge.pledgeType === 'per_minute' 
          ? pledge.amount / (pledge.childMinutes || 1) // Get back the per-minute rate
          : pledge.amount,
        pledgeType: pledge.pledgeType as "flat" | "per_minute",
        totalMinutes: pledge.childMinutes,
        daysSincePledge: pledge.daysSincePledge,
      }));

      const result = await sendPaymentReminders(reminderData);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to send reminders");
      }

      return result.summary;
    },
    onSuccess: (summary) => {
      if (summary) {
        if (summary.failed === 0) {
          toast.success(`${summary.sent} reminder(s) sent successfully`);
        } else {
          toast.warning(`${summary.sent} sent, ${summary.failed} failed`);
        }
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reminders: ${error.message}`);
    },
  });

  return {
    payments: data?.payments || [],
    outstandingPledges: data?.outstandingPledges || [],
    allPledges: data?.allPledges || [],
    summary: data?.summary || { totalPledged: 0, totalCollected: 0, outstanding: 0, collectionRate: 0, largePledgeCount: 0 },
    isLoading,
    error,
    markAsPaid: markAsPaidMutation.mutateAsync,
    markAsUnpaid: markAsUnpaidMutation.mutateAsync,
    bulkMarkAsPaid: bulkMarkAsPaidMutation.mutateAsync,
    sendReminders: sendReminderMutation.mutateAsync,
    isUpdating: markAsPaidMutation.isPending || markAsUnpaidMutation.isPending || bulkMarkAsPaidMutation.isPending,
    isSendingReminders: sendReminderMutation.isPending,
  };
}
