import { supabase } from "@/integrations/supabase/client";

interface SendPledgeNotificationParams {
  type: "pledge_created" | "payment_complete";
  pledgeId: string;
  recipientEmail: string;
  recipientName: string;
  sponsorName?: string;
  studentName: string;
  amount: number;
  pledgeType: "flat" | "per_minute";
  totalMinutes?: number;
}

export const sendPledgeNotification = async (
  params: SendPledgeNotificationParams
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-pledge-notification",
      {
        body: params,
      }
    );

    if (error) {
      console.error("Error sending pledge notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error invoking notification function:", err);
    return { success: false, error: err.message };
  }
};
