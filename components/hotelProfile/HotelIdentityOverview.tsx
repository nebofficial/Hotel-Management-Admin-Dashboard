"use client";

import { Card } from "@/components/ui/card";

type Props = {
  logoUrl: string;
  name: string;
  description: string;
};

export function HotelIdentityOverview({ logoUrl, name, description }: Props) {
  return (
    <Card className="relative overflow-hidden border-0 bg-slate-900 text-slate-50 shadow-lg shadow-emerald-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-400/80 to-teal-300 opacity-90" />
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 p-4">
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white/10 ring-2 ring-emerald-100 overflow-hidden border border-emerald-200/70">
          <img
            src={logoUrl || "https://via.placeholder.com/150"}
            alt="Hotel logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-50/90">
            Hotel Identity
          </p>
          <p className="text-xl font-semibold text-white">{name || "Your hotel name"}</p>
          <p className="text-xs text-emerald-50/90 line-clamp-2">
            {description || "Add a short description that guests will see across your touchpoints."}
          </p>
        </div>
      </div>
    </Card>
  );
}

