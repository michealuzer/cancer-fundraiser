import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Heart, Users } from "lucide-react";
import { getPatient, getDonations } from "@/lib/supabase";
import { usd } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import DonateSection from "./DonateSection";
import MobileDonateBar from "./MobileDonateBar";
import DonationSuccessBanner from "./DonationSuccessBanner";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function conditionStyle(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes("cancer") || c.includes("leukemia") || c.includes("tumor"))
    return "bg-red-50 text-red-700 border-red-200";
  if (c.includes("anemia") || c.includes("anaemia") || c.includes("sickle"))
    return "bg-orange-50 text-orange-700 border-orange-200";
  if (c.includes("surgery") || c.includes("heart") || c.includes("cardiac"))
    return "bg-teal-50 text-teal-700 border-teal-200";
  if (c.includes("transplant") || c.includes("marrow"))
    return "bg-purple-50 text-purple-700 border-purple-200";
  if (c.includes("rehab") || c.includes("spinal"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-50 text-gray-600 border-gray-200";
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const patient = await getPatient(params.id);
  if (!patient) return { title: "Not found" };
  return {
    title: `Help ${patient.name} — Small Fighters`,
    description: patient.story?.slice(0, 155) ?? `Support ${patient.name}'s medical journey.`,
  };
}

export default async function FundraiserPage({ params }: { params: { id: string } }) {
  const [patient, donations] = await Promise.all([
    getPatient(params.id),
    getDonations(params.id),
  ]);

  if (!patient) notFound();

  const pct = Math.min(100, Math.round((patient.raised_amount / patient.goal_amount) * 100));
  const pageUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://smallfighters.netlify.app"
  }/fundraiser/${patient.id}`;
  const remaining = patient.goal_amount - patient.raised_amount;

  return (
    <div className="min-h-screen bg-[#FDF8F4]">

      {/* ── Cover image ──────────────────────────────────────────────── */}
      <div className="relative h-72 w-full overflow-hidden bg-teal-100 md:h-[460px]">
        {patient.cover_image_url ? (
          <Image
            src={patient.cover_image_url}
            alt={`${patient.name}'s cover photo`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-coral-100">
            <span className="font-fraunces text-9xl font-bold text-teal-300">
              {patient.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Name badge over image */}
        <div className="absolute bottom-6 left-6 right-6">
          <p className="font-fraunces text-3xl font-bold text-white drop-shadow-md md:text-4xl">
            Help {patient.name} heal
          </p>
          <p className="mt-1 text-sm text-white/80">
            Age {patient.age} &middot; {patient.condition}
          </p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-6xl px-4 py-8 pb-28 lg:pb-10">

        {/* Success banner */}
        <Suspense fallback={null}>
          <DonationSuccessBanner />
        </Suspense>

        <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-start">

          {/* ── Main content ─────────────────────────────────────────── */}
          <div className="min-w-0 flex-1 space-y-8">

            {/* Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-fraunces text-4xl font-bold text-gray-900 md:text-5xl">
                  {patient.name}
                </h1>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                  Age {patient.age}
                </span>
              </div>
              <span
                className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${conditionStyle(patient.condition)}`}
              >
                {patient.condition}
              </span>
            </div>

            {/* Mobile progress */}
            <div className="space-y-2 lg:hidden">
              <div className="flex items-end justify-between">
                <p className="font-fraunces text-2xl font-bold text-teal-700">
                  {usd(patient.raised_amount)}
                  <span className="ml-1 text-base font-normal text-gray-400">raised</span>
                </p>
                <p className="text-sm text-gray-500">Goal: {usd(patient.goal_amount)}</p>
              </div>
              <Progress value={pct} className="h-3" />
              <p className="text-right text-sm font-medium text-teal-600">{pct}% funded</p>
            </div>

            {/* Warm motivational banner */}
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-4 ring-1 ring-amber-100">
              <Heart className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="currentColor" />
              <p className="text-sm leading-relaxed text-amber-800">
                <span className="font-semibold">{patient.name} needs your help.</span>{" "}
                {remaining > 0
                  ? `Just ${usd(remaining)} more is needed to reach the goal. Every dollar counts.`
                  : `The goal has been reached! Extra donations continue to support ongoing care.`}
              </p>
            </div>

            {/* Story */}
            <div className="space-y-4">
              <h2 className="font-fraunces text-2xl font-semibold text-gray-800">
                {patient.name}&apos;s Story
              </h2>
              <div className="prose prose-gray max-w-none">
                {(patient.story ?? "").split("\n").map((para, i) => (
                  <p key={i} className="text-base leading-8 text-gray-600">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <div className="w-full space-y-5 lg:sticky lg:top-24 lg:w-80 lg:shrink-0">

            {/* Progress card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-1 flex items-end justify-between">
                <p className="font-fraunces text-3xl font-bold text-teal-700">
                  {usd(patient.raised_amount)}
                </p>
                <p className="text-sm font-semibold text-teal-500">{pct}%</p>
              </div>
              <Progress value={pct} className="mb-2 h-3" />
              <p className="text-sm text-gray-500">
                raised of{" "}
                <span className="font-semibold text-gray-700">{usd(patient.goal_amount)}</span> goal
              </p>
              {remaining > 0 && (
                <p className="mt-2 text-xs font-medium text-amber-600">
                  {usd(remaining)} still needed
                </p>
              )}
            </div>

            {/* Donate + share */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <DonateSection
                patientId={patient.id}
                patientName={patient.name}
                pageUrl={pageUrl}
                donorCount={donations.length}
              />
            </div>

            {/* Recent supporters */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-500" />
                <h3 className="font-fraunces text-lg font-semibold text-gray-800">
                  Supporters
                </h3>
                {donations.length > 0 && (
                  <span className="ml-auto rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                    {donations.length}
                  </span>
                )}
              </div>

              {donations.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-400">
                    Be the first to support {patient.name}!
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {donations.slice(0, 8).map((d) => (
                    <li key={d.id} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 text-xs font-bold text-teal-700">
                        {d.donor_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-medium text-gray-800">
                            {d.donor_name}
                          </p>
                          <span className="shrink-0 text-xs font-semibold text-teal-600">
                            {usd(d.amount)}
                          </span>
                        </div>
                        {d.message && (
                          <p className="mt-0.5 line-clamp-2 text-xs italic text-gray-500">
                            &ldquo;{d.message}&rdquo;
                          </p>
                        )}
                        <p className="mt-0.5 text-xs text-gray-400">{timeAgo(d.created_at)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky donate — mobile only */}
      <MobileDonateBar patientId={patient.id} patientName={patient.name} />
    </div>
  );
}
