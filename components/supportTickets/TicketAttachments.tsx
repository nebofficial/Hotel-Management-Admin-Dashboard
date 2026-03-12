"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

type Attachment = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt?: string;
};

type Props = {
  ticketId: string;
  attachments: Attachment[];
  onUpload: (file: File) => Promise<void>;
};

export function TicketAttachments({
  ticketId,
  attachments,
  onUpload,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Attachments
          </p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300">
            Screenshots, documents, or log files attached to this ticket.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.log,.txt"
          />
          <Button
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      <div className="p-3 text-[11px] space-y-1.5 max-h-40 overflow-auto">
        {attachments.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between gap-3 rounded-md border border-slate-200 bg-white/80 px-3 py-1.5 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-50"
          >
            <span className="truncate">{a.fileName}</span>
            <span className="whitespace-nowrap text-slate-500 dark:text-slate-300">
              {a.size ? `${Math.round(a.size / 1024)} KB` : ""}
            </span>
          </a>
        ))}
        {attachments.length === 0 && (
          <p className="text-slate-600 dark:text-slate-300">
            No attachments yet.
          </p>
        )}
      </div>
    </Card>
  );
}

