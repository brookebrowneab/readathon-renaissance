import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Secure password hashing using bcrypt with automatic salting
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12); // Cost factor of 12 (recommended)
  return await bcrypt.hash(password, salt);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
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

    // Input validation
    if (!childId || !password) {
      return new Response(
        JSON.stringify({ error: "Child ID and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Password requirements
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

    // Get authenticated user
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
      .select("id, user_id")
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

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Update the student_auth table using service role
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert into student_auth table (insert or update)
    const authData: { child_id: string; password_hash: string; username?: string; login_enabled?: boolean } = {
      child_id: childId,
      password_hash: passwordHash,
    };
    
    // If username is provided, include it
    if (username) {
      authData.username = username.toLowerCase().trim();
      authData.login_enabled = true;
    }

    const { error: upsertError } = await adminClient
      .from("student_auth")
      .upsert(authData, { onConflict: "child_id" });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      // Check for unique constraint violation on username
      if (upsertError.code === "23505" && upsertError.message?.includes("username")) {
        return new Response(
          JSON.stringify({ error: "Username is already taken. Please choose a different one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Failed to update password" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
