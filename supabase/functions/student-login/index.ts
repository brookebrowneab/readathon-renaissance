import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify password using bcrypt (also supports legacy SHA-256 hashes for migration)
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Check if it's a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
    return await bcrypt.compare(password, hash);
  }
  
  // Legacy SHA-256 hash support (64 hex characters)
  if (hash.length === 64 && /^[a-f0-9]+$/i.test(hash)) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return sha256Hash === hash;
  }
  
  return false;
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

    // Look up student auth by username (from separate secure table)
    const { data: authRecord, error: authLookupError } = await supabase
      .from("student_auth")
      .select("child_id, password_hash, login_enabled")
      .eq("username", normalizedUsername)
      .maybeSingle();

    if (authLookupError) {
      console.error("Auth lookup error:", authLookupError);
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

    // Check if auth record exists
    if (!authRecord) {
      // Add small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      return invalidCredentialsResponse;
    }

    // Check if login is enabled
    if (!authRecord.login_enabled) {
      return new Response(
        JSON.stringify({ error: "Student login is not enabled. Ask your parent to enable it." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if password hash exists
    if (!authRecord.password_hash) {
      return new Response(
        JSON.stringify({ error: "No password set. Ask your parent to set up your login." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, authRecord.password_hash);
    if (!isValid) {
      return invalidCredentialsResponse;
    }

    // Fetch child data (non-sensitive fields only)
    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, name, total_minutes, goal_minutes, class_name, grade_info")
      .eq("id", authRecord.child_id)
      .single();

    if (childError || !child) {
      console.error("Child lookup error:", childError);
      return new Response(
        JSON.stringify({ error: "An error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
          className: child.class_name,
          gradeInfo: child.grade_info,
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
