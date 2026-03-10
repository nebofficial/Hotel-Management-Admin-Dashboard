"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type InvoiceTemplateRow = {
  id: string;
  name: string;
  isDefault: boolean;
  active: boolean;
  layoutStyle: string;
  lastEditedAt?: string | null;
};

type Props = {
  templates: InvoiceTemplateRow[];
  onEdit: (row: InvoiceTemplateRow) => void;
  onPreview: (row: InvoiceTemplateRow) => void;
  onDelete: (row: InvoiceTemplateRow) => void;
};

export function InvoiceTemplatesTable({ templates, onEdit, onPreview, onDelete }: Props) {
  return (
    <div className="border-0 rounded-xl bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 p-4 shadow-sm">
      <div className="mb-2">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">Invoice Templates</p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          Manage multiple invoice layouts and set a default template.
        </p>
      </div>
      <div className="rounded-lg bg-white/70 dark:bg-slate-900/60 border border-sky-100 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-50/70 dark:bg-slate-800/70">
              <TableHead className="text-xs">Template Name</TableHead>
              <TableHead className="text-xs">Default</TableHead>
              <TableHead className="text-xs">Layout</TableHead>
              <TableHead className="text-xs">Last Updated</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                  No invoice templates created yet. Use “New Template” to create your first layout.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs font-medium">{t.name}</TableCell>
                  <TableCell className="text-xs">{t.isDefault ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-xs">{t.layoutStyle}</TableCell>
                  <TableCell className="text-xs">
                    {t.lastEditedAt ? new Date(t.lastEditedAt).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-right space-x-1">
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => onEdit(t)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => onPreview(t)}
                    >
                      Preview
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="h-7 px-2 text-red-500 hover:text-red-600"
                      onClick={() => onDelete(t)}
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

