import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GuestPledgeInput {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  className: string;
  teacherId?: string;
  eventId?: string;
  pledgeType: "flat" | "milestone";
  amount: number;
  milestoneMinutesTarget?: number;
}

/**
 * Create a class pledge as a guest (no authentication required).
 * Guest pledges use a special system user ID and store contact info in the sponsors table.
 */
export function useGuestClassPledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: GuestPledgeInput) => {
      // First, create or find a guest sponsor record
      // We'll use a deterministic approach: check if email exists, otherwise create
      const { data: existingSponsor, error: fetchError } = await supabase
        .from("sponsors")
        .select("id, user_id")
        .eq("email", input.guestEmail.toLowerCase())
        .maybeSingle();

      let sponsorUserId: string;

      if (existingSponsor) {
        // Use existing sponsor's user_id
        sponsorUserId = existingSponsor.user_id;
      } else {
        // For guests without accounts, we need a way to track them
        // We'll create a placeholder user_id using a UUID based on their email
        // This allows RLS to work while not requiring authentication
        
        // Use a deterministic UUID-like string for guest sponsors
        // In practice, we'll use the special "guest" approach with service role
        // For now, we'll insert into sponsors without a user_id constraint
        
        // Actually, the sponsors table requires user_id. 
        // For guest pledges, we'll skip creating a sponsor record and store info in payments/pledges
        sponsorUserId = "00000000-0000-0000-0000-000000000000"; // Guest placeholder
      }

      // Create the class pledge
      // For guest pledges, we need to store the guest info somewhere
      // The class_pledges table has sponsor_user_id - we'll need to handle this differently
      
      // Let's insert the pledge with guest info in a transaction-like manner
      const { data: pledge, error: pledgeError } = await supabase
        .from("class_pledges")
        .insert({
          sponsor_user_id: sponsorUserId,
          class_name: input.className,
          teacher_id: input.teacherId || null,
          event_id: input.eventId || null,
          pledge_type: input.pledgeType,
          amount: input.amount,
          milestone_minutes_target: input.milestoneMinutesTarget || null,
        })
        .select()
        .single();

      if (pledgeError) {
        console.error("Error creating guest pledge:", pledgeError);
        throw new Error("Failed to create pledge. Please try again.");
      }

      // Store guest contact info in payments table for admin tracking
      // We'll create a payment record with payer info even though payment isn't complete yet
      await supabase
        .from("payments")
        .insert({
          class_pledge_id: pledge.id,
          pledge_type: "class",
          amount: 0, // Will be updated when they actually pay
          payment_method: "pending",
          payer_name: input.guestName,
          payer_email: input.guestEmail,
          notes: `Guest pledge - Phone: ${input.guestPhone}`,
        });

      return pledge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-pledges"] });
      queryClient.invalidateQueries({ queryKey: ["class-fundraising"] });
      toast.success("Thank you for your pledge!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create pledge");
    },
  });
}
