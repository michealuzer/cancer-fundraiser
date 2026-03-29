import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { patientId, patientName, amount, donorName, message } = await req.json();

  if (!patientId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smallfighters.netlify.app";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Donate to ${patientName}`,
            description: "100% of your donation goes directly to this child's care.",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${siteUrl}/fundraiser/${patientId}?donated=1`,
    cancel_url: `${siteUrl}/fundraiser/${patientId}`,
    metadata: {
      patient_id: patientId,
      donor_name: donorName || "Anonymous",
      message: message || "",
    },
  });

  return NextResponse.json({ url: session.url });
}
