import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      type,
      pledgeId,
      recipientEmail,
      recipientName,
      sponsorName,
      studentName,
      amount,
      pledgeType,
      totalMinutes,
    }: NotificationRequest = await req.json();

    let subject: string;
    let htmlContent: string;
    const calculatedAmount =
      pledgeType === "per_minute" && totalMinutes
        ? amount * totalMinutes
        : amount;

    if (type === "pledge_created") {
      subject = `🎉 New pledge received for ${studentName}!`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f8f5f0; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { color: #1a1a1a; margin: 0; font-weight: normal; }
              .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
              .highlight { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; }
              .amount { font-size: 32px; color: #16a34a; font-weight: bold; }
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
                <p>Great news! <strong>${sponsorName || "A sponsor"}</strong> has made a pledge to support <strong>${studentName}</strong>'s reading journey!</p>
                
                <div class="highlight">
                  <p style="margin: 0 0 10px 0;">Pledge Details:</p>
                  <p class="amount">$${amount.toFixed(2)}${pledgeType === "per_minute" ? "/minute" : " flat"}</p>
                  ${pledgeType === "per_minute" ? `<p style="margin: 10px 0 0 0; color: #666;">This pledge will grow with every minute ${studentName} reads!</p>` : ""}
                </div>
                
                <p>Keep encouraging ${studentName} to read — every minute counts!</p>
                <p>Best,<br>The Read-a-thon Team</p>
              </div>
              <div class="footer">
                <p>You're receiving this because you're registered for Read-a-thon.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (type === "payment_complete") {
      subject = `✅ Payment confirmed for ${studentName}'s pledge`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f8f5f0; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { color: #1a1a1a; margin: 0; font-weight: normal; }
              .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
              .success-box { background: #f0fdf4; border: 2px solid #22c55e; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
              .amount { font-size: 32px; color: #16a34a; font-weight: bold; }
              .checkmark { font-size: 48px; }
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
                <p>A payment has been marked as complete for <strong>${studentName}</strong>'s pledge!</p>
                
                <div class="success-box">
                  <div class="checkmark">✓</div>
                  <p style="margin: 10px 0;">Payment Received</p>
                  <p class="amount">$${calculatedAmount.toFixed(2)}</p>
                </div>
                
                <p>Thank you for your generous support of ${studentName}'s reading journey. Your contribution makes a real difference!</p>
                
                ${pledgeType === "per_minute" && totalMinutes ? `<p style="color: #666; font-size: 14px;">${studentName} read ${totalMinutes} minutes × $${amount.toFixed(2)}/min = $${calculatedAmount.toFixed(2)}</p>` : ""}
                
                <p>Best,<br>The Read-a-thon Team</p>
              </div>
              <div class="footer">
                <p>Thank you for supporting young readers!</p>
              </div>
            </div>
          </body>
        </html>
      `;
    } else {
      throw new Error("Invalid notification type");
    }

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
    console.log("Email sent successfully:", emailResult);

    // Log the email in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from("email_logs").insert({
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      recipient_type: type === "pledge_created" ? "parent" : "sponsor",
      subject,
      body: htmlContent,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-pledge-notification function:", error);
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
