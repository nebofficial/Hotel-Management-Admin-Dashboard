"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  onAdd: () => void;
};

export function TaxesHeader({ onAdd }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Taxes &amp; Charges</h1>
        <p className="text-xs text-muted-foreground">
          Configure GST, VAT, service charges, and city taxes for your hotel.
        </p>
      </div>
      <Button
        size="sm"
        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Tax Rule
      </Button>
    </div>
  );
}

