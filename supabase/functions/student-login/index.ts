import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import bcrypt from "https://esm.sh/bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STUDENT_EMAIL_DOMAIN = "student.readathon.local";

// Legacy: Verify password using bcrypt or SHA-256
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
    return bcrypt.compareSync(password, hash);
  }
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedUsername = username.toLowerCase().trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up student auth
    const { data: authRecord, error: authLookupError } = await supabase
      .from("student_auth")
      .select("child_id, password_hash, login_enabled")
      .eq("username", normalizedUsername)
      .maybeSingle();

    const invalidCredentialsResponse = new Response(
      JSON.stringify({ error: "Invalid username or password" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

    if (authLookupError || !authRecord) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      return invalidCredentialsResponse;
    }

    if (!authRecord.login_enabled) {
      return new Response(
        JSON.stringify({ error: "Student login is not enabled. Ask your parent to enable it." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if this student has been migrated to real auth (has student_user_id)
    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, name, total_minutes, goal_minutes, class_name, grade_info, student_user_id")
      .eq("id", authRecord.child_id)
      .single();

    if (childError || !child) {
      console.error("Child lookup error:", childError);
      return new Response(
        JSON.stringify({ error: "An error occurred. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If student has a real auth account, tell the client to use standard auth
    if (child.student_user_id) {
      return new Response(
        JSON.stringify({
          useStandardAuth: true,
          email: `${normalizedUsername}@${STUDENT_EMAIL_DOMAIN}`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Legacy flow: verify password hash directly
    if (!authRecord.password_hash) {
      return new Response(
        JSON.stringify({ error: "No password set. Ask your parent to set up your login." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isValid = await verifyPassword(password, authRecord.password_hash);
    if (!isValid) {
      return invalidCredentialsResponse;
    }

    // Legacy success - return child data
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
