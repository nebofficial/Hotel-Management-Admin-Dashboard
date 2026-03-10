"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type FieldsConfig = {
  guestName: boolean;
  bookingId: boolean;
  roomCharges: boolean;
  serviceCharges: boolean;
  taxes: boolean;
  totalAmount: boolean;
};

type Props = {
  value: FieldsConfig;
  onChange: (patch: Partial<FieldsConfig>) => void;
};

export function InvoiceFieldsCustomizer({ value, onChange }: Props) {
  const toggle = (key: keyof FieldsConfig) => {
    onChange({ [key]: !value[key] } as Partial<FieldsConfig>);
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-rose-400/10 backdrop-blur">
      <div className="p-4 border-b border-orange-400/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">Customize Invoice Fields</p>
        <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
          Choose which sections appear on guest invoices.
        </p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2 text-xs">
        {[
          ["guestName", "Guest Name"],
          ["bookingId", "Booking ID"],
          ["roomCharges", "Room Charges"],
          ["serviceCharges", "Service Charges"],
          ["taxes", "Taxes"],
          ["totalAmount", "Total Amount"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-3 w-3"
              checked={value[key as keyof FieldsConfig]}
              onChange={() => toggle(key as keyof FieldsConfig)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}

