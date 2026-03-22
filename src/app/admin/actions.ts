"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import type { NewPatient } from "@/lib/supabase";

export async function addPatient(data: NewPatient) {
  const supabase = createSupabaseServer();
  const { error } = await supabase.from("patients").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updatePatient(id: string, data: Partial<NewPatient>) {
  const supabase = createSupabaseServer();
  const { error } = await supabase.from("patients").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/fundraiser/${id}`);
}

export async function toggleActive(id: string, current: boolean) {
  const supabase = createSupabaseServer();
  const { error } = await supabase
    .from("patients")
    .update({ is_active: !current })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deletePatient(id: string) {
  const supabase = createSupabaseServer();
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function signOut() {
  const supabase = createSupabaseServer();
  await supabase.auth.signOut();
}
