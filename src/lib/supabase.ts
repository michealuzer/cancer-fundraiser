import { createClient } from "@supabase/supabase-js";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  story: string | null;
  cover_image_url: string | null;
  goal_amount: number;
  raised_amount: number;
  is_active: boolean;
  created_at: string;
}

export interface Donation {
  id: string;
  patient_id: string;
  donor_name: string;
  amount: number;
  message: string | null;
  created_at: string;
}

export type NewDonation = Omit<Donation, "id" | "created_at">;
export type NewPatient  = Omit<Patient,  "id" | "created_at" | "raised_amount">;

// ── Client ────────────────────────────────────────────────────────────────────

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ── Patients ──────────────────────────────────────────────────────────────────

/** Fetch all active patients ordered by most recently created. */
export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Fetch a single patient by id. */
export async function getPatient(id: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ── Donations ─────────────────────────────────────────────────────────────────

/** Fetch all donations for a patient, newest first. */
export async function getDonations(patientId: string): Promise<Donation[]> {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Insert a new donation. The trigger will update raised_amount automatically. */
export async function createDonation(donation: NewDonation): Promise<Donation> {
  const { data, error } = await supabase
    .from("donations")
    .insert(donation)
    .select()
    .single();

  if (error) throw error;
  return data;
}
