"use client";

type Props = {
  status: string;
};

export function CheckinStatusBadge({ status }: Props) {
  const s = (status || "").toLowerCase();
  let label = "Pending Check-in";
  let color =
    "bg-amber-500/15 text-amber-800 border-amber-400/60";

  if (s === "checked_in") {
    label = "Checked-in";
    color = "bg-emerald-500/20 text-emerald-900 border-emerald-500/70";
  } else if (s === "cancelled") {
    label = "Cancelled";
    color = "bg-rose-500/15 text-rose-800 border-rose-400/60";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${color}`}
    >
      {label}
    </span>
  );
}

