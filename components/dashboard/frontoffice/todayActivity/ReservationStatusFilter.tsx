"use client";

import { Card } from "@/components/ui/card";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const OPTIONS = [
  { id: "all", label: "All Reservations" },
  { id: "pending_checkin", label: "Pending Check-in" },
  { id: "checked_in", label: "Checked-in" },
  { id: "pending_checkout", label: "Pending Check-out" },
  { id: "checked_out", label: "Checked-out" },
];

export function ReservationStatusFilter({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/15 to-emerald-500/20 backdrop-blur px-3 py-2 flex flex-wrap items-center gap-1.5 text-[11px]">
      <span className="font-semibold text-teal-950/90 mr-1.5">
        Status Filter:
      </span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`px-2.5 py-0.5 rounded-full border transition-colors ${
            value === opt.id
              ? "border-teal-600 bg-teal-600 text-white"
              : "border-teal-200/70 bg-white/70 text-teal-900 hover:border-teal-500/80"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </Card>
  );
}

