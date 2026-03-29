"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

interface Props {
  patientId: string;
  patientName: string;
  amount: number;
  donorName: string;
  message: string;
  onBack: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypal?: any;
  }
}

export default function CardDonationForm({
  patientId,
  patientName,
  amount,
  donorName,
  message,
  onBack,
}: Props) {
  const [sdkReady, setSdkReady] = useState(false);
  const [eligible, setEligible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const cardFieldsRef = useRef<any>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    function initFields() {
      if (!window.paypal?.CardFields) {
        setEligible(false);
        setSdkReady(true);
        return;
      }

      const cardFields = window.paypal.CardFields({
        createOrder: async () => {
          const res = await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patientName, amount }),
          });
          const data = await res.json();
          return data.orderId;
        },
        onApprove: async (data: { orderID: string }) => {
          const res = await fetch("/api/capture-card", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderID,
              patientId,
              donorName: donorName || "Anonymous",
              message,
            }),
          });
          const result = await res.json();
          if (result.success) {
            setDone(true);
          } else {
            setError("Payment failed. Please try again.");
          }
          setSubmitting(false);
        },
        onError: () => {
          setError("Payment failed. Please check your card details.");
          setSubmitting(false);
        },
        style: {
          input: {
            "font-size": "14px",
            "font-family": "inherit",
            color: "#374151",
            padding: "0 12px",
          },
          ".invalid": { color: "#ef4444" },
        },
      });

      cardFieldsRef.current = cardFields;

      if (!cardFields.isEligible()) {
        setEligible(false);
        setSdkReady(true);
        return;
      }

      cardFields.NameField().render("#paypal-card-name");
      cardFields.NumberField().render("#paypal-card-number");
      cardFields.ExpiryField().render("#paypal-card-expiry");
      cardFields.CVVField().render("#paypal-card-cvv");
      setSdkReady(true);
    }

    if (mountedRef.current) return;
    mountedRef.current = true;

    if (window.paypal?.CardFields) {
      initFields();
      return;
    }

    const existing = document.querySelector('script[data-paypal-card]');
    if (existing) {
      existing.addEventListener("load", initFields);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&components=card-fields&currency=USD`;
    script.dataset.paypalCard = "true";
    script.onload = initFields;
    script.onerror = () => {
      setError("Failed to load card payment form.");
      setSdkReady(true);
    };
    document.head.appendChild(script);
  }, []);

  async function handleSubmit() {
    if (!cardFieldsRef.current) return;
    setSubmitting(true);
    setError("");
    try {
      await cardFieldsRef.current.submit();
    } catch {
      setError("Please check your card details and try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-14 w-14 text-teal-500" />
        <p className="font-fraunces text-xl font-semibold text-gray-800">Thank you!</p>
        <p className="text-sm text-gray-500">
          Your ${amount.toLocaleString()} donation is helping {patientName} fight on.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Donating</p>
        <p className="font-fraunces text-3xl font-bold text-teal-700">
          ${amount.toLocaleString()}
        </p>
      </div>

      {!sdkReady && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
        </div>
      )}

      {sdkReady && !eligible && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          Card payments are not available for this account yet. Please use PayPal instead.
        </p>
      )}

      {sdkReady && eligible && (
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Name on card</label>
            <div id="paypal-card-name" className="h-11 overflow-hidden rounded-xl border border-gray-200" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Card number</label>
            <div id="paypal-card-number" className="h-11 overflow-hidden rounded-xl border border-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Expiry</label>
              <div id="paypal-card-expiry" className="h-11 overflow-hidden rounded-xl border border-gray-200" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">CVV</label>
              <div id="paypal-card-cvv" className="h-11 overflow-hidden rounded-xl border border-gray-200" />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            variant="coral"
            size="lg"
            className="w-full gap-2 py-5"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing\u2026</>
            ) : (
              `Donate $${amount.toLocaleString()} by Card`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
