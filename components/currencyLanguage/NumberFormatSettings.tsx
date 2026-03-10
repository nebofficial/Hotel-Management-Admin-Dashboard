"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/app/language-context";

type Props = {
  thousandsSeparator: string;
  decimalSeparator: string;
  currencyRounding: string;
  onChange: (field: string, value: string) => void;
};

export function NumberFormatSettings({ thousandsSeparator, decimalSeparator, currencyRounding, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-300 dark:border-slate-600">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("currency_language.number.title")}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">{t("currency_language.number.subtitle")}</p>
      </div>
      <div className="p-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-xs">{t("currency_language.number.thousands_separator")}</Label>
          <Input value={thousandsSeparator ?? ""} onChange={(e) => onChange("thousandsSeparator", e.target.value)} placeholder="," />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">{t("currency_language.number.decimal_separator")}</Label>
          <Input value={decimalSeparator ?? ""} onChange={(e) => onChange("decimalSeparator", e.target.value)} placeholder="." />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">{t("currency_language.number.currency_rounding")}</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={currencyRounding || "nearest"}
            onChange={(e) => onChange("currencyRounding", e.target.value)}
          >
            <option value="nearest">{t("currency_language.number.rounding.nearest")}</option>
            <option value="up">{t("currency_language.number.rounding.up")}</option>
            <option value="down">{t("currency_language.number.rounding.down")}</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
