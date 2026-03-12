"use client";

import { Button } from "@/components/ui/button";

type Props = {
  disabled?: boolean;
  onClick: () => void;
};

export function QuickCheckoutButton({ disabled, onClick }: Props) {
  return (
    <Button
      size="sm"
      className="h-7 px-2.5 text-[10px] bg-sky-600 hover:bg-sky-500 text-white"
      disabled={disabled}
      onClick={onClick}
    >
      {disabled ? "Processing..." : "Quick Check-out"}
    </Button>
  );
}

