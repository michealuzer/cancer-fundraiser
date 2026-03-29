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

// PayPal redirects here after the donor approves payment.
// URL params: token (PayPal order ID), PayerID, plus our custom params.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("token"); // PayPal always sends this as "token"
  const patientId = searchParams.get("patient_id");
  const donorName = searchParams.get("donor_name") || "Anonymous";
  const message = searchParams.get("message") || "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smallfighters.netlify.app";

  if (!orderId || !patientId) {
    return NextResponse.redirect(`${siteUrl}`);
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
        donor_name: donorName,
        amount,
        message: message || null,
      });
    }

    return NextResponse.redirect(`${siteUrl}/fundraiser/${patientId}?donated=1`);
  }

  // Payment failed or was cancelled mid-flow
  console.error("PayPal capture failed:", capture);
  return NextResponse.redirect(`${siteUrl}/fundraiser/${patientId}?error=payment`);
}
