import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  sourceId: string; // Token from Square Web Payments SDK
  amount: number; // Amount in dollars
  pledgeIds?: string[]; // Individual pledges
  classPledgeId?: string; // Class pledge (guest payment)
  payerName: string;
  payerEmail: string;
  idempotencyKey: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const SQUARE_APPLICATION_ID = Deno.env.get("SQUARE_APPLICATION_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SQUARE_ACCESS_TOKEN) {
      throw new Error("SQUARE_ACCESS_TOKEN is not configured");
    }
    if (!SQUARE_APPLICATION_ID) {
      throw new Error("SQUARE_APPLICATION_ID is not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const body: PaymentRequest = await req.json();
    const { sourceId, amount, pledgeIds, classPledgeId, payerName, payerEmail, idempotencyKey } = body;

    if (!sourceId || !amount || !idempotencyKey) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: sourceId, amount, idempotencyKey" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!pledgeIds?.length && !classPledgeId) {
      return new Response(
        JSON.stringify({ error: "Must provide either pledgeIds or classPledgeId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert dollars to cents for Square API
    const amountCents = Math.round(amount * 100);

    // Determine Square environment (sandbox vs production)
    const isSandbox = SQUARE_ACCESS_TOKEN.startsWith("EAAAl") || SQUARE_ACCESS_TOKEN.includes("sandbox");
    const squareBaseUrl = isSandbox
      ? "https://connect.squareupsandbox.com"
      : "https://connect.squareup.com";

    // Process payment with Square
    const squareResponse = await fetch(`${squareBaseUrl}/v2/payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-01-18",
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
          amount: amountCents,
          currency: "USD",
        },
        buyer_email_address: payerEmail,
        note: `Read-a-thon donation from ${payerName}`,
        autocomplete: true,
      }),
    });

    const squareData = await squareResponse.json();

    if (!squareResponse.ok || squareData.errors) {
      console.error("Square payment error:", squareData);
      const errorMessage = squareData.errors?.[0]?.detail || "Payment processing failed";
      return new Response(
        JSON.stringify({ error: errorMessage, details: squareData.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payment = squareData.payment;
    const squarePaymentId = payment.id;
    const squareReceiptUrl = payment.receipt_url;

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Record payment and update pledge status
    if (pledgeIds?.length) {
      // Individual pledge payments
      for (const pledgeId of pledgeIds) {
        // Get pledge details for student name
        const { data: pledge } = await supabase
          .from("pledges")
          .select("student_name, amount, pledge_type, child:children(total_minutes)")
          .eq("id", pledgeId)
          .single();

        // Handle child as array from join
        const childData = Array.isArray(pledge?.child) ? pledge.child[0] : pledge?.child;
        const pledgeAmount = pledge?.pledge_type === "per_minute" && childData
          ? pledge.amount * (childData.total_minutes || 0)
          : pledge?.amount || 0;

        // Create payment record
        await supabase.from("payments").insert({
          pledge_id: pledgeId,
          amount: pledgeAmount,
          payment_method: "card",
          payer_name: payerName,
          payer_email: payerEmail,
          square_payment_id: squarePaymentId,
          square_receipt_url: squareReceiptUrl,
          pledge_type: pledge?.pledge_type || "flat",
          student_name: pledge?.student_name,
        });

        // Update pledge status
        await supabase
          .from("pledges")
          .update({ 
            is_paid: true, 
            payment_status: "paid",
            final_amount: pledgeAmount,
            finalized_at: new Date().toISOString(),
          })
          .eq("id", pledgeId);
      }
    } else if (classPledgeId) {
      // Class pledge (guest) payment
      const { data: classPledge } = await supabase
        .from("class_pledges")
        .select("class_name, amount")
        .eq("id", classPledgeId)
        .single();

      // Create payment record
      await supabase.from("payments").insert({
        class_pledge_id: classPledgeId,
        amount: classPledge?.amount || amount,
        payment_method: "card",
        payer_name: payerName,
        payer_email: payerEmail,
        square_payment_id: squarePaymentId,
        square_receipt_url: squareReceiptUrl,
        pledge_type: "flat",
      });

      // Update class pledge status
      await supabase
        .from("class_pledges")
        .update({ is_paid: true, payment_status: "paid" })
        .eq("id", classPledgeId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentId: squarePaymentId,
        receiptUrl: squareReceiptUrl,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Payment processing error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});