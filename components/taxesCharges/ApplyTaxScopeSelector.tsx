"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function ApplyTaxScopeSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Apply To</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-xs">
          <SelectValue placeholder="Rooms / Services" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rooms">Rooms</SelectItem>
          <SelectItem value="services">Services</SelectItem>
          <SelectItem value="both">Rooms &amp; Services</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

