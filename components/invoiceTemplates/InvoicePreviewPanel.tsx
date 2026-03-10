"use client";

import { Card } from "@/components/ui/card";

type Props = {
  templateName: string;
  branding: { logoUrl?: string | null; hotelName?: string; address?: string };
  sample: any | null;
};

export function InvoicePreviewPanel({ templateName, branding, sample }: Props) {
  const invoice = sample?.invoice;
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black text-slate-100">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Invoice Preview</p>
          <p className="text-[11px] text-slate-300/80">
            Live snapshot of the template layout (sample data).
          </p>
        </div>
        <div className="text-[11px] text-slate-300/80">{templateName}</div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] gap-3 text-[11px]">
        <div className="space-y-2 rounded-md border border-slate-700 bg-slate-900/80 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold">{branding.hotelName || "Sample Hotel"}</p>
              <p className="text-[10px] whitespace-pre-line">
                {branding.address || "Sample Street\nSample City"}
              </p>
            </div>
            {branding.logoUrl && (
              <div className="w-14 h-14 bg-slate-800 rounded flex items-center justify-center text-[9px]">
                Logo
              </div>
            )}
          </div>
          <div className="mt-2 border-t border-slate-700 pt-2 space-y-1">
            <p className="text-xs font-semibold">Bill To</p>
            <p>{invoice?.guest?.name || "John Doe"}</p>
            <p className="text-slate-300/80">
              Room {invoice?.guest?.roomNumber || "101"} · {invoice?.guest?.nights || 1} night(s)
            </p>
          </div>
          <div className="mt-2 border-t border-slate-700 pt-2 space-y-1">
            <p className="text-xs font-semibold">Charges</p>
            <p>Room: {invoice?.charges?.room ?? 100}</p>
            <p>Restaurant: {invoice?.charges?.restaurant ?? 40}</p>
            <p>Other: {invoice?.charges?.other ?? 10}</p>
            <p className="font-semibold mt-1">
              Subtotal: {invoice?.charges?.subtotal ?? 150}
            </p>
          </div>
        </div>
        <div className="space-y-2 rounded-md border border-slate-700 bg-slate-900/80 p-3">
          <p className="text-xs font-semibold mb-1">Totals</p>
          <p>
            Grand Total: {invoice?.totals?.grandTotal ?? 150}{" "}
            {invoice?.hotel?.currency || ""}
          </p>
          <p>Paid: {invoice?.totals?.paidTotal ?? 0}</p>
          <p className="font-semibold">Balance: {invoice?.totals?.balance ?? 150}</p>
          <div className="mt-3 border-t border-slate-700 pt-2 text-[10px] text-slate-300/80 whitespace-pre-line">
            {sample?.template?.footerNotes ||
              "Payment due on checkout.\nThank you for staying with us."}
          </div>
        </div>
      </div>
    </Card>
  );
}

