"use client";

type Props = {
  priority: "Low" | "Medium" | "High" | "Critical";
};

export function TicketPriorityBadge({ priority }: Props) {
  const map: Record<string, string> = {
    Low: "bg-emerald-100 text-emerald-800",
    Medium: "bg-amber-100 text-amber-800",
    High: "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${map[priority] || map.Medium}`}
    >
      {priority}
    </span>
  );
}

