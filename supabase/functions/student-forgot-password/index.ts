import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();

    // Input validation
    if (!username || username.length < 3) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid username" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize username
    const normalizedUsername = username.toLowerCase().trim();

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up child by username
    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, name, user_id, student_username")
      .eq("student_username", normalizedUsername)
      .maybeSingle();

    // Always return success to prevent username enumeration
    const successResponse = new Response(
      JSON.stringify({ 
        success: true, 
        message: "If this username exists, we've notified the parent." 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

    if (childError || !child) {
      // Don't reveal that username doesn't exist
      console.log("Username not found:", normalizedUsername);
      return successResponse;
    }

    // Get parent's email from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(child.user_id);

    if (authError || !authUser?.user?.email) {
      console.error("Could not find parent email:", authError);
      return successResponse;
    }

    const parentEmail = authUser.user.email;
    const parentName = authUser.user.user_metadata?.display_name || "Parent";

    // Send email to parent
    try {
      await resend.emails.send({
        from: "Read-a-thon <notifications@resend.dev>",
        to: [parentEmail],
        subject: `${child.name} needs help logging in`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Password Reset Request</h1>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              Hi ${parentName},
            </p>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              <strong>${child.name}</strong> tried to log in to their Read-a-thon account but couldn't remember their password.
            </p>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              Their username is: <code style="background: #f4f4f4; padding: 2px 6px; border-radius: 4px;">${child.student_username}</code>
            </p>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              To reset their password:
            </p>
            
            <ol style="color: #4a4a4a; font-size: 16px; line-height: 1.8;">
              <li>Log in to your Read-a-thon parent account</li>
              <li>Go to <strong>Manage Children</strong></li>
              <li>Click <strong>Edit</strong> on ${child.name}'s profile</li>
              <li>Enter a new password in the Student Login section</li>
              <li>Save the changes</li>
            </ol>
            
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
              Then share the new password with ${child.name} so they can log in!
            </p>
            
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            
            <p style="color: #8a8a8a; font-size: 14px;">
              This email was sent because someone requested a password reset for the student account "${child.student_username}". 
              If this wasn't you or your child, you can safely ignore this email.
            </p>
          </div>
        `,
      });

      console.log("Password reset email sent to parent for child:", child.name);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Still return success to not reveal information
    }

    return successResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
