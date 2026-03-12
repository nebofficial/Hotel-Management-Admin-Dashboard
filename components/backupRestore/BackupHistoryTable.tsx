"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Backup = {
  id: string;
  createdAt: string;
  type: string;
  scope: string;
  sizeBytes?: number;
  status: string;
};

type Props = {
  items: Backup[];
  onDownload: (id: string) => Promise<void>;
  onVerify: (id: string) => Promise<void>;
};

export function BackupHistoryTable({ items, onDownload, onVerify }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-400/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/40">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">
          Backup History
        </p>
        <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
          List of completed backups with status and size.
        </p>
      </div>
      <div className="p-3 text-xs max-h-72 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-violet-200/60 text-[11px] text-violet-900/80 dark:text-violet-100/80">
              <th className="text-left py-1 pr-2">Backup ID</th>
              <th className="text-left py-1 pr-2">Date &amp; Time</th>
              <th className="text-left py-1 pr-2">Type</th>
              <th className="text-left py-1 pr-2">Size</th>
              <th className="text-left py-1 pr-2">Status</th>
              <th className="text-left py-1 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr
                key={b.id}
                className="border-b border-violet-100/60 last:border-0 text-violet-900/90 dark:text-violet-50"
              >
                <td className="py-1 pr-2">{b.id.slice(0, 8)}</td>
                <td className="py-1 pr-2 whitespace-nowrap">
                  {new Date(b.createdAt).toLocaleString()}
                </td>
                <td className="py-1 pr-2">
                  {b.scope} ({b.type})
                </td>
                <td className="py-1 pr-2">
                  {b.sizeBytes
                    ? `${Math.round(b.sizeBytes / 1024)} KB`
                    : "N/A"}
                </td>
                <td className="py-1 pr-2">{b.status}</td>
                <td className="py-1 pr-2 space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => onDownload(b.id)}
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => onVerify(b.id)}
                  >
                    Verify
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-2 text-violet-900/70 dark:text-violet-100/80"
                >
                  No backups created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

