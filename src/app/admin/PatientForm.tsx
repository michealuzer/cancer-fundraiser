"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { addPatient, updatePatient } from "@/app/admin/actions";
import type { Patient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const CONDITIONS = ["Cancer", "Anemia", "Heart Surgery", "Other"];

interface Props {
  editing: Patient | null;
  onDone: () => void;
}

export default function PatientForm({ editing, onDone }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("Cancer");
  const [story, setStory] = useState("");
  const [goal, setGoal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setAge(String(editing.age));
      setCondition(editing.condition);
      setStory(editing.story ?? "");
      setGoal(String(editing.goal_amount));
      setImageUrl(editing.cover_image_url ?? "");
    } else {
      resetForm();
    }
  }, [editing]);

  function resetForm() {
    setName(""); setAge(""); setCondition("Cancer");
    setStory(""); setGoal(""); setImageUrl(""); setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !age || !goal) {
      setError("Name, age, and goal amount are required.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          name: name.trim(),
          age: Number(age),
          condition,
          story: story.trim() || null,
          goal_amount: Number(goal),
          cover_image_url: imageUrl.trim() || null,
          is_active: true,
        };

        if (editing) {
          await updatePatient(editing.id, payload);
        } else {
          await addPatient(payload);
        }

        resetForm();
        onDone();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="font-fraunces text-xl font-semibold text-gray-800">
        {editing ? `Edit: ${editing.name}` : "Add New Fundraiser"}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Patient Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amara" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" min={0} max={18} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 7" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="condition">Condition</Label>
        <Select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="story">Story</Label>
        <Textarea
          id="story"
          rows={5}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Tell us about this child and their journey..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="goal">Goal Amount ($)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
          <Input id="goal" type="number" min={1} className="pl-7" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. 5000" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Cover Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/photo.jpg"
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-2 h-40 w-full rounded-lg object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
            onLoad={(e) => (e.currentTarget.style.display = "block")}
          />
        )}
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="default" disabled={isPending} className="flex-1">
          {isPending
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{editing ? "Saving…" : "Adding…"}</>
            : editing ? "Save Changes" : "Add Fundraiser"}
        </Button>
        {editing && (
          <Button type="button" variant="outline" onClick={() => { resetForm(); onDone(); }}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
