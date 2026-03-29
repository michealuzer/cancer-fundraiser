"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import PayPalButtons from "./PayPalButtons";

const PRESETS = [10, 25, 50, 100];

interface Props {
  patientId: string;
  patientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DonationDialog({ patientId, patientName, open, onOpenChange }: Props) {
  const [view, setView] = useState<"form" | "pay">("form");
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericAmount = amount ? Number(amount) : null;
  const activePreset = PRESETS.find((p) => p === numericAmount) ?? null;

  function reset() {
    setView("form");
    setAmount("");
    setDonorName("");
    setMessage("");
    setError("");
  }

  function handleOpenChange(val: boolean) {
    if (!val) reset();
    onOpenChange(val);
  }

  function handleContinue() {
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a donation amount.");
      return;
    }
    setError("");
    setView("pay");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">

        {view === "pay" ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setView("form")}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Donating</p>
              <p className="font-fraunces text-3xl font-bold text-teal-700">
                ${numericAmount!.toLocaleString()}
              </p>
            </div>

            <p className="text-center text-sm text-gray-500">
              Choose how you&apos;d like to donate
            </p>

            <PayPalButtons
              patientId={patientId}
              patientName={patientName}
              amount={numericAmount!}
              donorName={donorName}
              message={message}
            />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-fraunces text-2xl">
                Support {patientName}
              </DialogTitle>
              <DialogDescription>
                100% goes directly to {patientName}&apos;s care.
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

              {/* Amount input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">$</span>
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

              <button
                type="button"
                onClick={handleContinue}
                className="w-full rounded-xl bg-teal-600 py-4 text-base font-semibold text-white transition-colors hover:bg-teal-700 active:scale-[0.98]"
              >
                Continue to Payment
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
