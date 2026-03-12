"use client";

import { Card } from "@/components/ui/card";

type Props = {
  restaurant: {
    totalSales?: number;
    ordersCount?: number;
    avgOrderValue?: number;
    topItems?: { name: string; total: number }[];
  } | null;
};

export function RestaurantRevenueBreakdown({ restaurant }: Props) {
  const total = restaurant?.totalSales ?? 0;
  const count = restaurant?.ordersCount ?? 0;
  const avg = restaurant?.avgOrderValue ?? 0;
  const topItems = restaurant?.topItems || [];

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/25 via-red-400/20 to-amber-400/25 backdrop-blur">
      <div className="p-4 space-y-2">
        <p className="text-sm font-semibold text-orange-950">
          Revenue by Restaurant Services
        </p>
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="rounded-md bg-white/85 border border-orange-400/60 px-3 py-2">
            <p className="font-medium text-orange-900/90">
              F&amp;B Revenue
            </p>
            <p className="mt-1 text-lg font-bold text-orange-950">
              {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="rounded-md bg-white/85 border border-orange-400/60 px-3 py-2">
            <p className="font-medium text-orange-900/90">
              Orders / Avg Value
            </p>
            <p className="mt-1 text-lg font-bold text-orange-950">
              {count} / {avg.toFixed(0)}
            </p>
          </div>
        </div>
        <div className="mt-1 text-[11px]">
          <p className="font-medium text-orange-900/90 mb-1">
            Top Selling Items
          </p>
          {topItems.length === 0 ? (
            <p className="text-orange-900/70">
              No item-level breakdown available.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {topItems.map((item) => (
                <li
                  key={item.name}
                  className="flex justify-between text-orange-900/90"
                >
                  <span>{item.name}</span>
                  <span>{item.total.toFixed(0)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}

