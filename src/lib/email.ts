import { supabase } from "@/integrations/supabase/client";

interface EmailRecipient {
  email: string;
  name: string;
  type: string;
  variables?: Record<string, string>;
}

interface SendTemplateEmailParams {
  templateId?: string;
  subject: string;
  body: string;
  recipients: EmailRecipient[];
}

interface SendEmailResult {
  success: boolean;
  summary?: { sent: number; failed: number };
  error?: string;
}

export const sendTemplateEmail = async (
  params: SendTemplateEmailParams
): Promise<SendEmailResult> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-template-email",
      {
        body: params,
      }
    );

    if (error) {
      console.error("Error sending template email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, summary: data.summary };
  } catch (err: any) {
    console.error("Error invoking email function:", err);
    return { success: false, error: err.message };
  }
};
