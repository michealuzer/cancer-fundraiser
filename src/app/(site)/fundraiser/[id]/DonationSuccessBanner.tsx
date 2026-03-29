"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

export default function DonationSuccessBanner() {
  const params = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  if (!params.get("donated") || dismissed) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-teal-800">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />
        <p className="text-sm font-medium">
          Thank you! Your donation was received. Every dollar helps.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-teal-500 hover:text-teal-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
