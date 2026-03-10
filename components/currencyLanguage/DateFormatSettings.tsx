"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/app/language-context";

const FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

type Props = {
  dateFormat: string;
  onChange: (field: string, value: string) => void;
};

export function DateFormatSettings({ dateFormat, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-rose-500/10 backdrop-blur">
      <div className="p-4 border-b border-orange-500/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">{t("currency_language.date.title")}</p>
        <p className="text-xs text-orange-900/70 dark:text-orange-100/70">{t("currency_language.date.subtitle")}</p>
      </div>
      <div className="p-4">
        <Label className="text-xs">{t("currency_language.date.date_format")}</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`rounded-md border px-3 py-1.5 text-sm ${dateFormat === f.value ? "border-orange-500 bg-orange-500/20" : "border-input"}`}
              onClick={() => onChange("dateFormat", f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
