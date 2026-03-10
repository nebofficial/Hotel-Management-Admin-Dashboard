"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type LogFiltersValue = {
  startDate?: string;
  endDate?: string;
  user?: string;
  module?: string;
  type?: string;
};

type Props = {
  onApply: (filters: LogFiltersValue) => void;
};

export function LogFilters({ onApply }: Props) {
  const [filters, setFilters] = useState<LogFiltersValue>({
    type: "all",
  });

  const update = (patch: Partial<LogFiltersValue>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Filter Logs
        </p>
        <p className="text-[11px] text-slate-700 dark:text-slate-300">
          Filter by date range, user, module, or log type.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Start Date</Label>
          <Input
            type="date"
            className="h-8 text-xs"
            value={filters.startDate || ""}
            onChange={(e) => update({ startDate: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">End Date</Label>
          <Input
            type="date"
            className="h-8 text-xs"
            value={filters.endDate || ""}
            onChange={(e) => update({ endDate: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">User Name</Label>
          <Input
            className="h-8 text-xs"
            placeholder="Filter by user..."
            value={filters.user || ""}
            onChange={(e) => update({ user: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Module</Label>
          <Input
            className="h-8 text-xs"
            placeholder="Reservations, POS, Settings..."
            value={filters.module || ""}
            onChange={(e) => update({ module: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Log Type</Label>
          <select
            className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm"
            value={filters.type || "all"}
            onChange={(e) => update({ type: e.target.value })}
          >
            <option value="all">All</option>
            <option value="login">User Login</option>
            <option value="config">Config Changes</option>
            <option value="data">Data Modifications</option>
            <option value="module">Module Usage</option>
            <option value="error">Errors</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            size="sm"
            className="w-full bg-slate-900 text-slate-50"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}

