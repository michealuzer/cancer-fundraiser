import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getAllPatients } from "@/lib/supabase";
import AdminDashboard from "./AdminDashboard";

export const metadata = { title: "Admin — Small Fighters" };

export default async function AdminPage() {
  const supabase = createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/admin/login");

  const patients = await getAllPatients();

  return <AdminDashboard patients={patients} userEmail={session.user.email ?? ""} />;
}
