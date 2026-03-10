"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  onChange: (field: keyof Omit<Props, "onChange">, value: string) => void;
};

export function HotelAddressForm({
  street,
  city,
  state,
  country,
  zip,
  onChange,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-red-500/10 backdrop-blur">
      <div className="p-4 border-b border-orange-500/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">
          Address & Location
        </p>
        <p className="text-xs text-orange-900/70 dark:text-orange-100/70">
          Define the exact physical location of your property.
        </p>
      </div>
      <div className="p-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs">Street Address</Label>
          <Input
            value={street}
            onChange={(e) => onChange("street", e.target.value)}
            placeholder="123 Main Street"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">City</Label>
          <Input
            value={city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="New York"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">State / Region</Label>
          <Input
            value={state}
            onChange={(e) => onChange("state", e.target.value)}
            placeholder="NY"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Country</Label>
          <Input
            value={country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="United States"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">ZIP / Postal Code</Label>
          <Input
            value={zip}
            onChange={(e) => onChange("zip", e.target.value)}
            placeholder="10001"
          />
        </div>
      </div>
    </Card>
  );
}

