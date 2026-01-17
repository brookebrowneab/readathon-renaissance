import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type EmailLog = Tables<"email_logs">;
export type EmailLogInsert = TablesInsert<"email_logs">;

export function useEmailLogs(templateId?: string) {
  return useQuery({
    queryKey: ["email-logs", templateId],
    queryFn: async () => {
      let query = supabase
        .from("email_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (templateId) {
        query = query.eq("template_id", templateId);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateEmailLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: EmailLogInsert) => {
      const { data, error } = await supabase
        .from("email_logs")
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-logs"] });
    },
  });
}

export function useLogEmails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logs: EmailLogInsert[]) => {
      const { data, error } = await supabase
        .from("email_logs")
        .insert(logs)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-logs"] });
    },
  });
}
