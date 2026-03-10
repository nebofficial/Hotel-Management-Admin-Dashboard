"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type BrandingConfig = {
  logoUrl: string;
  brandColor: string;
  hotelName: string;
  address: string;
};

type Props = {
  value: BrandingConfig;
  onChange: (patch: Partial<BrandingConfig>) => void;
};

export function HotelBrandingPanel({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-300/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">Hotel Branding &amp; Logo</p>
        <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
          Make sure invoices reflect your hotel identity.
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Logo URL</Label>
          <Input
            className="h-9 text-xs"
            value={value.logoUrl}
            onChange={(e) => onChange({ logoUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Brand Color</Label>
          <Input
            className="h-9 text-xs"
            value={value.brandColor}
            onChange={(e) => onChange({ brandColor: e.target.value })}
            placeholder="#B91C1C"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Hotel Name</Label>
          <Input
            className="h-9 text-xs"
            value={value.hotelName}
            onChange={(e) => onChange({ hotelName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Hotel Address</Label>
          <Textarea
            className="min-h-[70px] text-xs"
            value={value.address}
            onChange={(e) => onChange({ address: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}

