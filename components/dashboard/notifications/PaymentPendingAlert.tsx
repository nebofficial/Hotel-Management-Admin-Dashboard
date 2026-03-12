"use client";

import { Card } from "@/components/ui/card";
import type { NotificationItem } from "./AlertsNotificationsDashboard";

type Props = {
  alerts: NotificationItem[];
};

export function PaymentPendingAlert({ alerts }: Props) {
  const alert = alerts[0];
  const count = alert?.meta?.count ?? 0;
  const totalDue = alert?.meta?.totalDue ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/25 via-green-400/20 to-lime-400/25 backdrop-blur">
      <div className="p-4 border-b border-emerald-400/60">
        <p className="text-sm font-semibold text-emerald-950">
          Payment Pending
        </p>
        <p className="text-[11px] text-emerald-900/85">
          Guests or invoices that still need to be settled.
        </p>
      </div>
      <div className="p-3 text-xs text-emerald-950 space-y-1.5">
        {alert ? (
          <>
            <p className="font-semibold">{alert.message}</p>
            <p className="text-emerald-900/80">
              Pending bills:{" "}
              <span className="font-semibold">{count}</span> • Total due:{" "}
              <span className="font-semibold">
                {totalDue.toFixed
                  ? totalDue.toFixed(0)
                  : Number(totalDue || 0).toFixed(0)}
              </span>
            </p>
          </>
        ) : (
          <p className="text-emerald-900/80">
            No outstanding guest payments detected.
          </p>
        )}
      </div>
    </Card>
  );
}

