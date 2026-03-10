"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  phone: string;
  email: string;
  website: string;
  onChange: (field: keyof Props, value: string) => void;
};

export function HotelContactInfoForm({ phone, email, website, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-400/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
          Contact Information
        </p>
        <p className="text-xs text-amber-900/70 dark:text-amber-100/70">
          Primary communication details for guests and partners.
        </p>
      </div>
      <div className="p-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2 md:col-span-1">
          <Label className="text-xs">Phone Number</Label>
          <Input
            value={phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2 md:col-span-1">
          <Label className="text-xs">Email Address</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="info@yourhotel.com"
          />
        </div>
        <div className="space-y-2 md:col-span-1">
          <Label className="text-xs">Website URL</Label>
          <Input
            value={website}
            onChange={(e) => onChange("website", e.target.value)}
            placeholder="https://www.yourhotel.com"
          />
        </div>
      </div>
    </Card>
  );
}

