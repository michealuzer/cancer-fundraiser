import { notFound } from "next/navigation";
import Image from "next/image";
import { getPatient, getDonations } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";
import DonateSection from "./DonateSection";

// ── Helpers ───────────────────────────────────────────────────────────────────

function naira(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n.toLocaleString()}`;
}

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

// ── Page ──────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: { id: string } }) {
  const patient = await getPatient(params.id);
  if (!patient) return { title: "Not found" };
  return {
    title: `${patient.name}'s Campaign — Small Fighters`,
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
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://smallfighters.netlify.app"}/fundraiser/${patient.id}`;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Cover image ─────────────────────────────────────────────────── */}
      <div className="relative h-64 w-full overflow-hidden bg-teal-100 md:h-[420px]">
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
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200">
            <span className="font-fraunces text-9xl font-bold text-teal-300">
              {patient.name.charAt(0)}
            </span>
          </div>
        )}
        {/* gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

          {/* ── Main content ──────────────────────────────────────────── */}
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

            {/* Progress — shown in main on mobile, hidden here on lg (shown in sidebar) */}
            <div className="space-y-2 lg:hidden">
              <div className="flex items-end justify-between">
                <p className="font-fraunces text-2xl font-bold text-teal-700">
                  {naira(patient.raised_amount)}
                  <span className="ml-1 text-base font-normal text-gray-400">raised</span>
                </p>
                <p className="text-sm text-gray-500">Goal: {naira(patient.goal_amount)}</p>
              </div>
              <Progress value={pct} className="h-3" />
              <p className="text-right text-sm font-medium text-teal-600">{pct}% funded</p>
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

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div className="w-full space-y-6 lg:sticky lg:top-24 lg:w-80 lg:shrink-0">

            {/* Progress card — desktop only */}
            <div className="hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:block">
              <div className="mb-2 flex items-end justify-between">
                <p className="font-fraunces text-3xl font-bold text-teal-700">
                  {naira(patient.raised_amount)}
                </p>
                <p className="text-sm text-gray-400">{pct}%</p>
              </div>
              <Progress value={pct} className="mb-2 h-3" />
              <p className="text-sm text-gray-500">
                raised of <span className="font-medium">{naira(patient.goal_amount)}</span> goal
              </p>
            </div>

            {/* Donate + share (client island) */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <DonateSection
                patientId={patient.id}
                patientName={patient.name}
                pageUrl={pageUrl}
              />
            </div>

            {/* Recent donations */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="font-fraunces mb-4 text-lg font-semibold text-gray-800">
                Recent Supporters
              </h3>

              {donations.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Be the first to support {patient.name}!
                </p>
              ) : (
                <ul className="space-y-4">
                  {donations.slice(0, 8).map((d) => (
                    <li key={d.id} className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                        {d.donor_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-medium text-gray-800">
                            {d.donor_name}
                          </p>
                          <span className="shrink-0 text-xs text-teal-600 font-semibold">
                            {naira(d.amount)}
                          </span>
                        </div>
                        {d.message && (
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{d.message}</p>
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
    </div>
  );
}
