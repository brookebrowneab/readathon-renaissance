// Bootstrap admin role assignment
//
// Allows the *first* authenticated user to become an admin (when no admins exist yet).
// If an admin already exists, only an existing admin may grant themselves admin via this endpoint.
//
// This is intended for initial setup only.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });

serve(async (req) => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return json(500, { error: "Server misconfiguration" });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json(401, { error: "Missing Authorization header" });
  }

  // Get the caller user using the caller's JWT.
  const userClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return json(401, { error: "Invalid session" });
  }

  // Use service role to bypass RLS for role assignment.
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: anyAdminRows, error: anyAdminError } = await adminClient
    .from("user_roles")
    .select("id")
    .eq("role", "admin")
    .limit(1);

  if (anyAdminError) {
    return json(500, { error: "Failed checking existing admins" });
  }

  const hasAnyAdmin = (anyAdminRows?.length ?? 0) > 0;

  if (hasAnyAdmin) {
    // If an admin already exists, only an existing admin can use this endpoint.
    const { data: isAdminRow, error: isAdminError } = await adminClient
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (isAdminError || !isAdminRow) {
      return json(403, { error: "Admin already exists" });
    }
  }

  const { error: insertError } = await adminClient.from("user_roles").insert({
    user_id: user.id,
    role: "admin",
  });

  // If they already have the role, consider it success.
  if (insertError && !/duplicate key value|already exists/i.test(insertError.message)) {
    return json(500, { error: "Failed assigning admin role" });
  }

  return json(200, { ok: true });
});
