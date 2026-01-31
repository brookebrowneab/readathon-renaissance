import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LogVerificationRequest {
  id: string;
  reading_log_id: string;
  child_id: string;
  minutes: number;
  threshold_at_time: number;
  status: 'pending' | 'approved' | 'dismissed';
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface LogVerificationWithDetails extends LogVerificationRequest {
  reading_log: {
    book_title: string | null;
    logged_at: string;
  } | null;
  child: {
    name: string;
  } | null;
}

// Fetch pending verification requests for a specific child
export const useChildVerificationRequests = (childId: string | undefined) => {
  return useQuery({
    queryKey: ['log-verification-requests', childId],
    queryFn: async () => {
      if (!childId) return [];
      
      const { data, error } = await supabase
        .from('log_verification_requests')
        .select(`
          *,
          reading_log:reading_logs(book_title, logged_at)
        `)
        .eq('child_id', childId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (LogVerificationRequest & { reading_log: { book_title: string | null; logged_at: string } | null })[];
    },
    enabled: !!childId,
  });
};

// Fetch all pending verification requests for the current user's children
export const useAllPendingVerifications = () => {
  return useQuery({
    queryKey: ['all-pending-verifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get all children for this user
      const { data: children, error: childrenError } = await supabase
        .from('children')
        .select('id, name')
        .eq('user_id', user.id);

      if (childrenError) throw childrenError;
      if (!children?.length) return [];

      const childIds = children.map(c => c.id);

      // Get pending verification requests for these children
      const { data, error } = await supabase
        .from('log_verification_requests')
        .select(`
          *,
          reading_log:reading_logs(book_title, logged_at)
        `)
        .in('child_id', childIds)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Attach child name to each request
      return (data || []).map(req => ({
        ...req,
        child: children.find(c => c.id === req.child_id) || null,
      })) as LogVerificationWithDetails[];
    },
  });
};

// Fetch verification request for a specific reading log
export const useLogVerificationStatus = (logId: string | undefined) => {
  return useQuery({
    queryKey: ['log-verification-status', logId],
    queryFn: async () => {
      if (!logId) return null;
      
      const { data, error } = await supabase
        .from('log_verification_requests')
        .select('*')
        .eq('reading_log_id', logId)
        .maybeSingle();
      
      if (error) throw error;
      return data as LogVerificationRequest | null;
    },
    enabled: !!logId,
  });
};

// Batch fetch verification statuses for multiple reading logs
export const useLogsVerificationStatuses = (logIds: string[]) => {
  return useQuery({
    queryKey: ['logs-verification-statuses', logIds],
    queryFn: async () => {
      if (logIds.length === 0) return {};
      
      const { data, error } = await supabase
        .from('log_verification_requests')
        .select('*')
        .in('reading_log_id', logIds);
      
      if (error) throw error;
      
      // Create a map of log_id -> verification request
      const statusMap: Record<string, LogVerificationRequest> = {};
      for (const req of data || []) {
        statusMap[req.reading_log_id] = req as LogVerificationRequest;
      }
      return statusMap;
    },
    enabled: logIds.length > 0,
  });
};

// Update verification request status (approve/dismiss)
export const useUpdateVerificationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      status 
    }: { 
      requestId: string; 
      status: 'approved' | 'dismissed';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('log_verification_requests')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id || null,
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['log-verification-requests'] });
      queryClient.invalidateQueries({ queryKey: ['all-pending-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['logs-verification-statuses'] });
      toast.success(
        variables.status === 'approved' 
          ? "Reading log approved!" 
          : "Reading log dismissed"
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
};
