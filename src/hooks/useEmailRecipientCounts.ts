import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";

export interface RecipientCounts {
  all_sponsors: number;
  unpaid_sponsors: number;
  overdue_sponsors: number;
  check_sponsors: number;
  all_parents: number;
  all_teachers: number;
  inactive_students: number;
}

export function useEmailRecipientCounts() {
  return useQuery({
    queryKey: ["email-recipient-counts"],
    queryFn: async (): Promise<RecipientCounts> => {
      // Get all sponsors count
      const { count: allSponsors } = await supabase
        .from("sponsors")
        .select("*", { count: "exact", head: true });

      // Get unpaid sponsors (sponsors with at least one unpaid pledge)
      const { data: unpaidPledges } = await supabase
        .from("pledges")
        .select("sponsor_id")
        .eq("is_paid", false)
        .not("sponsor_id", "is", null);

      const uniqueUnpaidSponsors = new Set(unpaidPledges?.map(p => p.sponsor_id) || []);

      // Get overdue sponsors (unpaid pledges created more than 7 days ago)
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      const { data: overduePledges } = await supabase
        .from("pledges")
        .select("sponsor_id")
        .eq("is_paid", false)
        .lt("created_at", sevenDaysAgo)
        .not("sponsor_id", "is", null);

      const uniqueOverdueSponsors = new Set(overduePledges?.map(p => p.sponsor_id) || []);

      // Check sponsors - for now we return 0 since we don't have payment_method column
      // This could be added later with a migration
      const checkSponsors = 0;

      // Parents and teachers - using profiles table for now
      // In a real app, you'd have role-based filtering
      const { count: allProfiles } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Inactive students - students with no reading logs in the past 7 days
      // First get all unique students
      const { data: allStudents } = await supabase
        .from("reading_logs")
        .select("student_name");

      const uniqueStudents = new Set(allStudents?.map(l => l.student_name) || []);

      // Get students who logged in the past 7 days
      const { data: activeStudents } = await supabase
        .from("reading_logs")
        .select("student_name")
        .gte("logged_at", sevenDaysAgo);

      const activeStudentNames = new Set(activeStudents?.map(l => l.student_name) || []);
      const inactiveCount = [...uniqueStudents].filter(s => !activeStudentNames.has(s)).length;

      return {
        all_sponsors: allSponsors || 0,
        unpaid_sponsors: uniqueUnpaidSponsors.size,
        overdue_sponsors: uniqueOverdueSponsors.size,
        check_sponsors: checkSponsors,
        all_parents: allProfiles || 0,
        all_teachers: 0, // Would need teacher role in user_roles
        inactive_students: inactiveCount,
      };
    },
  });
}

export function useRecipientsByFilter(filter: string) {
  return useQuery({
    queryKey: ["email-recipients", filter],
    queryFn: async () => {
      if (!filter) return [];

      switch (filter) {
        case "all_sponsors": {
          const { data } = await supabase
            .from("sponsors")
            .select("id, name, email");
          return data || [];
        }

        case "unpaid_sponsors": {
          const { data: unpaidPledges } = await supabase
            .from("pledges")
            .select("sponsor_id, sponsors(id, name, email)")
            .eq("is_paid", false)
            .not("sponsor_id", "is", null);

          const uniqueSponsors = new Map();
          unpaidPledges?.forEach(p => {
            const sponsor = p.sponsors as any;
            if (sponsor && !uniqueSponsors.has(sponsor.id)) {
              uniqueSponsors.set(sponsor.id, sponsor);
            }
          });
          return Array.from(uniqueSponsors.values());
        }

        case "overdue_sponsors": {
          const sevenDaysAgo = subDays(new Date(), 7).toISOString();
          const { data: overduePledges } = await supabase
            .from("pledges")
            .select("sponsor_id, sponsors(id, name, email)")
            .eq("is_paid", false)
            .lt("created_at", sevenDaysAgo)
            .not("sponsor_id", "is", null);

          const uniqueSponsors = new Map();
          overduePledges?.forEach(p => {
            const sponsor = p.sponsors as any;
            if (sponsor && !uniqueSponsors.has(sponsor.id)) {
              uniqueSponsors.set(sponsor.id, sponsor);
            }
          });
          return Array.from(uniqueSponsors.values());
        }

        default:
          return [];
      }
    },
    enabled: !!filter,
  });
}
