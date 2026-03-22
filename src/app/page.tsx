import { Heart, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const campaigns = [
  { id: 1, name: "Lily", condition: "Congenital Heart Defect", age: 4, status: "urgent" as const, raised: 42000, goal: 75000, donors: 312, gradient: "from-rose-100 to-pink-50", description: "Lily needs open-heart surgery to repair a defect she was born with. Every donation brings her closer to a healthy life." },
  { id: 2, name: "Marcus", condition: "Leukemia Treatment", age: 7, status: "critical" as const, raised: 89000, goal: 120000, donors: 641, gradient: "from-sky-100 to-blue-50", description: "Marcus is battling ALL leukemia. His treatment requires specialized therapy not covered by insurance." },
  { id: 3, name: "Sofia", condition: "Bone Marrow Transplant", age: 5, status: "urgent" as const, raised: 63000, goal: 95000, donors: 489, gradient: "from-violet-100 to-purple-50", description: "Sofia needs a bone marrow transplant to survive. A matching donor has been found — now we need to fund the procedure." },
  { id: 4, name: "Noah", condition: "Spinal Rehabilitation", age: 9, status: "ongoing" as const, raised: 28000, goal: 50000, donors: 203, gradient: "from-amber-100 to-yellow-50", description: "After a spinal injury, Noah needs months of intensive rehabilitation therapy to regain mobility." },
  { id: 5, name: "Amara", condition: "Cystic Fibrosis Care", age: 6, status: "ongoing" as const, raised: 51000, goal: 80000, donors: 374, gradient: "from-emerald-100 to-green-50", description: "Amara's cystic fibrosis requires lifelong medication and quarterly hospital visits. Help her family keep up with costs." },
  { id: 6, name: "James", condition: "Spinal Surgery", age: 8, status: "urgent" as const, raised: 34000, goal: 60000, donors: 256, gradient: "from-cyan-100 to-teal-50", description: "James has a rare spinal condition requiring complex surgery. Without it, he faces permanent paralysis." },
];

const statusVariant: Record<string, "urgent" | "ongoing" | "critical"> = {
  urgent: "urgent",
  ongoing: "ongoing",
  critical: "critical",
};

function formatCurrency(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 to-teal-600 py-24 text-white">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-coral-500/20 blur-3xl" />
        <div className="container relative mx-auto max-w-4xl px-4 text-center">
          <span className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-teal-100 backdrop-blur-sm">
            Supporting children since 2019
          </span>
          <h1 className="font-fraunces mb-6 text-5xl font-bold leading-tight md:text-6xl">
            Every child deserves a{" "}
            <span className="text-coral-300">fighting chance</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-teal-100">
            Small Fighters connects families facing childhood illness with a community ready to help. 100% of donations go directly to the child&apos;s care.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button variant="coral" size="lg" asChild>
              <Link href="/fundraiser/new">Start a Fundraiser</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="#campaigns">Explore Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              { label: "Total Raised", value: "$2.4M+", icon: TrendingUp },
              { label: "Active Campaigns", value: "1,200+", icon: Heart },
              { label: "Families Helped", value: "8,500+", icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center py-6 md:px-8">
                <Icon className="mb-2 h-6 w-6 text-teal-600" />
                <p className="font-fraunces text-3xl font-bold text-teal-700">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section id="campaigns" className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-fraunces mb-3 text-4xl font-bold text-teal-800">Active Campaigns</h2>
            <p className="text-gray-500">Real children. Real stories. Every donation makes a difference.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => {
              const pct = Math.round((c.raised / c.goal) * 100);
              return (
                <Card key={c.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className={`bg-gradient-to-br ${c.gradient} flex h-32 items-start justify-between p-4`}>
                    <Badge variant={statusVariant[c.status]} className="capitalize">{c.status}</Badge>
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{c.condition}</span>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{c.name}&apos;s Campaign</CardTitle>
                    <p className="text-sm text-gray-400">Age {c.age}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                    <div>
                      <Progress value={pct} className="mb-1" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatCurrency(c.raised)} raised</span>
                        <span>Goal: {formatCurrency(c.goal)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{c.donors} donors · {pct}% funded</span>
                      <Button size="sm" variant="default">Donate Now</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-coral-500 to-coral-600 py-20 text-white">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-fraunces mb-4 text-4xl font-bold">Is your child a small fighter?</h2>
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
