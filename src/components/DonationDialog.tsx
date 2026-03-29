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
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const PRESETS = [10, 25, 50, 100];

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
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Only one source of truth at a time: preset OR custom
  const amount = selected !== null ? selected : custom ? Number(custom) : null;
  const usingCustom = selected === null && custom !== "";

  function reset() {
    setSelected(null);
    setCustom("");
    setDonorName("");
    setMessage("");
    setError("");
  }

  function handleOpenChange(val: boolean) {
    if (!val) reset();
    onOpenChange(val);
  }

  function handlePreset(v: number) {
    setSelected(v);
    setCustom(""); // clear custom when preset chosen
    setError("");
  }

  function handleCustomChange(v: string) {
    setCustom(v);
    setSelected(null); // deselect preset when typing custom
    setError("");
  }

  function handleSubmit() {
    setError("");
    if (!amount || amount <= 0) {
      setError("Please select an amount or enter a custom one.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId,
            patientName,
            amount,
            donorName: donorName.trim() || "Anonymous",
            message: message.trim(),
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError("Could not start checkout. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fraunces text-2xl">
            Support {patientName}
          </DialogTitle>
          <DialogDescription>
            100% goes directly to {patientName}&apos;s care. Secure checkout via PayPal.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">

          {/* Amount display */}
          <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Donating</p>
            <p className="font-fraunces text-3xl font-bold text-teal-700">
              {amount && amount > 0 ? `$${Number(amount).toLocaleString()}` : "—"}
            </p>
          </div>

          {/* Preset buttons */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Quick select
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handlePreset(v)}
                  className={cn(
                    "rounded-xl border-2 py-2.5 text-sm font-semibold transition-all",
                    selected === v
                      ? "border-teal-600 bg-teal-50 text-teal-700 shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50/50"
                  )}
                >
                  ${v}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-medium text-gray-400">or enter your own</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Custom amount */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
              $
            </span>
            <input
              type="number"
              min={1}
              placeholder="Enter amount"
              value={custom}
              onChange={(e) => handleCustomChange(e.target.value)}
              className={cn(
                "w-full rounded-xl border-2 py-3 pl-8 pr-3 text-sm font-medium outline-none transition-all",
                usingCustom
                  ? "border-teal-500 bg-teal-50/50 text-teal-700 ring-1 ring-teal-200"
                  : "border-gray-200 text-gray-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
              )}
            />
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
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
            />
          </div>

          {/* Message */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Message <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder={`An encouraging note for ${patientName}\u2026`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            variant="coral"
            size="lg"
            className="w-full py-6 text-base"
            onClick={handleSubmit}
            disabled={isPending || !amount || amount <= 0}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to PayPal…
              </>
            ) : (
              `Donate${amount && amount > 0 ? ` $${Number(amount).toLocaleString()}` : ""} via PayPal`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
