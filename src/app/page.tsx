import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { getPatients } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";
import { usd } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Small Fighters — Support a Child's Journey",
  description:
    "Every child deserves a fighting chance. Choose a child and help them thrive today.",
};

function PatientCard({ patient }: { patient: Patient }) {
  const pct = Math.min(100, Math.round((patient.raised_amount / patient.goal_amount) * 100));

  return (
    <Link
      href={`/fundraiser/${patient.id}`}
      className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-md hover:ring-teal-200 active:scale-[0.98]"
    >
      {/* Photo */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
        {patient.cover_image_url ? (
          <Image
            src={patient.cover_image_url}
            alt={patient.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200">
            <span className="font-fraunces text-2xl font-bold text-teal-500">
              {patient.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-fraunces text-base font-semibold text-gray-900">
              {patient.name}
            </p>
            <p className="text-xs text-gray-400">
              {patient.condition} &middot; Age {patient.age}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-teal-600">
            <span className="text-xs font-semibold">{pct}%</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          <span className="font-semibold text-teal-600">{usd(patient.raised_amount)}</span>
          {" "}raised of{" "}
          <span className="font-medium text-gray-500">{usd(patient.goal_amount)}</span>
        </p>
      </div>
    </Link>
  );
}

export default async function LinkPage() {
  const patients = await getPatients();
  const totalRaised = patients.reduce((sum, p) => sum + p.raised_amount, 0);

  return (
    <div className="min-h-screen bg-[#FDF8F4]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-teal-50 px-4 pb-10 pt-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-coral-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-teal-200/30 blur-3xl" />

        <div className="relative mx-auto flex max-w-sm flex-col items-center gap-5 text-center">
          {/* Logo */}
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-coral-400 to-coral-600 shadow-lg shadow-coral-200">
            <Heart className="h-8 w-8 text-white" fill="white" />
          </div>

          <div>
            <h1 className="font-fraunces text-3xl font-bold text-gray-900">
              Small Fighters
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Behind every name is a child full of hope.
              <br />
              Your kindness can help them heal.
            </p>
          </div>

          {/* Stats pill */}
          {patients.length > 0 && (
            <div className="flex items-center gap-6 rounded-2xl bg-white/80 px-6 py-3 shadow-sm backdrop-blur-sm ring-1 ring-white">
              <div className="text-center">
                <p className="font-fraunces text-xl font-bold text-teal-700">
                  {patients.length}
                </p>
                <p className="text-xs text-gray-400">Children</p>
              </div>
              <div className="h-8 w-px bg-gray-100" />
              <div className="text-center">
                <p className="font-fraunces text-xl font-bold text-teal-700">
                  {usd(totalRaised)}
                </p>
                <p className="text-xs text-gray-400">Raised</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-sm px-4 py-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Choose a child to support
        </p>

        {patients.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">No active campaigns right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </div>

      {/* ── Trust footer ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-sm space-y-3 px-4 pb-10">
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 ring-1 ring-teal-100">
          <ShieldCheck className="h-4 w-4 shrink-0 text-teal-500" />
          <p className="text-xs font-medium text-teal-700">
            100% of donations go directly to the child&apos;s care
          </p>
        </div>
        <p className="text-center text-xs text-gray-300">smallfighters.netlify.app</p>
      </div>

    </div>
  );
}
