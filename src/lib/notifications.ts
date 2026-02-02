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

interface GuestPaymentEmailPledge {
  pledgeId: string;
  recipientEmail: string;
  recipientName: string;
  className: string;
  teacherName?: string;
  amount: number;
  paymentToken: string;
}

interface SendGuestPaymentEmailsResult {
  success: boolean;
  summary?: { sent: number; failed: number };
  error?: string;
}

export const sendGuestPaymentEmails = async (
  pledges: GuestPaymentEmailPledge[]
): Promise<SendGuestPaymentEmailsResult> => {
  try {
    // Get the base URL for payment links
    const baseUrl = window.location.origin;
    
    const { data, error } = await supabase.functions.invoke(
      "send-guest-payment-email",
      {
        body: { 
          pledges: pledges.map(p => ({ ...p, baseUrl }))
        },
      }
    );

    if (error) {
      console.error("Error sending guest payment emails:", error);
      return { success: false, error: error.message };
    }

    return { success: true, summary: data.summary };
  } catch (err: any) {
    console.error("Error invoking guest payment email function:", err);
    return { success: false, error: err.message };
  }
};

// Sponsor thank you email
interface SendSponsorThankYouParams {
  sponsorEmail: string;
  sponsorName: string;
  studentName: string;
  pledgeType: "flat" | "per_minute" | "milestone";
  amount: number;
  className?: string;
  isClassPledge?: boolean;
}

export const sendSponsorThankYou = async (
  params: SendSponsorThankYouParams
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-sponsor-thank-you",
      { body: params }
    );

    if (error) {
      console.error("Error sending sponsor thank you:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error invoking sponsor thank you function:", err);
    return { success: false, error: err.message };
  }
};

// Parent welcome email
interface SendParentWelcomeParams {
  parentEmail: string;
  parentName: string;
  childName: string;
  familyPledgeUrl: string;
  dashboardUrl: string;
}

export const sendParentWelcome = async (
  params: SendParentWelcomeParams
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-parent-welcome",
      { body: params }
    );

    if (error) {
      console.error("Error sending parent welcome:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error invoking parent welcome function:", err);
    return { success: false, error: err.message };
  }
};
