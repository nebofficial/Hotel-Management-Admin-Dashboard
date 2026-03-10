"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  description: string;
  openingTime: string;
  closingTime: string;
  onChange: (field: keyof Props, value: string) => void;
};

export function HotelBasicInfoForm({
  name,
  description,
  openingTime,
  closingTime,
  onChange,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-indigo-500/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/30">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">
          Basic Hotel Information
        </p>
        <p className="text-xs text-sky-900/70 dark:text-sky-100/70">
          Core details about your property and operating hours.
        </p>
      </div>
      <div className="p-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">Hotel Name</Label>
          <Input
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Luxury Grand Hotel"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs">Short Description</Label>
          <Textarea
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe your hotel in 1–2 sentences for guests and internal users."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Opening Time</Label>
          <Input
            type="time"
            value={openingTime}
            onChange={(e) => onChange("openingTime", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Closing Time</Label>
          <Input
            type="time"
            value={closingTime}
            onChange={(e) => onChange("closingTime", e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}

