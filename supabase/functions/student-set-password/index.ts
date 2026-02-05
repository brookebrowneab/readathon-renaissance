import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STUDENT_EMAIL_DOMAIN = "student.readathon.local";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { childId, password, username } = await req.json();

    if (!childId || !password) {
      return new Response(
        JSON.stringify({ error: "Child ID and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's token to verify ownership
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get authenticated user (parent)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the child belongs to this parent
    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, user_id, student_user_id, name")
      .eq("id", childId)
      .maybeSingle();

    if (childError || !child) {
      return new Response(
        JSON.stringify({ error: "Child not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (child.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "You can only set passwords for your own children" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for admin operations
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Determine the username to use
    let finalUsername: string | null = null;
    if (username) {
      finalUsername = username.toLowerCase().trim();
    } else {
      // Check existing student_auth for username
      const { data: existingAuth } = await adminClient
        .from("student_auth")
        .select("username")
        .eq("child_id", childId)
        .maybeSingle();
      finalUsername = existingAuth?.username || null;
    }

    if (!finalUsername) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const studentEmail = `${finalUsername}@${STUDENT_EMAIL_DOMAIN}`;

    // Check if student already has an auth account
    if (child.student_user_id) {
      // Update existing auth account password
      const { error: updateError } = await adminClient.auth.admin.updateUserById(
        child.student_user_id,
        { password, email: studentEmail }
      );

      if (updateError) {
        console.error("Update user error:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update password" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Check if username is already taken by another student
      const { data: existingUsername } = await adminClient
        .from("student_auth")
        .select("child_id")
        .eq("username", finalUsername)
        .neq("child_id", childId)
        .maybeSingle();

      if (existingUsername) {
        return new Response(
          JSON.stringify({ error: "Username is already taken. Please choose a different one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create new auth account for student
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: studentEmail,
        password,
        email_confirm: true, // Auto-confirm since these are managed accounts
        user_metadata: {
          display_name: child.name,
          is_student: true,
          child_id: childId,
        },
      });

      if (createError) {
        console.error("Create user error:", createError);
        // Check for duplicate email (shouldn't happen but just in case)
        if (createError.message?.includes("already been registered")) {
          return new Response(
            JSON.stringify({ error: "Username is already taken. Please choose a different one." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({ error: "Failed to create student account" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Link the auth account to the child record
      const { error: linkError } = await adminClient
        .from("children")
        .update({ student_user_id: newUser.user.id })
        .eq("id", childId);

      if (linkError) {
        console.error("Link error:", linkError);
        // Clean up: delete the orphaned auth account
        await adminClient.auth.admin.deleteUser(newUser.user.id);
        return new Response(
          JSON.stringify({ error: "Failed to link student account" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Add 'student' role
      const { error: roleError } = await adminClient
        .from("user_roles")
        .upsert(
          { user_id: newUser.user.id, role: "student" },
          { onConflict: "user_id,role" }
        );

      if (roleError) {
        console.error("Role assignment error:", roleError);
        // Non-fatal, continue
      }
    }

    // Upsert student_auth record (keep for metadata like login_enabled, username)
    const authData: { child_id: string; username: string; login_enabled: boolean } = {
      child_id: childId,
      username: finalUsername,
      login_enabled: true,
    };

    const { error: upsertError } = await adminClient
      .from("student_auth")
      .upsert(authData, { onConflict: "child_id" });

    if (upsertError) {
      console.error("Upsert student_auth error:", upsertError);
      if (upsertError.code === "23505" && upsertError.message?.includes("username")) {
        return new Response(
          JSON.stringify({ error: "Username is already taken. Please choose a different one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Non-fatal for the main auth flow
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Set password error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
