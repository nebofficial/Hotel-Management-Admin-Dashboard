"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

type Filters = {
  startDate?: string;
  endDate?: string;
  roomType?: string;
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
};

export function OccupancyFilters({ filters, onChange, onApply }: Props) {
  const [local, setLocal] = useState<Filters>(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const apply = () => {
    onChange(local);
    onApply();
  };

  return (
    <Card className="border-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-800/85 text-slate-50 px-3 py-2.5 flex flex-wrap items-center gap-2 text-[11px]">
      <span className="font-semibold uppercase tracking-wide text-slate-100 mr-1.5">
        Filters
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-slate-300">From</span>
        <input
          type="date"
          value={local.startDate || ""}
          onChange={(e) =>
            setLocal((f) => ({ ...f, startDate: e.target.value || undefined }))
          }
          className="h-7 rounded-md border border-slate-600 bg-slate-950/40 px-2 text-[11px]"
        />
        <span className="text-slate-300">to</span>
        <input
          type="date"
          value={local.endDate || ""}
          onChange={(e) =>
            setLocal((f) => ({ ...f, endDate: e.target.value || undefined }))
          }
          className="h-7 rounded-md border border-slate-600 bg-slate-950/40 px-2 text-[11px]"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-slate-300">Room type</span>
        <select
          value={local.roomType || "ALL"}
          onChange={(e) =>
            setLocal((f) => ({
              ...f,
              roomType: e.target.value === "ALL" ? undefined : e.target.value,
            }))
          }
          className="h-7 rounded-md border border-slate-600 bg-slate-950/40 px-2 text-[11px]"
        >
          <option value="ALL">All</option>
          <option value="STANDARD">Standard</option>
          <option value="DELUXE">Deluxe</option>
          <option value="SUITE">Suite</option>
          <option value="FAMILY">Family</option>
        </select>
      </div>
      <button
        type="button"
        onClick={apply}
        className="ml-auto h-7 px-3 rounded-md bg-emerald-500 text-white text-[11px] font-semibold hover:bg-emerald-400"
      >
        Apply
      </button>
    </Card>
  );
}

