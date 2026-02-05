import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VerificationThresholds {
  default?: number;
  [grade: string]: number | undefined;
}

// Fetch verification settings from active event
export const useVerificationSettings = () => {
  return useQuery({
    queryKey: ['verification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, log_verification_enabled, log_verification_thresholds')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      
      const rawThresholds = data?.log_verification_thresholds;
      const thresholds: VerificationThresholds = typeof rawThresholds === 'string'
        ? JSON.parse(rawThresholds || '{}')
        : (rawThresholds as VerificationThresholds || {});
      return {
        eventId: data?.id || null,
        enabled: data?.log_verification_enabled ?? false,
        thresholds,
      };
    },
  });
};

// Update verification settings
export const useUpdateVerificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      enabled,
      thresholds,
    }: {
      eventId: string;
      enabled: boolean;
      thresholds: VerificationThresholds;
    }) => {
      const { data, error } = await supabase
        .from('events')
        .update({
          log_verification_enabled: enabled,
          log_verification_thresholds: JSON.stringify(thresholds),
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verification-settings'] });
      queryClient.invalidateQueries({ queryKey: ['event-settings'] });
      queryClient.invalidateQueries({ queryKey: ['active-event'] });
      toast.success("Verification settings saved!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });
};

// Helper to get threshold for a specific grade
export const getThresholdForGrade = (
  thresholds: VerificationThresholds,
  grade: string | null | undefined
): number | null => {
  if (!grade) {
    return thresholds.default ?? null;
  }
  
  if (thresholds[grade] !== undefined) {
    return thresholds[grade] as number;
  }
  
  return thresholds.default ?? null;
};
