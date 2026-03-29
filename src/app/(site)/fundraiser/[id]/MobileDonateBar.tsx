"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import DonationDialog from "@/components/DonationDialog";

interface Props {
  patientId: string;
  patientName: string;
}

export default function MobileDonateBar({ patientId, patientName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <Button
          variant="coral"
          size="lg"
          className="w-full gap-2"
          onClick={() => setOpen(true)}
        >
          <Heart className="h-4 w-4" fill="white" />
          Donate Now
        </Button>
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
