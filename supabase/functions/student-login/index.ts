import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple password hashing using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();

    // Input validation
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize username (lowercase, trim)
    const normalizedUsername = username.toLowerCase().trim();

    // Create Supabase client with service role for server-side auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up child by username
    const { data: child, error: lookupError } = await supabase
      .from("children")
      .select("id, name, total_minutes, goal_minutes, student_password_hash, student_login_enabled")
      .eq("student_username", normalizedUsername)
      .maybeSingle();

    if (lookupError) {
      console.error("Lookup error:", lookupError);
      return new Response(
        JSON.stringify({ error: "An error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generic error message to prevent username enumeration
    const invalidCredentialsResponse = new Response(
      JSON.stringify({ error: "Invalid username or password" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

    // Check if child exists
    if (!child) {
      // Add small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      return invalidCredentialsResponse;
    }

    // Check if login is enabled
    if (!child.student_login_enabled) {
      return new Response(
        JSON.stringify({ error: "Student login is not enabled. Ask your parent to enable it." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if password hash exists
    if (!child.student_password_hash) {
      return new Response(
        JSON.stringify({ error: "No password set. Ask your parent to set up your login." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, child.student_password_hash);
    if (!isValid) {
      return invalidCredentialsResponse;
    }

    // Success - return child data (excluding sensitive fields)
    return new Response(
      JSON.stringify({
        success: true,
        child: {
          id: child.id,
          name: child.name,
          totalMinutes: child.total_minutes,
          goalMinutes: child.goal_minutes,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Student login error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
