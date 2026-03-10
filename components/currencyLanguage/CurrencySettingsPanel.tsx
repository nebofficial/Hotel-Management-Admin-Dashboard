"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/app/language-context";

type Props = {
  currency: string;
  currencySymbol: string;
  decimalPrecision: number | string;
  onChange: (field: string, value: string | number) => void;
};

export function CurrencySettingsPanel({
  currency,
  currencySymbol,
  decimalPrecision,
  onChange,
}: Props) {
  const { t } = useLanguage();
  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/30">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          {t("currency_language.currency.title")}
        </p>
        <p className="text-xs text-emerald-900/70 dark:text-emerald-100/70">
          {t("currency_language.currency.subtitle")}
        </p>
      </div>
      <div className="p-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-xs">{t("currency_language.currency.default_currency")}</Label>
          <Input
            value={currency ?? ""}
            onChange={(e) => onChange("currency", e.target.value)}
            placeholder="USD"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">{t("currency_language.currency.symbol")}</Label>
          <Input
            value={currencySymbol ?? ""}
            onChange={(e) => onChange("currencySymbol", e.target.value)}
            placeholder="₹"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">{t("currency_language.currency.decimal_precision")}</Label>
          <Input
            type="number"
            min={0}
            max={6}
            value={decimalPrecision ?? ""}
            onChange={(e) =>
              onChange(
                "decimalPrecision",
                e.target.value === "" ? 2 : Number(e.target.value)
              )
            }
          />
        </div>
      </div>
    </Card>
  );
}
