"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { submitDonation } from "@/app/actions";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";

const PRESETS = [10, 25, 50];

interface Props {
  patientId: string;
  patientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DonationDialog({ patientId, patientName, open, onOpenChange }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const amount = selected ?? (custom ? Number(custom) : null);

  function reset() {
    setSelected(null);
    setCustom("");
    setDonorName("");
    setMessage("");
    setDone(false);
    setError("");
  }

  function handleOpenChange(val: boolean) {
    if (!val) reset();
    onOpenChange(val);
  }

  function handlePreset(v: number) {
    setSelected(v);
    setCustom("");
  }

  function handleCustom(v: string) {
    setCustom(v);
    setSelected(null);
  }

  function handleSubmit() {
    setError("");
    if (!amount || amount <= 0) {
      setError("Please enter or select a donation amount.");
      return;
    }

    startTransition(async () => {
      try {
        await submitDonation({ patient_id: patientId, donor_name: donorName, amount, message });
        setDone(true);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        {done ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="h-14 w-14 text-teal-600" />
            <DialogTitle className="font-fraunces text-2xl">Thank you!</DialogTitle>
            <p className="text-gray-500">
              Your donation of{" "}
              <span className="font-semibold text-teal-700">${Number(amount).toLocaleString()}</span>{" "}
              is helping {patientName} fight on. Every dollar counts.
            </p>
            <Button variant="default" onClick={() => handleOpenChange(false)} className="mt-2 w-full">
              Close
            </Button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <DialogHeader>
              <DialogTitle className="font-fraunces text-2xl">
                Support {patientName}
              </DialogTitle>
              <DialogDescription>
                100% of your donation goes directly to {patientName}&apos;s care.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-5">
              {/* Preset amounts */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Select amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handlePreset(v)}
                      className={cn(
                        "rounded-lg border-2 py-2.5 text-sm font-semibold transition-all",
                        selected === v
                          ? "border-teal-600 bg-teal-50 text-teal-700"
                          : "border-gray-200 text-gray-600 hover:border-teal-300"
                      )}
                    >
                      ${v.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 100"
                    value={custom}
                    onChange={(e) => handleCustom(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-8 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Donor name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Your name <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Anonymous"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={`Write an encouraging note for ${patientName}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                variant="coral"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  `Donate${amount ? ` $${Number(amount).toLocaleString()}` : ""}`
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
