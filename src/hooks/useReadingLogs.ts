import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ReadingLog {
  id: string;
  child_id: string | null;
  student_name: string;
  minutes: number;
  book_title: string | null;
  logged_at: string;
  created_at: string;
  event_id: string | null;
}

export interface ReadingLogInsert {
  child_id: string;
  student_name: string;
  minutes: number;
  book_title?: string | null;
  logged_at?: string;
  event_id?: string | null;
}

export interface ReadingLogUpdate {
  id: string;
  minutes?: number;
  book_title?: string | null;
  logged_at?: string;
}

export const useReadingLogs = (childId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ["reading-logs", childId],
    queryFn: async () => {
      if (!childId) return [];

      const { data, error } = await supabase
        .from("reading_logs")
        .select("*")
        .eq("child_id", childId)
        .order("logged_at", { ascending: false });

      if (error) throw error;
      return data as ReadingLog[];
    },
    enabled: !!childId,
  });

  const addLog = useMutation({
    mutationFn: async (log: ReadingLogInsert) => {
      const { data, error } = await supabase
        .from("reading_logs")
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      return data as ReadingLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-logs", childId] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Reading log added");
    },
    onError: (error) => {
      toast.error("Failed to add reading log: " + error.message);
    },
  });

  const updateLog = useMutation({
    mutationFn: async ({ id, ...updates }: ReadingLogUpdate) => {
      const { data, error } = await supabase
        .from("reading_logs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ReadingLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-logs", childId] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Reading log updated");
    },
    onError: (error) => {
      toast.error("Failed to update reading log: " + error.message);
    },
  });

  const deleteLog = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from("reading_logs")
        .delete()
        .eq("id", logId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-logs", childId] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Reading log deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete reading log: " + error.message);
    },
  });

  const totalMinutes = logs.reduce((sum, log) => sum + log.minutes, 0);

  return {
    logs,
    isLoading,
    error,
    totalMinutes,
    addLog,
    updateLog,
    deleteLog,
  };
};

// Hook to fetch all reading logs for all children of the current user
export const useAllChildrenReadingLogs = () => {
  return useQuery({
    queryKey: ["all-reading-logs"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First get all children IDs
      const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id")
        .eq("user_id", user.id);

      if (childrenError) throw childrenError;
      if (!children?.length) return {};

      const childIds = children.map((c) => c.id);

      // Get all logs for those children
      const { data: logs, error: logsError } = await supabase
        .from("reading_logs")
        .select("*")
        .in("child_id", childIds)
        .order("logged_at", { ascending: false });

      if (logsError) throw logsError;

      // Group by child_id
      const logsByChild: Record<string, ReadingLog[]> = {};
      for (const log of logs || []) {
        if (log.child_id) {
          if (!logsByChild[log.child_id]) {
            logsByChild[log.child_id] = [];
          }
          logsByChild[log.child_id].push(log as ReadingLog);
        }
      }

      return logsByChild;
    },
  });
};
