"use client";

import { RevenueKPICard } from "./RevenueKPICard";
import { OccupancyRateCard } from "./OccupancyRateCard";
import { AvailableRoomsCard } from "./AvailableRoomsCard";
import { CheckinsTodayCard } from "./CheckinsTodayCard";

type Props = {
  revenue: any;
  occupancy: any;
  availableRooms: any;
  checkinsToday: any;
};

export function KPICards({ revenue, occupancy, availableRooms, checkinsToday }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      <RevenueKPICard revenue={revenue} />
      <OccupancyRateCard occupancy={occupancy} />
      <AvailableRoomsCard data={availableRooms} />
      <CheckinsTodayCard data={checkinsToday} />
    </div>
  );
}

