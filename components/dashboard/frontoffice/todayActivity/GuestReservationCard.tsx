"use client";

import type { TodayActivityItem } from "./TodayActivityDashboard";
import { RoomAssignmentBadge } from "./RoomAssignmentBadge";

type Props = {
  item: TodayActivityItem;
};

export function GuestReservationCard({ item }: Props) {
  const checkIn = item.checkIn ? new Date(item.checkIn) : null;
  const checkOut = item.checkOut ? new Date(item.checkOut) : null;

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-slate-900 truncate">
            {item.guestName}
          </p>
          <p className="text-[11px] text-slate-600 truncate">
            #{item.bookingNumber} • {item.guestPhone || "No phone"}
          </p>
        </div>
        <RoomAssignmentBadge
          roomNumber={item.roomNumber}
          roomType={item.roomType}
          roomStatus={item.roomStatus}
        />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-600">
        {checkIn && (
          <span>
            Check-in:{" "}
            {checkIn.toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
            })}
          </span>
        )}
        {checkOut && (
          <span>
            Check-out:{" "}
            {checkOut.toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
            })}
          </span>
        )}
        {item.roomType && <span>• {item.roomType}</span>}
      </div>
    </div>
  );
}

