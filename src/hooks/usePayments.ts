import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveEvent } from "./useActiveEvent";
import { toast } from "sonner";

export interface Payment {
  id: string;
  pledge_id: string | null;
  class_pledge_id: string | null;
  amount: number;
  square_payment_id: string | null;
  square_receipt_url: string | null;
  payment_method: string;
  pledge_type: string;
  payer_user_id: string | null;
  payer_name: string | null;
  payer_email: string | null;
  student_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentInput {
  pledge_id?: string;
  class_pledge_id?: string;
  amount: number;
  square_payment_id?: string;
  square_receipt_url?: string;
  payment_method: string;
  pledge_type: string;
  payer_user_id?: string;
  payer_name?: string;
  payer_email?: string;
  student_name?: string;
  notes?: string;
}

export function usePayments() {
  const queryClient = useQueryClient();
  const { data: activeEvent } = useActiveEvent();

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (input: CreatePaymentInput) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-finance'] });
      toast.success("Payment recorded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to record payment: ${error.message}`);
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Payment> & { id: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-finance'] });
      toast.success("Payment updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payment: ${error.message}`);
    },
  });

  return {
    payments,
    isLoading,
    error,
    createPayment: createPaymentMutation.mutateAsync,
    updatePayment: updatePaymentMutation.mutateAsync,
    isCreating: createPaymentMutation.isPending,
    isUpdating: updatePaymentMutation.isPending,
  };
}

// Hook for fetching payments for a specific user (their pledges)
export function useUserPayments() {
  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['user-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
  });

  return { payments, isLoading, error };
}

// Hook for fetching payments for a specific pledge
export function usePledgePayments(pledgeId: string | undefined) {
  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['pledge-payments', pledgeId],
    queryFn: async () => {
      if (!pledgeId) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('pledge_id', pledgeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!pledgeId,
  });

  return { payments, isLoading, error };
}
