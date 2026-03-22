"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DonationDialog from "@/components/DonationDialog";
import ShareButtons from "@/components/ShareButtons";
import { Heart } from "lucide-react";

interface Props {
  patientId: string;
  patientName: string;
  pageUrl: string;
}

export default function DonateSection({ patientId, patientName, pageUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="coral" size="lg" className="w-full gap-2" onClick={() => setOpen(true)}>
        <Heart className="h-4 w-4" fill="white" />
        Donate Now
      </Button>

      <ShareButtons patientName={patientName} url={pageUrl} />

      <DonationDialog
        patientId={patientId}
        patientName={patientName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
