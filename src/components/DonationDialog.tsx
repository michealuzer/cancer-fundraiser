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
import { Loader2, CreditCard } from "lucide-react";
import CardDonationForm from "./CardDonationForm";

const PRESETS = [10, 25, 50, 100];

interface Props {
  patientId: string;
  patientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DonationDialog({ patientId, patientName, open, onOpenChange }: Props) {
  const [view, setView] = useState<"form" | "card">("form");
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

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

  function handleCard() {
    setError("");
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a donation amount.");
      return;
    }
    setView("card");
  }

  function handlePayPal() {
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
          setError("Could not start PayPal checkout. Please try again.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">

        {view === "card" ? (
          <CardDonationForm
            patientId={patientId}
            patientName={patientName}
            amount={numericAmount!}
            donorName={donorName}
            message={message}
            onBack={() => setView("form")}
          />
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

              {/* Payment buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="coral"
                  size="lg"
                  className="w-full gap-2 py-5"
                  onClick={handlePayPal}
                  disabled={pending}
                >
                  {pending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting\u2026</>
                  ) : (
                    <>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.825l-1.314 8.32h3.498c.46 0 .85-.334.922-.79l.038-.196.731-4.629.047-.254a.932.932 0 0 1 .921-.79h.58c3.757 0 6.698-1.527 7.556-5.945.36-1.847.174-3.389-.582-4.511z"/>
                      </svg>
                      Donate with PayPal
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 border-2 py-5"
                  onClick={handleCard}
                  disabled={pending}
                >
                  <CreditCard className="h-4 w-4" /> Donate by Card
                </Button>
              </div>

              <p className="text-center text-xs text-gray-400">
                Secured by PayPal &middot; No account needed for card payments
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
