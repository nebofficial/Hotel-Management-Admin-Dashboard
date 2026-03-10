"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function FooterNotesEditor({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-300 dark:border-slate-600">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Footer Notes Configuration
        </p>
        <p className="text-[11px] text-slate-700 dark:text-slate-300">
          Add payment instructions, thank you message, and terms &amp; conditions.
        </p>
      </div>
      <div className="p-4 space-y-2">
        <Label className="text-xs">Footer Notes</Label>
        <Textarea
          className="min-h-[90px] text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"Payment instructions\nThank you message\nTerms & conditions"}
        />
      </div>
    </Card>
  );
}

