import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GuestPledge {
  pledgeId: string;
  recipientEmail: string;
  recipientName: string;
  className: string;
  teacherName?: string;
  amount: number;
  paymentToken: string;
  baseUrl: string;
}

interface GuestPaymentEmailRequest {
  pledges: GuestPledge[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pledges }: GuestPaymentEmailRequest = await req.json();

    if (!pledges || pledges.length === 0) {
      throw new Error("No pledges provided");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: { pledgeId: string; success: boolean; error?: string }[] = [];

    for (let i = 0; i < pledges.length; i++) {
      const pledge = pledges[i];
      
      // Add delay between emails to avoid rate limiting (2 req/sec limit)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      const {
        pledgeId,
        recipientEmail,
        recipientName,
        className,
        teacherName,
        amount,
        paymentToken,
        baseUrl,
      } = pledge;

      const paymentLink = `${baseUrl}/sponsor/guest-pay?token=${paymentToken}`;

      const subject = `📚 Complete Your Read-a-thon Pledge for ${className}`;
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
              .cta-button { display: inline-block; background: #16a34a; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-size: 18px; font-weight: bold; }
              .cta-button:hover { background: #15803d; }
              .footer { background: #f8f5f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
              .link-text { word-break: break-all; font-size: 12px; color: #666; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📚 Read-a-thon</h1>
              </div>
              <div class="content">
                <p>Hi${recipientName ? ` ${recipientName}` : ''},</p>
                <p>Thank you for your generous pledge to support <strong>${className}</strong>${teacherName ? ` (${teacherName}'s class)` : ''} in our Read-a-thon!</p>
                
                <div class="pledge-box">
                  <p style="margin: 0 0 10px 0;">Your Pledge</p>
                  <p class="amount">$${amount.toFixed(2)}</p>
                </div>
                
                <p>The Read-a-thon has come to an end, and it's time to complete your pledge. Click the button below to make your payment:</p>
                
                <div style="text-align: center;">
                  <a href="${paymentLink}" class="cta-button">Complete Payment →</a>
                </div>
                
                <p class="link-text">Or copy this link: ${paymentLink}</p>
                
                <p style="margin-top: 30px;">Your support helps encourage young readers and funds important educational programs. Thank you for making a difference!</p>
                
                <p>Best,<br>The Read-a-thon Team</p>
              </div>
              <div class="footer">
                <p>You're receiving this because you pledged to support a classroom in Read-a-thon.</p>
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

        console.log("Guest payment email sent successfully:", emailResult);

        // Log the email in the database
        await supabase.from("email_logs").insert({
          recipient_email: recipientEmail,
          recipient_name: recipientName || 'Guest',
          recipient_type: "guest_sponsor",
          subject,
          body: htmlContent,
          status: "sent",
          sent_at: new Date().toISOString(),
        });

        results.push({ pledgeId, success: true });
      } catch (emailError: any) {
        console.error("Error sending email for pledge:", pledgeId, emailError);
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
    console.error("Error in send-guest-payment-email function:", error);
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
