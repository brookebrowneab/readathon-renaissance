import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentReceiptRequest {
  payerEmail: string;
  payerName: string;
  amount: number;
  receiptUrl: string;
  studentNames: string[];
  className?: string;
  isClassPledge?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const {
      payerEmail,
      payerName,
      amount,
      receiptUrl,
      studentNames,
      className,
      isClassPledge,
    }: PaymentReceiptRequest = await req.json();

    if (!payerEmail) {
      console.log("No payer email provided, skipping receipt email");
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supportDescription = isClassPledge
      ? `${className}'s classroom`
      : studentNames.length === 1
      ? studentNames[0]
      : `${studentNames.length} students`;

    const studentListHtml = studentNames.length > 0
      ? `<ul style="margin: 10px 0; padding-left: 20px;">
          ${studentNames.map(name => `<li>${name}</li>`).join("")}
         </ul>`
      : "";

    const subject = `🎉 Payment Received - Thank You for Supporting the Read-a-thon!`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #16a34a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: #fff; margin: 0; font-weight: normal; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
            .receipt-box { background: #f0fdf4; border: 2px solid #22c55e; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .amount { font-size: 36px; color: #16a34a; font-weight: bold; }
            .check-icon { font-size: 48px; }
            .button { display: inline-block; background: #16a34a; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { background: #f8f5f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .students-section { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 Payment Confirmed!</h1>
            </div>
            <div class="content">
              <div class="check-icon" style="text-align: center;">✅</div>
              <p style="text-align: center; font-size: 18px;">Hi ${payerName || "Valued Sponsor"},</p>
              <p style="text-align: center;">Your payment has been successfully processed. Thank you for supporting ${supportDescription}!</p>
              
              <div class="receipt-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Payment Amount</p>
                <p class="amount">$${amount.toFixed(2)}</p>
                ${receiptUrl ? `<a href="${receiptUrl}" class="button" style="color: white;">View Square Receipt</a>` : ""}
              </div>
              
              ${studentNames.length > 0 ? `
              <div class="students-section">
                <p style="margin: 0 0 5px 0;"><strong>Students Supported:</strong></p>
                ${studentListHtml}
              </div>
              ` : ""}
              
              <p>Your generous contribution helps inspire a love of reading in our students. Every dollar makes a difference in building confident, enthusiastic readers!</p>
              
              <p style="margin-top: 30px;">With heartfelt thanks,<br>The Read-a-thon Team</p>
            </div>
            <div class="footer">
              <p>This is your payment confirmation for the Read-a-thon fundraiser.</p>
              <p>Questions? Reply to this email or contact your school's Read-a-thon coordinator.</p>
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
        to: [payerEmail],
        subject,
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Payment receipt email sent:", emailResult);

    // Log the email
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from("email_logs").insert({
      recipient_email: payerEmail,
      recipient_name: payerName,
      recipient_type: "sponsor",
      subject,
      body: htmlContent,
      status: emailResponse.ok ? "sent" : "failed",
      sent_at: new Date().toISOString(),
      error_message: emailResponse.ok ? null : JSON.stringify(emailResult),
    });

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-payment-receipt function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
