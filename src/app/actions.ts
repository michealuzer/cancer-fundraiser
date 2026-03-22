"use server";

import { revalidatePath } from "next/cache";
import { createDonation } from "@/lib/supabase";

export async function submitDonation(payload: {
  patient_id: string;
  donor_name: string;
  amount: number;
  message: string;
}) {
  if (!payload.patient_id) throw new Error("Missing patient ID");
  if (!payload.amount || payload.amount <= 0) throw new Error("Invalid amount");

  await createDonation({
    patient_id: payload.patient_id,
    donor_name: payload.donor_name.trim() || "Anonymous",
    amount: payload.amount,
    message: payload.message.trim() || null,
  });

  revalidatePath(`/fundraiser/${payload.patient_id}`);
}
