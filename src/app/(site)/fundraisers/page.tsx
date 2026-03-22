import { Suspense } from "react";
import Link from "next/link";
import { ChevronDown, Heart, TrendingUp, Users } from "lucide-react";
import PatientGrid from "@/components/PatientGrid";
import PatientGridSkeleton from "@/components/PatientGridSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fundraisers — Small Fighters",
  description: "Browse active campaigns and support a child fighting illness today.",
};

export default function FundraisersPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 to-teal-600 py-28 text-white md:py-36">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-coral-500/20 blur-3xl" />

        <div className="container relative mx-auto max-w-4xl px-4 text-center">
          <span className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-teal-100 backdrop-blur-sm">
            Supporting children since 2019
          </span>

          <h1 className="font-fraunces mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Every Child Deserves a{" "}
            <span className="text-coral-300">Fighting Chance</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-teal-100 md:text-xl">
            Small Fighters connects families facing childhood illness with a community ready
            to help. 100% of every donation goes directly to the child&apos;s care.
          </p>

          <Link
            href="#campaigns"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            See All Fundraisers
            <ChevronDown className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { label: "Total Raised", value: "$2.4M+", icon: TrendingUp },
              { label: "Active Campaigns", value: "1,200+", icon: Heart },
              { label: "Families Helped", value: "8,500+", icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center py-6 sm:px-8">
                <Icon className="mb-2 h-5 w-5 text-teal-600" />
                <p className="font-fraunces text-3xl font-bold text-teal-700">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Patient grid ──────────────────────────────────────────────────── */}
      <section id="campaigns" className="bg-background py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-fraunces mb-3 text-4xl font-bold text-teal-800">
              Active Campaigns
            </h2>
            <p className="text-gray-500">
              Real children. Real stories. Every donation makes a difference.
            </p>
          </div>

          <Suspense fallback={<PatientGridSkeleton />}>
            <PatientGrid />
          </Suspense>
        </div>
      </section>

    </div>
  );
}
