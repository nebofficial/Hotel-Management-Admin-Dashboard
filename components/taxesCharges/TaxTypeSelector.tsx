"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TaxTypeSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Tax Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-xs">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GST">GST</SelectItem>
          <SelectItem value="VAT">VAT</SelectItem>
          <SelectItem value="SERVICE">Service Charge</SelectItem>
          <SelectItem value="CITY">City Tax</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

