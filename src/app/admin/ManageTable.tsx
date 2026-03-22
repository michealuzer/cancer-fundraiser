"use client";

import { useState, useTransition } from "react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toggleActive, deletePatient } from "@/app/admin/actions";
import type { Patient } from "@/lib/supabase";
import { Pencil, Trash2, Loader2 } from "lucide-react";

function naira(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n}`;
}

interface Props {
  patients: Patient[];
  onEdit: (p: Patient) => void;
}

export default function ManageTable({ patients, onEdit }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleToggle(p: Patient) {
    setLoadingId(p.id);
    startTransition(async () => {
      await toggleActive(p.id, p.is_active);
      setLoadingId(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePatient(id);
      setConfirmId(null);
    });
  }

  if (patients.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        No fundraisers yet. Add one using the form.
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Raised / Goal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium text-gray-900">{p.name}, {p.age}</TableCell>
              <TableCell className="text-gray-500">{p.condition}</TableCell>
              <TableCell className="text-gray-500">
                {naira(p.raised_amount)} / {naira(p.goal_amount)}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleToggle(p)}
                  disabled={isPending && loadingId === p.id}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    p.is_active
                      ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {isPending && loadingId === p.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-teal-500" : "bg-gray-400"}`} />
                  )}
                  {p.is_active ? "Active" : "Inactive"}
                </button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(p)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmId(p.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete confirmation dialog */}
      <Dialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-fraunces text-xl">Delete Fundraiser?</DialogTitle>
            <DialogDescription>
              This will permanently delete this patient and all their donations. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmId(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              onClick={() => confirmId && handleDelete(confirmId)}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
