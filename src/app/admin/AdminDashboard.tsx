"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import PatientForm from "./PatientForm";
import ManageTable from "./ManageTable";
import type { Patient } from "@/lib/supabase";
import { Heart, LogOut } from "lucide-react";
import Link from "next/link";

interface Props {
  patients: Patient[];
  userEmail: string;
}

export default function AdminDashboard({ patients, userEmail }: Props) {
  const [editing, setEditing] = useState<Patient | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  function handleSignOut() {
    startTransition(async () => {
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700">
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <div>
              <p className="font-fraunces text-sm font-semibold text-gray-900">Small Fighters Admin</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-teal-700">
              View site ↗
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-gray-500">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

          {/* ── Left: Add / Edit form ── */}
          <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:w-96 lg:shrink-0">
            <PatientForm
              editing={editing}
              onDone={() => setEditing(null)}
            />
          </div>

          {/* ── Right: Manage table ── */}
          <div className="min-w-0 flex-1 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="font-fraunces text-xl font-semibold text-gray-800">
                Manage Fundraisers
              </h2>
              <p className="text-sm text-gray-400">
                {patients.length} campaign{patients.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <div className="p-2">
              <ManageTable
                patients={patients}
                onEdit={(p) => {
                  setEditing(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
