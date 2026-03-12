"use client";

type Props = {
  status: string;
};

export function CheckoutStatusBadge({ status }: Props) {
  const s = (status || "").toLowerCase();
  let label = "Pending Check-out";
  let color =
    "bg-amber-500/15 text-amber-800 border-amber-400/60";

  if (s === "checked_out") {
    label = "Checked-out";
    color = "bg-slate-900/90 text-slate-50 border-slate-700/80";
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

