import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CheckPaymentRequest {
  pledgeIds: string[];
  sponsorName: string;
  sponsorEmail: string;
  totalAmount: number;
  childNames: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pledgeIds, sponsorName, sponsorEmail, totalAmount, childNames }: CheckPaymentRequest = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update pledges to mark as pending check payment
    const { error: updateError } = await supabase
      .from("pledges")
      .update({ 
        payment_status: "pending_check",
        expected_payment_method: "check"
      })
      .in("id", pledgeIds);

    if (updateError) {
      console.error("Error updating pledges:", updateError);
      throw new Error(`Failed to update pledges: ${updateError.message}`);
    }

    // Send notification email to organizers via Resend API
    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3760AC; font-size: 24px;">New Check Payment Notification</h1>
        
        <p>A sponsor has committed to mailing a check for their Read-a-thon pledge.</p>
        
        <div style="background: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; font-size: 18px;">Payment Details</h2>
          <p><strong>Sponsor:</strong> ${sponsorName}</p>
          <p><strong>Email:</strong> ${sponsorEmail}</p>
          <p><strong>Amount:</strong> $${totalAmount.toFixed(2)}</p>
          <p><strong>Student(s):</strong> ${childNames.join(", ")}</p>
        </div>
        
        <p style="color: #666;">
          Please watch for this check in the mail. Once received, you can mark it as paid in the admin dashboard.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated notification from the Janney Read-a-thon platform.
        </p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Janney Read-a-thon <onboarding@resend.dev>",
        to: ["janneyreadathon@janneyschool.org"],
        subject: `Check Payment Incoming: ${sponsorName} - $${totalAmount.toFixed(2)}`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Pledges updated and organizers notified",
        emailResult 
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
    console.error("Error in notify-check-payment function:", error);
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
