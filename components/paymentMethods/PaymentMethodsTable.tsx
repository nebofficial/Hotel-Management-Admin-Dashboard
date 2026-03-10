"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusToggle } from "./PaymentStatusToggle";

export type PaymentMethodRow = {
  id: string;
  name: string;
  type: "CASH" | "CARD" | "ONLINE" | "BANK";
  active: boolean;
  sortOrder: number;
  lastUpdatedAt?: string | null;
};

type Props = {
  methods: PaymentMethodRow[];
  onEdit: (method: PaymentMethodRow) => void;
  onToggle: (method: PaymentMethodRow) => void;
};

const typeLabel: Record<string, string> = {
  CASH: "Cash",
  CARD: "Card",
  ONLINE: "Online",
  BANK: "Bank Transfer",
};

export function PaymentMethodsTable({ methods, onEdit, onToggle }: Props) {
  return (
    <div className="border-0 rounded-xl bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 p-4 shadow-sm">
      <div className="mb-2">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">Payment Methods</p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/70">
          Central place to manage all payment options.
        </p>
      </div>
      <div className="rounded-lg bg-white/70 dark:bg-slate-900/60 border border-sky-100 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-50/70 dark:bg-slate-800/70">
              <TableHead className="text-xs">Payment Method</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Last Updated</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                  No payment methods configured. Use “Add Method” to create one.
                </TableCell>
              </TableRow>
            ) : (
              methods.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="text-xs font-medium">{m.name}</TableCell>
                  <TableCell className="text-xs">{typeLabel[m.type] || m.type}</TableCell>
                  <TableCell className="text-xs">
                    <Badge
                      variant={m.active ? "default" : "outline"}
                      className={m.active ? "bg-emerald-500/90" : "bg-slate-200 dark:bg-slate-700"}
                    >
                      {m.active ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {m.lastUpdatedAt ? new Date(m.lastUpdatedAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-right space-x-1">
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => onEdit(m)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => onToggle(m)}
                    >
                      {m.active ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

