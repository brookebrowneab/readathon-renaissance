import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Look up sponsor by real email
    const { data: sponsor, error: sponsorError } = await adminClient
      .from("sponsors")
      .select("id, user_id, name, email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (sponsorError) {
      console.error("Sponsor lookup error:", sponsorError);
      // Don't reveal whether email exists — always return success
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!sponsor) {
      // Also check profiles table for sponsors who may have registered via auth
      // but don't reveal non-existence
      console.log("No sponsor found for email:", normalizedEmail);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Get the auth email for this user (may be synthetic)
    const { data: authUser, error: authError } = await adminClient.auth.admin.getUserById(
      sponsor.user_id
    );

    if (authError || !authUser?.user) {
      console.error("Auth user lookup error:", authError);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authEmail = authUser.user.email;
    if (!authEmail) {
      console.error("No auth email for user:", sponsor.user_id);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 3: Generate a magic link using the auth email
    const finalRedirect = redirectTo || `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/sponsor/dashboard`;

    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email: authEmail,
      options: {
        redirectTo: finalRedirect,
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("Generate magic link error:", linkError);
      return new Response(
        JSON.stringify({ error: "Failed to generate login link" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const magicLink = linkData.properties.action_link;

    // Step 4: Send the magic link to the sponsor's REAL email via Resend
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    const sponsorFirstName = sponsor.name?.split(" ")[0] || "Sponsor";

    const { error: emailError } = await resend.emails.send({
      from: "Read-a-thon <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Your login link for Janney Read-a-thon",
      html: `
        <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 24px; color: #1a1a1a; margin-bottom: 16px;">
            Hi ${sponsorFirstName}! 👋
          </h1>
          <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 24px;">
            Click the button below to sign in to your sponsor dashboard. No password needed!
          </p>
          <a href="${magicLink}" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 32px; 
                    border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
            Sign in to your dashboard →
          </a>
          <p style="font-size: 14px; color: #888; margin-top: 32px; line-height: 1.5;">
            This link expires in 24 hours. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #aaa;">
            Janney Elementary Read-a-thon
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Magic link email sent to ${normalizedEmail} for sponsor ${sponsor.id}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
