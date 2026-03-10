"use client";

import { Card } from "@/components/ui/card";
import { Activity, BarChart2, Database, Server } from "lucide-react";

type Health = {
  cpuLoad: number;
  usedMem: number;
  totalMem: number;
  uptimeSeconds: number;
};

export function SystemHealthAndUsage({ health }: { health: Health | null }) {
  const memPercent =
    health && health.totalMem
      ? Math.round((health.usedMem / health.totalMem) * 100)
      : 0;

  const uptimeHours = health ? Math.floor(health.uptimeSeconds / 3600) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-400 via-amber-300 to-orange-400 text-slate-900 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent)]" />
        <div className="relative z-10 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide">
              System Health
            </span>
            <Server className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-80">
            CPU load and memory utilization of the application server.
          </p>
          <div className="mt-2 flex items-center justify-between text-sm font-medium">
            <span>CPU Load (1m)</span>
            <span>{health ? `${health.cpuLoad.toFixed(2)}` : "--"}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm font-medium">
            <span>Memory Usage</span>
            <span>{memPercent ? `${memPercent}%` : "--"}</span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-red-400 to-rose-400 text-slate-50 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent)]" />
        <div className="relative z-10 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide">
              API Usage Analytics
            </span>
            <BarChart2 className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-80">
            High-level overview of recent API traffic and request volume.
          </p>
          <div className="mt-3 flex items-center justify-between text-xs font-medium opacity-90">
            <span>API Requests (today)</span>
            <span>—</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs font-medium opacity-90">
            <span>Top Endpoint</span>
            <span>—</span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-slate-50 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent)]" />
        <div className="relative z-10 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide">
              Uptime & Database
            </span>
            <Database className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-85">
            Application uptime and database storage trends overview.
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-medium opacity-90">
            <span>Uptime</span>
            <span>{uptimeHours ? `${uptimeHours}h` : "--"}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs font-medium opacity-90">
            <span>Database Size</span>
            <span>—</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

