import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeRequest {
  parentEmail: string;
  parentName: string;
  childName: string;
  familyPledgeUrl: string;
  dashboardUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      parentEmail,
      parentName,
      childName,
      familyPledgeUrl,
      dashboardUrl,
    }: WelcomeRequest = await req.json();

    const subject = `🎉 Welcome to Read-a-thon! ${childName} is enrolled`;
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
            .success-box { background: #f0fdf4; border: 2px solid #22c55e; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .checkmark { font-size: 48px; }
            .step { background: #f8f5f0; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .step-number { display: inline-block; width: 28px; height: 28px; background: #1a1a1a; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; margin-right: 10px; font-weight: bold; }
            .cta-button { display: inline-block; background: #1a1a1a; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
            .cta-button:hover { background: #333; }
            .footer { background: #f8f5f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .tip-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 Read-a-thon</h1>
            </div>
            <div class="content">
              <div class="success-box">
                <div class="checkmark">✓</div>
                <p style="margin: 10px 0 0 0; font-size: 18px;"><strong>${childName}</strong> is enrolled!</p>
              </div>
              
              <p>Hi ${parentName},</p>
              <p>Welcome to Read-a-thon! We're excited to have <strong>${childName}</strong> join us on this reading adventure.</p>
              
              <h3 style="margin-top: 30px;">Here's how to get started:</h3>
              
              <div class="step">
                <span class="step-number">1</span>
                <strong>Invite sponsors</strong> — Share your family's pledge link with grandparents, aunts, uncles, and friends who want to support ${childName}'s reading.
              </div>
              
              <div class="step">
                <span class="step-number">2</span>
                <strong>Log reading time</strong> — Each day, log ${childName}'s reading minutes from your dashboard. Every minute counts!
              </div>
              
              <div class="step">
                <span class="step-number">3</span>
                <strong>Watch the progress</strong> — See ${childName}'s reading grow and track how much has been pledged.
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${familyPledgeUrl}" class="cta-button">Invite Sponsors</a>
                <a href="${dashboardUrl}" class="cta-button" style="background: #fff; color: #1a1a1a !important; border: 2px solid #1a1a1a;">Go to Dashboard</a>
              </div>
              
              <div class="tip-box">
                <p style="margin: 0;"><strong>💡 Pro Tip:</strong> The more sponsors you invite, the more motivated ${childName} will be to read! Even small pledges add up to make a big difference.</p>
              </div>
              
              <p style="margin-top: 30px;">Happy reading!<br>The Read-a-thon Team</p>
            </div>
            <div class="footer">
              <p>Questions? Just reply to this email — we're here to help!</p>
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
        to: [parentEmail],
        subject,
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Parent welcome email sent:", emailResult);

    // Log the email
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from("email_logs").insert({
      recipient_email: parentEmail,
      recipient_name: parentName,
      recipient_type: "parent",
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
    console.error("Error in send-parent-welcome function:", error);
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
