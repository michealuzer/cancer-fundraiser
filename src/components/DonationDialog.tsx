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
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const numericAmount = amount ? Number(amount) : null;
  const activePreset = PRESETS.find((p) => p === numericAmount) ?? null;

  function reset() {
    setAmount("");
    setDonorName("");
    setMessage("");
    setError("");
  }

  function handleOpenChange(val: boolean) {
    if (!val) reset();
    onOpenChange(val);
  }

  function handleSubmit() {
    setError("");
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a donation amount.");
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
            amount: numericAmount,
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

          {/* Preset shortcuts */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select or enter amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => { setAmount(String(v)); setError(""); }}
                  className={cn(
                    "rounded-xl border-2 py-2.5 text-sm font-semibold transition-all",
                    activePreset === v
                      ? "border-teal-600 bg-teal-50 text-teal-700 shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50/50"
                  )}
                >
                  ${v}
                </button>
              ))}
            </div>
          </div>

          {/* Single amount input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
              $
            </span>
            <input
              type="number"
              min={1}
              placeholder="Or type any amount"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              className="w-full rounded-xl border-2 border-gray-200 py-3 pl-8 pr-3 text-sm font-medium outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-100"
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
            disabled={isPending || !numericAmount || numericAmount <= 0}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to PayPal…
              </>
            ) : (
              `Donate${numericAmount && numericAmount > 0 ? ` $${numericAmount.toLocaleString()}` : ""} via PayPal`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
