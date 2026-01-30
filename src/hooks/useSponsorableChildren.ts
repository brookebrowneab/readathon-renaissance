import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SponsorableChild {
  id: string;
  name: string;
  displayName: string; // First name + last initial for privacy
  grade_info: string | null;
  class_name: string | null;
  total_minutes: number;
  goal_minutes: number;
  teacher_name: string | null;
  source: "public" | "invited";
}

// Fetch children that the current user can sponsor (COPPA-compliant)
// Only shows: children with share_public_link=true OR children they were invited to sponsor
export function useSponsorableChildren() {
  return useQuery({
    queryKey: ["sponsorable-children"],
    queryFn: async (): Promise<SponsorableChild[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get user's own children IDs to exclude them
      const { data: ownChildren } = await supabase
        .from("children")
        .select("id")
        .eq("user_id", user.id);

      const ownChildIds = new Set(ownChildren?.map((c) => c.id) || []);

      // Get children with public sharing enabled
      const { data: publicChildren, error: publicError } = await supabase
        .from("children")
        .select(`
          id,
          name,
          grade_info,
          class_name,
          total_minutes,
          goal_minutes,
          homeroom_teacher_id
        `)
        .eq("share_public_link", true);

      if (publicError) throw publicError;

      // Get teacher names for the children
      const teacherIds = [...new Set((publicChildren || [])
        .map(c => c.homeroom_teacher_id)
        .filter(Boolean))] as string[];

      let teacherMap = new Map<string, string>();
      if (teacherIds.length > 0) {
        const { data: teachers } = await supabase
          .from("teachers")
          .select("id, name")
          .in("id", teacherIds);
        
        teachers?.forEach(t => teacherMap.set(t.id, t.name));
      }

      // Get children from accepted invitations (using type assertion for new table)
      const { data: invitations, error: invitationsError } = await (supabase as any)
        .from("sponsor_invitations")
        .select("child_id")
        .or(`invitee_user_id.eq.${user.id},invitee_email.eq.${user.email}`)
        .eq("status", "accepted");

      if (invitationsError) throw invitationsError;

      const invitedChildIds = new Set<string>((invitations || []).map((i: { child_id: string }) => i.child_id));

      // Get invited children details if any
      let invitedChildren: typeof publicChildren = [];
      const invitedChildIdArray = Array.from(invitedChildIds) as string[];
      if (invitedChildIdArray.length > 0) {
        const { data, error } = await supabase
          .from("children")
          .select(`
            id,
            name,
            grade_info,
            class_name,
            total_minutes,
            goal_minutes,
            homeroom_teacher_id
          `)
          .in("id", invitedChildIdArray);
        
        if (!error && data) {
          invitedChildren = data;
          
          // Get additional teacher names
          const additionalTeacherIds = data
            .map(c => c.homeroom_teacher_id)
            .filter(id => id && !teacherMap.has(id)) as string[];
          
          if (additionalTeacherIds.length > 0) {
            const { data: moreTeachers } = await supabase
              .from("teachers")
              .select("id, name")
              .in("id", additionalTeacherIds);
            
            moreTeachers?.forEach(t => teacherMap.set(t.id, t.name));
          }
        }
      }

      // Build combined list (excluding own children)
      const childMap = new Map<string, SponsorableChild>();

      // Helper to format child
      const formatChild = (child: {
        id: string;
        name: string;
        grade_info: string | null;
        class_name: string | null;
        total_minutes: number;
        goal_minutes: number;
        homeroom_teacher_id: string | null;
      }, source: "public" | "invited"): SponsorableChild => {
        const nameParts = child.name.split(" ");
        const firstName = nameParts[0];
        const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] + "." : "";

        return {
          id: child.id,
          name: child.name,
          displayName: `${firstName} ${lastInitial}`.trim(),
          grade_info: child.grade_info,
          class_name: child.class_name,
          total_minutes: child.total_minutes,
          goal_minutes: child.goal_minutes,
          teacher_name: child.homeroom_teacher_id ? teacherMap.get(child.homeroom_teacher_id) || null : null,
          source,
        };
      };

      // Add public children
      publicChildren?.forEach((child) => {
        if (ownChildIds.has(child.id)) return;
        childMap.set(child.id, formatChild(child, "public"));
      });

      // Add/upgrade invited children
      invitedChildren?.forEach((child) => {
        if (ownChildIds.has(child.id)) return;
        
        if (childMap.has(child.id)) {
          // Upgrade to invited source
          const existing = childMap.get(child.id)!;
          existing.source = "invited";
        } else {
          childMap.set(child.id, formatChild(child, "invited"));
        }
      });

      return Array.from(childMap.values());
    },
  });
}
