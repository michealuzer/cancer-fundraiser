import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Patient } from "@/lib/supabase";

// ── Condition colour mapping ───────────────────────────────────────────────────

function conditionStyle(condition: string): { bg: string; text: string; dot: string } {
  const c = condition.toLowerCase();
  if (c.includes("cancer") || c.includes("leukemia") || c.includes("tumor"))
    return { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
  if (c.includes("anemia") || c.includes("anaemia") || c.includes("sickle"))
    return { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" };
  if (c.includes("surgery") || c.includes("heart") || c.includes("cardiac"))
    return { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" };
  if (c.includes("transplant") || c.includes("marrow"))
    return { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" };
  if (c.includes("rehab") || c.includes("spinal") || c.includes("spine"))
    return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
  return { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" };
}

// ── Currency formatter (₦) ─────────────────────────────────────────────────────

function naira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n.toLocaleString()}`;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PatientCard({ patient }: { patient: Patient }) {
  const pct = Math.min(100, Math.round((patient.raised_amount / patient.goal_amount) * 100));
  const style = conditionStyle(patient.condition);

  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Cover image */}
      <div className="relative h-48 w-full overflow-hidden bg-teal-100">
        {patient.cover_image_url ? (
          <Image
            src={patient.cover_image_url}
            alt={`${patient.name}'s photo`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200">
            <span className="font-fraunces text-5xl font-bold text-teal-400">
              {patient.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Age badge */}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-teal-800 backdrop-blur-sm">
          Age {patient.age}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/* Name + condition */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-fraunces text-lg font-semibold leading-tight text-gray-900">
            {patient.name}
          </h3>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {patient.condition}
          </span>
        </div>

        {/* Story excerpt */}
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
          {patient.story ?? "Help this child get the care they deserve."}
        </p>

        {/* Progress */}
        <div className="mt-auto space-y-1.5">
          <Progress value={pct} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium text-teal-700">{naira(patient.raised_amount)} raised</span>
            <span>of {naira(patient.goal_amount)} goal</span>
          </div>
        </div>

        {/* CTA */}
        <Button variant="default" size="sm" className="mt-1 w-full" asChild>
          <Link href={`/fundraiser/${patient.id}`}>Support {patient.name}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
