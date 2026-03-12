"use client";

type Props = {
  roomNumber?: string | null;
  roomType?: string | null;
  roomStatus?: string | null;
};

export function RoomAssignmentBadge({ roomNumber, roomType, roomStatus }: Props) {
  const status = (roomStatus || "").toLowerCase();
  const color =
    status === "available"
      ? "bg-emerald-500/15 text-emerald-800 border-emerald-400/60"
      : status === "occupied"
      ? "bg-sky-500/15 text-sky-800 border-sky-400/60"
      : status === "maintenance"
      ? "bg-amber-500/15 text-amber-800 border-amber-400/60"
      : "bg-slate-500/10 text-slate-800 border-slate-400/50";

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${color}`}
      >
        {roomNumber ? `Room ${roomNumber}` : "No room assigned"}
      </span>
      <div className="flex gap-1 text-[9px] text-slate-600">
        {roomType && <span>{roomType}</span>}
        {roomStatus && <span>• {roomStatus}</span>}
      </div>
    </div>
  );
}

