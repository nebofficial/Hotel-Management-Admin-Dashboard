"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  onCreate: (payload: {
    title: string;
    category: string;
    description: string;
    priority: string;
    file?: File | null;
  }) => Promise<void>;
};

export function CreateTicketForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technical Issue");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        category,
        description: description.trim(),
        priority,
        file,
      });
      setTitle("");
      setDescription("");
      setFile(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <form onSubmit={handleSubmit}>
        <div className="p-4 border-b border-sky-500/40">
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">
            Create Support Ticket
          </p>
          <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
            Report issues, request assistance, or ask for new features.
          </p>
        </div>
        <div className="p-4 space-y-3 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs">Ticket Title</Label>
            <Input
              className="h-9 text-xs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the issue"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Issue Category</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Bug</option>
                <option>Feature Request</option>
                <option>Technical Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea
              className="min-h-[80px] text-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, steps to reproduce, expected vs actual behaviour..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Attachment (optional)</Label>
            <Input
              type="file"
              className="h-9 text-xs"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*,.pdf,.log,.txt"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              className="bg-sky-600 text-white"
              disabled={submitting || !title.trim() || !description.trim()}
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

