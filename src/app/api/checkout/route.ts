import { NextRequest, NextResponse } from "next/server";

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
  const { patientId, patientName, amount, donorName, message } = await req.json();

  if (!patientId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smallfighters.netlify.app";
  const accessToken = await getAccessToken();

  // Build return URL — PayPal appends ?token=ORDER_ID automatically
  const returnUrl = new URL(`${siteUrl}/api/capture`);
  returnUrl.searchParams.set("patient_id", patientId);
  returnUrl.searchParams.set("donor_name", donorName || "Anonymous");
  returnUrl.searchParams.set("message", message || "");

  const orderRes = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: Number(amount).toFixed(2) },
          description: `Donation for ${patientName} — Small Fighters`,
        },
      ],
      application_context: {
        brand_name: "Small Fighters",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: returnUrl.toString(),
        cancel_url: `${siteUrl}/fundraiser/${patientId}`,
      },
    }),
  });

  const order = await orderRes.json();
  const approvalUrl = (order.links as Array<{ rel: string; href: string }>)?.find(
    (l) => l.rel === "approve"
  )?.href;

  if (!approvalUrl) {
    console.error("PayPal order error:", order);
    return NextResponse.json({ error: "Could not create PayPal order" }, { status: 500 });
  }

  return NextResponse.json({ url: approvalUrl });
}
