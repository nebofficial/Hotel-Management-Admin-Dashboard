"use client";

import { Card } from "@/components/ui/card";
import { TicketPriorityBadge } from "./TicketPriorityBadge";

type Ticket = {
  id: string;
  title: string;
  status: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  createdAt: string;
  updatedAt: string;
};

type Props = {
  tickets: Ticket[];
  onSelect: (ticketId: string) => void;
};

export function TicketsTable({ tickets, onSelect }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/40 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
            Submitted Tickets
          </p>
          <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
            Overview of all support requests and their statuses.
          </p>
        </div>
        <span className="text-[11px] text-emerald-900/80 dark:text-emerald-100/80">
          {tickets.length} tickets
        </span>
      </div>
      <div className="p-3 text-xs max-h-72 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-emerald-200/60 text-[11px] text-emerald-900/80 dark:text-emerald-100/80">
              <th className="text-left py-1 pr-2">Ticket ID</th>
              <th className="text-left py-1 pr-2">Title</th>
              <th className="text-left py-1 pr-2">Priority</th>
              <th className="text-left py-1 pr-2">Status</th>
              <th className="text-left py-1 pr-2">Created</th>
              <th className="text-left py-1 pr-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.id}
                className="border-b border-emerald-100/60 last:border-0 cursor-pointer hover:bg-emerald-50/60 dark:hover:bg-slate-900/60"
                onClick={() => onSelect(t.id)}
              >
                <td className="py-1 pr-2 text-emerald-900 dark:text-emerald-50">
                  {t.id.slice(0, 8)}
                </td>
                <td className="py-1 pr-2 text-emerald-900 dark:text-emerald-50 truncate max-w-[180px]">
                  {t.title}
                </td>
                <td className="py-1 pr-2">
                  <TicketPriorityBadge priority={t.priority} />
                </td>
                <td className="py-1 pr-2 text-emerald-900 dark:text-emerald-50">
                  {t.status}
                </td>
                <td className="py-1 pr-2 text-emerald-900/80 dark:text-emerald-100/80 whitespace-nowrap">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
                <td className="py-1 pr-2 text-emerald-900/80 dark:text-emerald-100/80 whitespace-nowrap">
                  {new Date(t.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-2 text-emerald-900/70 dark:text-emerald-100/80"
                >
                  No tickets yet. Use the form above to create your first
                  support ticket.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

