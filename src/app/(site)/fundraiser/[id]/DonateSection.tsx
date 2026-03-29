"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DonationDialog from "@/components/DonationDialog";
import ShareButtons from "@/components/ShareButtons";
import { Heart, Users } from "lucide-react";

interface Props {
  patientId: string;
  patientName: string;
  pageUrl: string;
  donorCount: number;
}

export default function DonateSection({ patientId, patientName, pageUrl, donorCount }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 text-center">
        <p className="font-fraunces text-lg font-semibold text-gray-800">
          Make a difference today
        </p>
        {donorCount > 0 && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-gray-400">
            <Users className="h-3.5 w-3.5" />
            {donorCount} {donorCount === 1 ? "person has" : "people have"} already donated
          </p>
        )}
      </div>

      <Button
        variant="coral"
        size="lg"
        className="w-full gap-2 py-6 text-base"
        onClick={() => setOpen(true)}
      >
        <Heart className="h-5 w-5" fill="white" />
        Donate Now
      </Button>

      <p className="mt-3 text-center text-xs text-gray-400">
        Secure payment via PayPal &middot; 100% goes to {patientName}
      </p>

      <div className="mt-4">
        <ShareButtons patientName={patientName} url={pageUrl} />
      </div>

      <DonationDialog
        patientId={patientId}
        patientName={patientName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
