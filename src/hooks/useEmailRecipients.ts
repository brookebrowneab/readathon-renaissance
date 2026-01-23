import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";

export interface EmailRecipient {
  id: string;
  name: string;
  email: string;
  type: "sponsor" | "parent" | "teacher";
  // Extended data for variable substitution
  pledgeId?: string;
  studentName?: string;
  childId?: string;
  pledgeAmount?: number;
  pledgeType?: string;
  isPaid?: boolean;
  minutesRead?: number;
  goalMinutes?: number;
  eventName?: string;
  eventEndDate?: string;
  expectedPaymentMethod?: string;
}

export function useEmailRecipients() {
  return useQuery({
    queryKey: ["email-recipients-extended"],
    queryFn: async (): Promise<EmailRecipient[]> => {
      // Fetch active event
      const { data: activeEvent } = await supabase
        .from("events")
        .select("id, name, end_date")
        .eq("is_active", true)
        .single();

      // Fetch sponsors with their pledges and associated children
      const { data: pledges, error: pledgesError } = await supabase
        .from("pledges")
        .select(`
          id,
          sponsor_id,
          child_id,
          student_name,
          amount,
          pledge_type,
          is_paid,
          expected_payment_method,
          event_id
        `);

      if (pledgesError) {
        console.error("Error fetching pledges:", pledgesError);
      }

      // Fetch sponsors
      const { data: sponsors, error: sponsorsError } = await supabase
        .from("sponsors")
        .select("id, name, email");

      if (sponsorsError) {
        console.error("Error fetching sponsors:", sponsorsError);
      }

      // Fetch children for reading data
      const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id, name, total_minutes, goal_minutes, user_id");

      if (childrenError) {
        console.error("Error fetching children:", childrenError);
      }

      // Create a map of children by ID for quick lookup
      const childrenMap = new Map(
        (children || []).map((c) => [c.id, c])
      );

      // Create sponsor recipients with pledge data
      const sponsorRecipients: EmailRecipient[] = [];

      for (const sponsor of sponsors || []) {
        // Find pledges for this sponsor
        const sponsorPledges = (pledges || []).filter(
          (p) => p.sponsor_id === sponsor.id
        );

        if (sponsorPledges.length > 0) {
          // Create a recipient entry for each pledge (for personalized emails)
          for (const pledge of sponsorPledges) {
            const child = pledge.child_id ? childrenMap.get(pledge.child_id) : null;
            
            sponsorRecipients.push({
              id: `${sponsor.id}-${pledge.id}`,
              name: sponsor.name,
              email: sponsor.email,
              type: "sponsor" as const,
              pledgeId: pledge.id,
              studentName: pledge.student_name || child?.name || "Student",
              childId: pledge.child_id || undefined,
              pledgeAmount: pledge.amount,
              pledgeType: pledge.pledge_type,
              isPaid: pledge.is_paid,
              minutesRead: child?.total_minutes || 0,
              goalMinutes: child?.goal_minutes || 300,
              eventName: activeEvent?.name || "Read-a-thon",
              eventEndDate: activeEvent?.end_date || undefined,
              expectedPaymentMethod: pledge.expected_payment_method || undefined,
            });
          }
        } else {
          // Sponsor without pledges - still include them
          sponsorRecipients.push({
            id: sponsor.id,
            name: sponsor.name,
            email: sponsor.email,
            type: "sponsor" as const,
            eventName: activeEvent?.name || "Read-a-thon",
            eventEndDate: activeEvent?.end_date || undefined,
          });
        }
      }

      return sponsorRecipients;
    },
  });
}

// Helper to get unique sponsors (for counting)
export function getUniqueSponsorEmails(recipients: EmailRecipient[]): string[] {
  return [...new Set(recipients.filter(r => r.type === "sponsor").map(r => r.email))];
}

// Helper to calculate days remaining
export function getDaysRemaining(endDate?: string): number {
  if (!endDate) return 0;
  const days = differenceInDays(new Date(endDate), new Date());
  return Math.max(0, days);
}
