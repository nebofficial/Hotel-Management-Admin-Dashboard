"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PaymentTransactionRow = {
  id: string;
  methodName?: string | null;
  amount: number;
  currency: string;
  status: string;
  direction: string;
  createdAt: string;
};

type Props = {
  transactions: PaymentTransactionRow[];
};

export function PaymentTransactionLog({ transactions }: Props) {
  const rows = useMemo(() => transactions || [], [transactions]);

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold">Payment Transaction Log</p>
        <p className="text-[11px] text-slate-300/80">
          Recent payment activity across all methods.
        </p>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap gap-4 text-[11px] text-slate-300/90">
          <div>
            <Label className="mr-1 inline text-[11px]">Filter:</Label>
            <span className="opacity-80">All methods · Last 30 days (static UI)</span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-900/80 border border-slate-700 overflow-hidden mt-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800/80">
                <TableHead className="text-[11px] text-slate-100">Transaction ID</TableHead>
                <TableHead className="text-[11px] text-slate-100">Payment Method</TableHead>
                <TableHead className="text-[11px] text-slate-100">Amount</TableHead>
                <TableHead className="text-[11px] text-slate-100">Date</TableHead>
                <TableHead className="text-[11px] text-slate-100">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-[11px] text-slate-400">
                    No recent payment transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-[11px] font-mono">
                      {tx.id.slice(0, 8)}…
                    </TableCell>
                    <TableCell className="text-[11px]">{tx.methodName || "-"}</TableCell>
                    <TableCell className="text-[11px]">
                      {tx.currency} {Number(tx.amount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[11px]">
                      {new Date(tx.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-[11px] uppercase">{tx.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}

