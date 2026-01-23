import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Recipient {
  email: string;
  name: string;
  type: string;
  variables?: Record<string, string>;
}

interface SendTemplateRequest {
  templateId?: string;
  subject: string;
  body: string;
  recipients: Recipient[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templateId, subject, body, recipients }: SendTemplateRequest = await req.json();

    if (!recipients || recipients.length === 0) {
      throw new Error("No recipients provided");
    }

    if (!subject || !body) {
      throw new Error("Subject and body are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: { email: string; success: boolean; error?: string }[] = [];

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      
      // Add delay between emails to avoid rate limiting (2 req/sec limit)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Replace variables in subject and body
      let personalizedSubject = subject;
      let personalizedBody = body;
      
      if (recipient.variables) {
        for (const [key, value] of Object.entries(recipient.variables)) {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
          personalizedSubject = personalizedSubject.replace(regex, value);
          personalizedBody = personalizedBody.replace(regex, value);
        }
      }

      // Wrap body in HTML template
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
              .footer { background: #f8f5f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📚 Read-a-thon</h1>
              </div>
              <div class="content">
                ${personalizedBody.replace(/\n/g, '<br>')}
              </div>
              <div class="footer">
                <p>You're receiving this email from the Read-a-thon team.</p>
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
            to: [recipient.email],
            subject: personalizedSubject,
            html: htmlContent,
          }),
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error("Failed to send email:", emailResult);
          results.push({ email: recipient.email, success: false, error: emailResult.message || "Failed to send" });
          
          // Log failed email
          await supabase.from("email_logs").insert({
            template_id: templateId || null,
            recipient_email: recipient.email,
            recipient_name: recipient.name,
            recipient_type: recipient.type,
            subject: personalizedSubject,
            body: htmlContent,
            status: "failed",
            error_message: emailResult.message || "Failed to send",
          });
          continue;
        }

        console.log("Email sent successfully:", emailResult);

        // Log successful email
        await supabase.from("email_logs").insert({
          template_id: templateId || null,
          recipient_email: recipient.email,
          recipient_name: recipient.name,
          recipient_type: recipient.type,
          subject: personalizedSubject,
          body: htmlContent,
          status: "sent",
          sent_at: new Date().toISOString(),
        });

        results.push({ email: recipient.email, success: true });
      } catch (emailError: any) {
        console.error("Error sending email to:", recipient.email, emailError);
        results.push({ email: recipient.email, success: false, error: emailError.message });
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
    console.error("Error in send-template-email function:", error);
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
