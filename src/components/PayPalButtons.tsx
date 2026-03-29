"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  patientId: string;
  patientName: string;
  amount: number;
  donorName: string;
  message: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypal?: any;
  }
}

export default function PayPalButtons({ patientId, patientName, amount, donorName, message }: Props) {
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    function renderButtons() {
      if (!window.paypal?.Buttons || !containerRef.current) return;

      window.paypal.Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "donate",
        },
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
        },
        onError: () => {
          setError("Something went wrong. Please try again.");
        },
        onCancel: () => {
          setError("");
        },
      }).render(containerRef.current);

      setLoading(false);
    }

    if (window.paypal?.Buttons) {
      renderButtons();
      return;
    }

    const existing = document.querySelector('script[data-paypal-sdk]');
    if (existing) {
      existing.addEventListener("load", renderButtons);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture&components=buttons`;
    script.dataset.paypalSdk = "true";
    script.onload = renderButtons;
    script.onerror = () => {
      setError("Failed to load PayPal. Please refresh and try again.");
      setLoading(false);
    };
    document.head.appendChild(script);
  }, []);

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-teal-500" />
        <p className="font-fraunces text-xl font-semibold text-gray-800">Thank you!</p>
        <p className="text-sm text-gray-500">
          Your ${amount.toLocaleString()} donation is helping {patientName}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
        </div>
      )}
      <div ref={containerRef} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
