"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Comment = {
  id: string;
  author: string;
  message: string;
  internal?: boolean;
  createdAt: string;
};

type Props = {
  comments: Comment[];
  onAddComment: (payload: { message: string; internal?: boolean }) => Promise<void>;
};

export function TicketComments({ comments, onAddComment }: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onAddComment({ message: text.trim(), internal: false });
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Comments & Discussion
        </p>
        <p className="text-[11px] text-slate-700 dark:text-slate-300">
          Conversation between users and support staff.
        </p>
      </div>
      <div className="p-3 space-y-3 text-[11px]">
        <div className="max-h-40 overflow-auto space-y-1.5">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-md border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900/70"
            >
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-50">
                  {c.author}
                </span>
                <span className="text-slate-500 dark:text-slate-300 whitespace-nowrap">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-800 dark:text-slate-100">{c.message}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-slate-600 dark:text-slate-300">
              No comments yet. Start the conversation below.
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Textarea
            className="min-h-[60px] text-xs"
            placeholder="Add a comment for support..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={submitting || !text.trim()}
              onClick={handleSubmit}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

