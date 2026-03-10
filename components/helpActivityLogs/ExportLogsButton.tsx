"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
  onExport: (format: "csv" | "xlsx" | "pdf") => Promise<void>;
};

export function ExportLogsButton({ onExport }: Props) {
  const handle = (format: "csv" | "xlsx" | "pdf") => () => {
    void onExport(format);
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Export Activity Logs</p>
          <p className="text-[11px] text-slate-300">
            Download filtered logs for audits or compliance.
          </p>
        </div>
        <Download className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="p-4 flex flex-wrap gap-2 text-xs">
        <Button
          size="sm"
          variant="outline"
          className="border-slate-500 text-slate-50"
          onClick={handle("csv")}
        >
          CSV
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-500 text-slate-50"
          onClick={handle("xlsx")}
        >
          Excel
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-500 text-slate-50"
          onClick={handle("pdf")}
        >
          PDF
        </Button>
      </div>
    </Card>
  );
}

