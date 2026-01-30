import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

export interface EventSettings {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  last_log_date: string;
  is_active: boolean;
  school_name: string;
  payment_address: string;
  accept_checks: boolean;
  accept_cards: boolean;
  send_reminders: boolean;
  reminder_days: number;
  goal_minutes: number;
  class_milestone_goal: number;
  class_milestone_reward: string;
  class_milestone_enabled: boolean;
  teacher_logging_grades: string[];
  created_at: string;
  updated_at: string;
}

export interface UpdateEventParams {
  id: string;
  name?: string;
  start_date?: Date;
  end_date?: Date;
  last_log_date?: Date;
  is_active?: boolean;
  school_name?: string;
  payment_address?: string;
  accept_checks?: boolean;
  accept_cards?: boolean;
  send_reminders?: boolean;
  reminder_days?: number;
  goal_minutes?: number;
  class_milestone_goal?: number;
  class_milestone_reward?: string;
  class_milestone_enabled?: boolean;
  teacher_logging_grades?: string[];
}

export function useEventSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['event-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as EventSettings | null;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (params: UpdateEventParams) => {
      const { id, ...updates } = params;
      
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.start_date !== undefined) updateData.start_date = format(updates.start_date, 'yyyy-MM-dd');
      if (updates.end_date !== undefined) updateData.end_date = format(updates.end_date, 'yyyy-MM-dd');
      if (updates.last_log_date !== undefined) updateData.last_log_date = format(updates.last_log_date, 'yyyy-MM-dd');
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.school_name !== undefined) updateData.school_name = updates.school_name;
      if (updates.payment_address !== undefined) updateData.payment_address = updates.payment_address;
      if (updates.accept_checks !== undefined) updateData.accept_checks = updates.accept_checks;
      if (updates.accept_cards !== undefined) updateData.accept_cards = updates.accept_cards;
      if (updates.send_reminders !== undefined) updateData.send_reminders = updates.send_reminders;
      if (updates.reminder_days !== undefined) updateData.reminder_days = updates.reminder_days;
      if (updates.goal_minutes !== undefined) updateData.goal_minutes = updates.goal_minutes;
      if (updates.class_milestone_goal !== undefined) updateData.class_milestone_goal = updates.class_milestone_goal;
      if (updates.class_milestone_reward !== undefined) updateData.class_milestone_reward = updates.class_milestone_reward;
      if (updates.class_milestone_enabled !== undefined) updateData.class_milestone_enabled = updates.class_milestone_enabled;
      if (updates.teacher_logging_grades !== undefined) updateData.teacher_logging_grades = updates.teacher_logging_grades;

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-settings'] });
      queryClient.invalidateQueries({ queryKey: ['active-event'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (params: Omit<UpdateEventParams, 'id'> & { name: string; start_date: Date; end_date: Date; last_log_date: Date }) => {
      // Deactivate existing events first
      await supabase
        .from('events')
        .update({ is_active: false })
        .eq('is_active', true);

      const { data, error } = await supabase
        .from('events')
        .insert({
          name: params.name,
          start_date: format(params.start_date, 'yyyy-MM-dd'),
          end_date: format(params.end_date, 'yyyy-MM-dd'),
          last_log_date: format(params.last_log_date, 'yyyy-MM-dd'),
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-settings'] });
      queryClient.invalidateQueries({ queryKey: ['active-event'] });
      toast.success("New event created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create event: ${error.message}`);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .update({ is_active: false })
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-settings'] });
      queryClient.invalidateQueries({ queryKey: ['active-event'] });
      toast.success("Event has been ended.");
    },
    onError: (error: Error) => {
      toast.error(`Failed to end event: ${error.message}`);
    },
  });

  return {
    event: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateEvent: updateMutation.mutateAsync,
    createEvent: createMutation.mutateAsync,
    endEvent: deactivateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    isEnding: deactivateMutation.isPending,
  };
}
