import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReminderRequest {
  pledges: {
    pledgeId: string;
    recipientEmail: string;
    recipientName: string;
    studentName: string;
    amount: number;
    pledgeType: "flat" | "per_minute";
    totalMinutes?: number;
    daysSincePledge: number;
  }[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pledges }: ReminderRequest = await req.json();

    if (!pledges || pledges.length === 0) {
      throw new Error("No pledges provided");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: { pledgeId: string; success: boolean; error?: string }[] = [];

    for (const pledge of pledges) {
      const {
        pledgeId,
        recipientEmail,
        recipientName,
        studentName,
        amount,
        pledgeType,
        totalMinutes,
        daysSincePledge,
      } = pledge;

      const calculatedAmount =
        pledgeType === "per_minute" && totalMinutes
          ? amount * totalMinutes
          : amount;

      const urgencyMessage = daysSincePledge > 10 
        ? `<p style="color: #dc2626; font-weight: bold;">⚠️ This pledge has been outstanding for ${daysSincePledge} days.</p>`
        : daysSincePledge > 5
        ? `<p style="color: #f59e0b;">This pledge was made ${daysSincePledge} days ago.</p>`
        : "";

      const subject = `📚 Friendly Reminder: Your pledge for ${studentName}'s Read-a-thon`;
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f8f5f0; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { color: #1a1a1a; margin: 0; font-weight: normal; }
              .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
              .pledge-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
              .amount { font-size: 32px; color: #d97706; font-weight: bold; }
              .cta-button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { background: #f8f5f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📚 Read-a-thon</h1>
              </div>
              <div class="content">
                <p>Hi ${recipientName},</p>
                <p>We hope this message finds you well! We wanted to send a friendly reminder about your generous pledge to support <strong>${studentName}</strong>'s reading journey.</p>
                
                ${urgencyMessage}
                
                <div class="pledge-box">
                  <p style="margin: 0 0 10px 0;">Your Pledge</p>
                  <p class="amount">$${calculatedAmount.toFixed(2)}</p>
                  ${pledgeType === "per_minute" && totalMinutes ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">${totalMinutes} minutes × $${amount.toFixed(2)}/min</p>` : ""}
                </div>
                
                <p>${studentName} has been working hard on their reading goals, and your support means the world to them!</p>
                
                <p>If you've already submitted your payment, please disregard this message. If you have any questions about how to complete your pledge, please don't hesitate to reach out.</p>
                
                <p>Thank you for supporting young readers!</p>
                
                <p>Best,<br>The Read-a-thon Team</p>
              </div>
              <div class="footer">
                <p>You're receiving this because you pledged to support a student in Read-a-thon.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        // Send email via Resend API
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Read-a-thon <onboarding@resend.dev>",
            to: [recipientEmail],
            subject,
            html: htmlContent,
          }),
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error("Failed to send email:", emailResult);
          results.push({ pledgeId, success: false, error: emailResult.message || "Failed to send" });
          continue;
        }

        console.log("Reminder email sent successfully:", emailResult);

        // Log the email in the database
        await supabase.from("email_logs").insert({
          recipient_email: recipientEmail,
          recipient_name: recipientName,
          recipient_type: "sponsor",
          subject,
          body: htmlContent,
          status: "sent",
          sent_at: new Date().toISOString(),
        });

        results.push({ pledgeId, success: true });
      } catch (emailError: any) {
        console.error("Error sending reminder for pledge:", pledgeId, emailError);
        results.push({ pledgeId, success: false, error: emailError.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        summary: { sent: successCount, failed: failureCount }
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-payment-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
