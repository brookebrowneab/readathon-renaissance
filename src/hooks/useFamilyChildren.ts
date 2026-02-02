import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Child } from "./useChildren";

/**
 * Hook to fetch all children belonging to a specific parent user ID.
 * Used by sponsors to see all children in a family they can sponsor.
 * This requires the children to have share_public_link enabled, OR
 * the sponsor to have an approved invitation to at least one child in the family.
 */
export const useFamilyChildren = (parentUserId: string | undefined) => {
  return useQuery({
    queryKey: ["family-children", parentUserId],
    queryFn: async () => {
      if (!parentUserId) throw new Error("No parent user ID provided");

      // Fetch all children for this parent that are publicly visible
      const { data, error } = await supabase
        .from("children")
        .select(`
          id,
          user_id,
          name,
          grade_info,
          class_name,
          goal_minutes,
          share_public_link,
          total_minutes,
          homeroom_teacher_id
        `)
        .eq("user_id", parentUserId)
        .eq("share_public_link", true)
        .order("name", { ascending: true });

      if (error) throw error;
      
      // Only return children with public links enabled
      return (data || []) as Pick<Child, 
        "id" | "user_id" | "name" | "grade_info" | "class_name" | 
        "goal_minutes" | "share_public_link" | "total_minutes" | "homeroom_teacher_id"
      >[];
    },
    enabled: !!parentUserId,
  });
};

/**
 * Hook to get the parent user_id from a child ID.
 * Used to redirect from old child-specific links to family links.
 */
export const useParentFromChild = (childId: string | undefined) => {
  return useQuery({
    queryKey: ["parent-from-child", childId],
    queryFn: async () => {
      if (!childId) throw new Error("No child ID provided");

      const { data, error } = await supabase
        .from("children")
        .select("user_id")
        .eq("id", childId)
        .single();

      if (error) throw error;
      return data.user_id;
    },
    enabled: !!childId,
  });
};
