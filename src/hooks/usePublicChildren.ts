import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicChild {
  id: string;
  user_id: string;
  display_name: string;
  grade_info: string | null;
  class_name: string | null;
  goal_minutes: number;
  total_minutes: number;
  share_public_link: boolean;
  homeroom_teacher_id: string | null;
}

/**
 * Hook to fetch privacy-safe child data from the children_public_safe view.
 * Returns display_name (First Name + Last Initial) instead of full name.
 * Used for all sponsor-facing pages to ensure COPPA compliance.
 */
export const usePublicFamilyChildren = (parentUserId: string | undefined) => {
  return useQuery({
    queryKey: ["public-family-children", parentUserId],
    queryFn: async () => {
      if (!parentUserId) throw new Error("No parent user ID provided");

      // Query the safe view that returns display_name instead of full name
      const { data, error } = await supabase
        .from("children_public_safe")
        .select("*")
        .eq("user_id", parentUserId)
        .order("display_name", { ascending: true });

      if (error) throw error;
      
      return (data || []) as PublicChild[];
    },
    enabled: !!parentUserId,
  });
};

/**
 * Hook to fetch a single child's privacy-safe data.
 * Returns display_name (First Name + Last Initial) instead of full name.
 * Used for single-child sponsor pages.
 */
export const usePublicChildById = (childId: string | undefined) => {
  return useQuery({
    queryKey: ["public-child", childId],
    queryFn: async () => {
      if (!childId) throw new Error("No child ID provided");

      const { data, error } = await supabase
        .from("children_public_safe")
        .select("*")
        .eq("id", childId)
        .single();

      if (error) throw error;
      return data as PublicChild;
    },
    enabled: !!childId,
  });
};
