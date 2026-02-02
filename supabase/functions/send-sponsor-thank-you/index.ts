import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ThankYouRequest {
  sponsorEmail: string;
  sponsorName: string;
  studentName: string;
  pledgeType: "flat" | "per_minute" | "milestone";
  amount: number;
  className?: string;
  isClassPledge?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      sponsorEmail,
      sponsorName,
      studentName,
      pledgeType,
      amount,
      className,
      isClassPledge,
    }: ThankYouRequest = await req.json();

    const pledgeDescription = isClassPledge
      ? `${className}'s classroom`
      : studentName;

    const pledgeTypeLabel =
      pledgeType === "flat"
        ? `$${amount.toFixed(2)} flat donation`
        : pledgeType === "per_minute"
        ? `$${amount.toFixed(2)} per minute read`
        : `$${amount.toFixed(2)} milestone pledge`;

    const subject = `🎉 Thank you for sponsoring ${pledgeDescription}!`;
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
            .highlight { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .pledge-box { background: #f0fdf4; border: 2px solid #22c55e; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .amount { font-size: 28px; color: #16a34a; font-weight: bold; }
            .heart { font-size: 48px; }
            .footer { background: #f8f5f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 Read-a-thon</h1>
            </div>
            <div class="content">
              <div class="heart" style="text-align: center;">❤️</div>
              <p style="text-align: center; font-size: 18px;">Hi ${sponsorName},</p>
              <p style="text-align: center;">Thank you so much for pledging to support <strong>${pledgeDescription}</strong>!</p>
              
              <div class="pledge-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Pledge</p>
                <p class="amount">${pledgeTypeLabel}</p>
              </div>
              
              <p>Your generosity helps inspire young readers and supports our school community. Every pledge makes a difference!</p>
              
              ${
                pledgeType === "per_minute"
                  ? `
              <div class="highlight">
                <p style="margin: 0;"><strong>What happens next?</strong></p>
                <p style="margin: 10px 0 0 0;">As ${isClassPledge ? "students in the classroom read" : studentName + " reads"}, your pledge grows! We'll send you updates on their progress and let you know the final amount at the end of the Read-a-thon.</p>
              </div>
              `
                  : ""
              }
              
              <p>We'll be in touch when it's time to complete your payment. In the meantime, thank you again for being part of this journey!</p>
              
              <p style="margin-top: 30px;">With gratitude,<br>The Read-a-thon Team</p>
            </div>
            <div class="footer">
              <p>Thank you for supporting young readers! 📖</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Read-a-thon <onboarding@resend.dev>",
        to: [sponsorEmail],
        subject,
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Sponsor thank you email sent:", emailResult);

    // Log the email
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from("email_logs").insert({
      recipient_email: sponsorEmail,
      recipient_name: sponsorName,
      recipient_type: "sponsor",
      subject,
      body: htmlContent,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-sponsor-thank-you function:", error);
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
