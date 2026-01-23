import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Child {
  id: string;
  user_id: string;
  name: string;
  grade_info: string | null;
  class_name: string | null;
  goal_minutes: number;
  share_public_link: boolean;
  total_minutes: number;
  student_pin: string | null;
  student_username: string | null;
  student_password_hash: string | null;
  student_login_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChildInsert {
  name: string;
  grade_info?: string | null;
  class_name?: string | null;
  goal_minutes?: number;
  share_public_link?: boolean;
  student_pin?: string | null;
  student_username?: string | null;
  student_login_enabled?: boolean;
}

export interface ChildUpdate {
  id: string;
  name?: string;
  grade_info?: string | null;
  class_name?: string | null;
  goal_minutes?: number;
  share_public_link?: boolean;
  total_minutes?: number;
  student_pin?: string | null;
  student_username?: string | null;
  student_login_enabled?: boolean;
}

export const useChildren = () => {
  const queryClient = useQueryClient();

  const { data: children = [], isLoading, error } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Child[];
    },
  });

  const addChild = useMutation({
    mutationFn: async (child: ChildInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("children")
        .insert({
          ...child,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Child;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Child added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add child: " + error.message);
    },
  });

  const updateChild = useMutation({
    mutationFn: async ({ id, ...updates }: ChildUpdate) => {
      const { data, error } = await supabase
        .from("children")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Child;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
    },
  });

  const deleteChild = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("children")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Child removed from program");
    },
    onError: (error) => {
      toast.error("Failed to remove child: " + error.message);
    },
  });

  return {
    children,
    isLoading,
    error,
    addChild,
    updateChild,
    deleteChild,
  };
};

// Hook for fetching a single child by ID (for public sponsor pages)
export const useChildById = (childId: string | undefined) => {
  return useQuery({
    queryKey: ["child", childId],
    queryFn: async () => {
      if (!childId) throw new Error("No child ID provided");

      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", childId)
        .single();

      if (error) throw error;
      return data as Child;
    },
    enabled: !!childId,
  });
};
