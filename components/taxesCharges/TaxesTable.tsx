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
import type { TaxRule } from "./EditTaxRuleModal";

type Props = {
  rules: TaxRule[];
  onEdit: (rule: TaxRule) => void;
  onToggleStatus: (rule: TaxRule) => void;
  onDelete: (rule: TaxRule) => void;
};

const typeLabel: Record<string, string> = {
  GST: "GST",
  VAT: "VAT",
  SERVICE: "Service",
  CITY: "City Tax",
};

const scopeLabel: Record<string, string> = {
  rooms: "Rooms",
  services: "Services",
  both: "Rooms & Services",
};

export function TaxesTable({ rules, onEdit, onToggleStatus, onDelete }: Props) {
  return (
    <div className="border-0 rounded-xl bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">Tax Rules</p>
          <p className="text-[11px] text-sky-900/70 dark:text-sky-100/70">
            Central place to manage all tax rules.
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-white/70 dark:bg-slate-900/60 border border-sky-100 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-50/70 dark:bg-slate-800/70">
              <TableHead className="text-xs">Tax Name</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Percentage</TableHead>
              <TableHead className="text-xs">Applied To</TableHead>
              <TableHead className="text-xs">Priority</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center text-xs text-muted-foreground">
                  No tax rules configured yet. Use “Add Tax Rule” to create one.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="text-xs font-medium">{rule.name}</TableCell>
                  <TableCell className="text-xs">{typeLabel[rule.type] || rule.type}</TableCell>
                  <TableCell className="text-xs">
                    {rule.type === "CITY"
                      ? rule.cityTaxMode
                        ? `${rule.cityTaxAmount ?? 0} (${rule.cityTaxMode.replace("_", " ")})`
                        : "-"
                      : `${rule.percentage ?? 0}%`}
                  </TableCell>
                  <TableCell className="text-xs">{scopeLabel[rule.scope] || rule.scope}</TableCell>
                  <TableCell className="text-xs">{rule.priority}</TableCell>
                  <TableCell className="text-xs">
                    <Badge
                      variant={rule.active ? "default" : "outline"}
                      className={rule.active ? "bg-emerald-500/90" : "bg-slate-200 dark:bg-slate-700"}
                    >
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-right space-x-1">
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => onEdit(rule)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => onToggleStatus(rule)}
                    >
                      {rule.active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="h-7 px-2 text-red-500 hover:text-red-600"
                      onClick={() => onDelete(rule)}
                    >
                      Delete
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

