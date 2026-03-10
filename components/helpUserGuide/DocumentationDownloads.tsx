"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Document = {
  id: string;
  title: string;
  description: string;
  url: string;
  size: string;
  format: string;
};

type Props = {
  documents: Document[];
  onDownload: (id: string) => Promise<void>;
};

export function DocumentationDownloads({ documents, onDownload }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold">Download Documentation</p>
        <p className="text-[11px] text-slate-300">
          Download user manuals, training guides, and offline documentation.
        </p>
      </div>
      <div className="p-4 space-y-2 text-[11px]">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between gap-3 rounded-md bg-slate-900/60 px-3 py-2 border border-slate-700"
          >
            <div className="space-y-0.5">
              <p className="font-semibold">{doc.title}</p>
              <p className="text-slate-300">{doc.description}</p>
              <p className="text-slate-400">
                {doc.format} · {doc.size}
              </p>
            </div>
            <Button
              size="sm"
              className="bg-emerald-500 text-white"
              onClick={() => onDownload(doc.id)}
            >
              Download
            </Button>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="text-slate-300">No downloadable documents available.</p>
        )}
      </div>
    </Card>
  );
}

