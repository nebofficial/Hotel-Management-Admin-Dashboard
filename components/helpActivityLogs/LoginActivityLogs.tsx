"use client";

import { Card } from "@/components/ui/card";

type Log = {
  id: string;
  createdAt: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
};

type Props = {
  logs: Log[];
};

export function LoginActivityLogs({ logs }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/40">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">
          User Login Activity
        </p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          Recent login events, IP addresses, and devices.
        </p>
      </div>
      <div className="p-4 text-xs max-h-64 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-sky-200/70 text-[11px] text-sky-900/80 dark:text-sky-100/80">
              <th className="text-left py-1 pr-2">Time</th>
              <th className="text-left py-1 pr-2">User</th>
              <th className="text-left py-1 pr-2">IP Address</th>
              <th className="text-left py-1">Device</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-sky-100/60 last:border-0 text-sky-900/90 dark:text-sky-50"
              >
                <td className="py-1 pr-2 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-1 pr-2">{log.userName || "-"}</td>
                <td className="py-1 pr-2">{log.ipAddress || "-"}</td>
                <td className="py-1">{log.userAgent || "-"}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-2 text-sky-900/70 dark:text-sky-100/70">
                  No login events found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

