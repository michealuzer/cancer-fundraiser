import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { getPatients } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";
import { usd } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Small Fighters — Support a Child",
  description:
    "Every child on this page is fighting for their life. Choose a fighter and make a difference today.",
};

function conditionColor(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes("cancer") || c.includes("leukemia") || c.includes("tumor"))
    return "bg-rose-900/60 text-rose-200";
  if (c.includes("anemia") || c.includes("sickle"))
    return "bg-amber-900/60 text-amber-200";
  if (c.includes("surgery") || c.includes("heart") || c.includes("cardiac"))
    return "bg-teal-800/60 text-teal-200";
  if (c.includes("transplant") || c.includes("marrow"))
    return "bg-purple-900/60 text-purple-200";
  return "bg-white/10 text-white/70";
}

// ── Patient card ──────────────────────────────────────────────────────────────

function PatientCard({ patient }: { patient: Patient }) {
  const pct = Math.min(100, Math.round((patient.raised_amount / patient.goal_amount) * 100));
  const urgency = pct < 30 ? "critical" : pct < 60 ? "active" : "close";

  const barColor =
    urgency === "critical" ? "bg-rose-400" :
    urgency === "active"   ? "bg-amber-400" :
                             "bg-emerald-400";

  return (
    <Link
      href={`/fundraiser/${patient.id}`}
      className="group flex items-center gap-4 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.12] hover:ring-white/20 active:scale-[0.98]"
    >
      {/* Circular photo */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
        {patient.cover_image_url ? (
          <Image
            src={patient.cover_image_url}
            alt={patient.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-teal-800">
            <span className="font-fraunces text-2xl font-bold text-teal-300">
              {patient.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-fraunces text-base font-semibold leading-tight text-white">
              {patient.name}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${conditionColor(patient.condition)}`}
            >
              {patient.condition}
            </span>
          </div>
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-white/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/50">
              <span className="font-medium text-white/80">{usd(patient.raised_amount)}</span>
              {" "}raised
            </p>
            <p className="text-xs font-medium text-white/40">{pct}%</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LinkPage() {
  const patients = await getPatients();

  return (
    <div className="min-h-screen bg-teal-950 px-4 py-10">
      {/* Subtle radial glow behind header */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-700/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-sm flex-col gap-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 pt-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-500/90 shadow-lg shadow-coral-700/30">
            <Heart className="h-6 w-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-fraunces text-2xl font-bold text-white">Small Fighters</h1>
            <p className="mt-1 text-sm leading-relaxed text-white/50">
              Every child here is fighting for their life.
              <br />Pick one to support today.
            </p>
          </div>
        </div>

        {/* ── Cards ───────────────────────────────────────────────────── */}
        {patients.length === 0 ? (
          <div className="rounded-2xl bg-white/5 p-8 text-center">
            <p className="text-sm text-white/40">No active campaigns right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 pb-4 pt-2">
          <div className="h-px w-16 bg-white/10" />
          <p className="text-center text-xs text-white/30">
            100% of donations go directly to the child&apos;s care.
          </p>
          <Link
            href="/"
            className="text-xs text-white/20 transition-colors hover:text-white/40"
          >
            smallfighters.netlify.app
          </Link>
        </div>

      </div>
    </div>
  );
}
