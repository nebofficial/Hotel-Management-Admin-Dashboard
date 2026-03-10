"use client";

import { Switch } from "@/components/ui/switch";

type Props = {
  active: boolean;
  onChange: (value: boolean) => void;
};

export function PaymentStatusToggle({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={active} onCheckedChange={onChange} />
      <span className="text-xs">{active ? "Enabled" : "Disabled"}</span>
    </div>
  );
}

