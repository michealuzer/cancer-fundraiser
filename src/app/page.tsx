import { Suspense } from "react";
import Link from "next/link";
import { ChevronDown, Heart, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PatientGrid from "@/components/PatientGrid";
import PatientGridSkeleton from "@/components/PatientGridSkeleton";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 to-teal-600 py-28 text-white md:py-36">
        {/* decorative blurs */}
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

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button variant="coral" size="lg" asChild>
              <Link href="/fundraiser/new">Start a Fundraiser</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="#fundraisers">
                See All Fundraisers
                <ChevronDown className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { label: "Total Raised", value: "₦2.4B+", icon: TrendingUp },
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
      <section id="fundraisers" className="bg-background py-20">
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

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-coral-500 to-coral-600 py-20 text-white">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-fraunces mb-4 text-4xl font-bold">
            Is your child a small fighter?
          </h2>
          <p className="mb-8 text-lg text-coral-100">
            Create a fundraiser in minutes and connect with thousands of donors who want to help.
          </p>
          <Button size="lg" className="bg-white text-coral-600 hover:bg-coral-50" asChild>
            <Link href="/fundraiser/new">Create a Campaign</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
