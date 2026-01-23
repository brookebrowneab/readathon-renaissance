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

interface PaymentReminderPledge {
  pledgeId: string;
  recipientEmail: string;
  recipientName: string;
  studentName: string;
  amount: number;
  pledgeType: "flat" | "per_minute";
  totalMinutes?: number;
  daysSincePledge: number;
}

interface SendPaymentRemindersResult {
  success: boolean;
  summary?: { sent: number; failed: number };
  error?: string;
}

export const sendPaymentReminders = async (
  pledges: PaymentReminderPledge[]
): Promise<SendPaymentRemindersResult> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-payment-reminder",
      {
        body: { pledges },
      }
    );

    if (error) {
      console.error("Error sending payment reminders:", error);
      return { success: false, error: error.message };
    }

    return { success: true, summary: data.summary };
  } catch (err: any) {
    console.error("Error invoking reminder function:", err);
    return { success: false, error: err.message };
  }
};
