import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "./useActiveEvent";
import { toast } from "sonner";

export interface GuestPledge {
  id: string;
  className: string;
  teacherName: string | null;
  gradeLevel: string | null;
  amount: number;
  pledgeType: string;
  isPaid: boolean;
  paymentStatus: string;
  paymentToken: string | null;
  payerName: string | null;
  payerEmail: string | null;
  payerPhone: string | null;
  createdAt: string;
}

export function useAdminGuestPledges() {
  const queryClient = useQueryClient();
  const { data: activeEvent } = useActiveEvent();

  const { data: guestPledges = [], isLoading, error } = useQuery({
    queryKey: ['admin-guest-pledges', activeEvent?.id],
    queryFn: async () => {
      // Fetch class pledges from guest users (nil UUID)
      const { data: pledges, error: pledgesError } = await supabase
        .from('class_pledges')
        .select(`
          id,
          class_name,
          amount,
          pledge_type,
          is_paid,
          payment_status,
          payment_token,
          created_at,
          teacher:teachers(name, grade_level)
        `)
        .eq('sponsor_user_id', '00000000-0000-0000-0000-000000000000')
        .eq('event_id', activeEvent?.id || '')
        .order('created_at', { ascending: false });

      if (pledgesError) throw pledgesError;

      // Fetch associated payment records to get payer info
      const pledgeIds = pledges?.map(p => p.id) || [];
      
      let paymentMap: Record<string, { payer_name: string; payer_email: string; notes: string }> = {};
      
      if (pledgeIds.length > 0) {
        const { data: payments } = await supabase
          .from('payments')
          .select('class_pledge_id, payer_name, payer_email, notes')
          .in('class_pledge_id', pledgeIds);

        if (payments) {
          paymentMap = payments.reduce((acc, p) => {
            if (p.class_pledge_id) {
              acc[p.class_pledge_id] = {
                payer_name: p.payer_name || '',
                payer_email: p.payer_email || '',
                notes: p.notes || '',
              };
            }
            return acc;
          }, {} as typeof paymentMap);
        }
      }

      // Transform the data
      const result: GuestPledge[] = pledges?.map(pledge => {
        const paymentInfo = paymentMap[pledge.id];
        // Extract phone from notes if present
        const phoneMatch = paymentInfo?.notes?.match(/Phone:\s*([^\n]+)/);
        
        return {
          id: pledge.id,
          className: pledge.class_name,
          teacherName: Array.isArray(pledge.teacher) 
            ? pledge.teacher[0]?.name 
            : pledge.teacher?.name || null,
          gradeLevel: Array.isArray(pledge.teacher) 
            ? pledge.teacher[0]?.grade_level 
            : pledge.teacher?.grade_level || null,
          amount: Number(pledge.amount),
          pledgeType: pledge.pledge_type,
          isPaid: pledge.is_paid,
          paymentStatus: pledge.payment_status,
          paymentToken: pledge.payment_token,
          payerName: paymentInfo?.payer_name || null,
          payerEmail: paymentInfo?.payer_email || null,
          payerPhone: phoneMatch?.[1]?.trim() || null,
          createdAt: pledge.created_at,
        };
      }) || [];

      return result;
    },
    enabled: !!activeEvent?.id,
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (pledgeId: string) => {
      const { error } = await supabase
        .from('class_pledges')
        .update({ 
          is_paid: true, 
          payment_status: 'paid' 
        })
        .eq('id', pledgeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-guest-pledges'] });
      queryClient.invalidateQueries({ queryKey: ['class-fundraising'] });
      toast.success("Guest pledge marked as paid");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const markAsUnpaidMutation = useMutation({
    mutationFn: async (pledgeId: string) => {
      const { error } = await supabase
        .from('class_pledges')
        .update({ 
          is_paid: false, 
          payment_status: 'pending' 
        })
        .eq('id', pledgeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-guest-pledges'] });
      queryClient.invalidateQueries({ queryKey: ['class-fundraising'] });
      toast.success("Guest pledge status updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  // Calculate summary
  const summary = {
    total: guestPledges.length,
    totalAmount: guestPledges.reduce((sum, p) => sum + p.amount, 0),
    paid: guestPledges.filter(p => p.isPaid).length,
    paidAmount: guestPledges.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0),
    pending: guestPledges.filter(p => !p.isPaid).length,
    pendingAmount: guestPledges.filter(p => !p.isPaid).reduce((sum, p) => sum + p.amount, 0),
  };

  return {
    guestPledges,
    summary,
    isLoading,
    error,
    markAsPaid: markAsPaidMutation.mutateAsync,
    markAsUnpaid: markAsUnpaidMutation.mutateAsync,
    isUpdating: markAsPaidMutation.isPending || markAsUnpaidMutation.isPending,
  };
}
