import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { orderId, patientId, donorName, message } = await req.json();

  if (!orderId || !patientId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const accessToken = await getAccessToken();

  const captureRes = await fetch(
    `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const capture = await captureRes.json();

  if (capture.status === "COMPLETED") {
    const amount = parseFloat(
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ?? "0"
    );

    if (amount > 0) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase.from("donations").insert({
        patient_id: patientId,
        donor_name: donorName || "Anonymous",
        amount,
        message: message || null,
      });
    }
    return NextResponse.json({ success: true });
  }

  console.error("PayPal capture error:", capture);
  return NextResponse.json({ success: false, error: "Capture failed" }, { status: 400 });
}
