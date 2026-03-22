"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  patientName: string;
  url: string;
}

export default function ShareButtons({ patientName, url }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const waText = encodeURIComponent(
    `Help ${patientName} get the care they need. Every donation counts 💙\n${url}`
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Share</p>

      <button
        onClick={copyLink}
        className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-600 transition-colors hover:border-teal-300 hover:text-teal-700"
      >
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-teal-600" />
        ) : (
          <Copy className="h-4 w-4 shrink-0" />
        )}
        {copied ? "Link copied!" : "Copy link"}
      </button>

      <a
        href={`https://wa.me/?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-600 transition-colors hover:border-green-300 hover:text-green-700"
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
        Share on WhatsApp
      </a>

      <button
        onClick={copyLink}
        className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-600 transition-colors hover:border-pink-300 hover:text-pink-700"
      >
        <Instagram className="h-4 w-4 shrink-0" />
        Copy for Instagram
      </button>
    </div>
  );
}
