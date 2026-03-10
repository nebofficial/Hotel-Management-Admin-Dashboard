"use client";

import { Card } from "@/components/ui/card";
import { Activity, Cpu, Link2, Users } from "lucide-react";

type Props = {
  activeIntegrations: number;
  totalUsers: number;
  activeUsers: number;
  activeSessions: number;
  systemStatus: string;
};

export function SystemOverviewCards(props: Props) {
  const items = [
    {
      label: "Active Integrations",
      value: props.activeIntegrations,
      icon: Link2,
      gradient: "from-emerald-500 via-emerald-400 to-teal-300",
    },
    {
      label: "Total Users",
      value: props.totalUsers,
      icon: Users,
      gradient: "from-emerald-500 via-lime-400 to-amber-300",
    },
    {
      label: "Active Sessions",
      value: props.activeSessions,
      icon: Activity,
      gradient: "from-sky-500 via-cyan-400 to-emerald-300",
    },
    {
      label: "System Status",
      value: props.systemStatus,
      icon: Cpu,
      gradient: "from-violet-500 via-purple-400 to-pink-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <Card
          key={item.label}
          className="relative overflow-hidden border-0 bg-slate-900/90 text-slate-50 shadow-lg shadow-emerald-500/20"
        >
          <div
            className={`absolute inset-0 opacity-80 bg-gradient-to-br ${item.gradient}`}
          />
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-100/80">
                {item.label}
              </p>
              <p className="text-2xl font-semibold mt-2">{item.value}</p>
            </div>
            <div className="p-2 rounded-full bg-slate-900/30 border border-white/30">
              <item.icon className="w-5 h-5 text-slate-50" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

