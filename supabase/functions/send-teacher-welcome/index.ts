import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  teacherName: string;
  teacherEmail: string;
  dashboardUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { teacherName, teacherEmail, dashboardUrl }: WelcomeEmailRequest = await req.json();

    if (!teacherEmail || !teacherName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Read-a-thon <onboarding@resend.dev>",
      to: [teacherEmail],
      subject: "Welcome to Read-a-thon! Your Teacher Dashboard is Ready",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">📚 Welcome to Read-a-thon!</h1>
          </div>
          
          <p style="font-size: 18px;">Dear ${teacherName},</p>
          
          <p>Great news! Your teacher account has been successfully linked. You now have full access to the Teacher Dashboard where you can track your students' reading progress.</p>
          
          <div style="background-color: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">What you can do:</h3>
            <ul style="margin-bottom: 0;">
              <li>View all your students' reading progress at a glance</li>
              <li>See detailed reading logs and activity</li>
              <li>Track who's on target to meet their reading goals</li>
              <li>Search and filter students easily</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Go to Your Dashboard
            </a>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0;"><strong>💡 Tip:</strong> Bookmark your dashboard for quick access: <a href="${dashboardUrl}" style="color: #2563eb;">${dashboardUrl}</a></p>
          </div>
          
          <p>If you have any questions or need assistance, please contact your school administrator.</p>
          
          <p>Happy Reading!<br>
          <em>The Read-a-thon Team</em></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent because your account was linked to a teacher profile in the Read-a-thon system.
          </p>
        </body>
        </html>
      `,
    });

    console.log("Teacher welcome email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending teacher welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
