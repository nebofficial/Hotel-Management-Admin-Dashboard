"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/language-context";

export type ExchangeRateItem = { pair: string; rate: number; lastUpdated?: string };

type Props = {
  exchangeRates: ExchangeRateItem[];
  onChange: (rates: ExchangeRateItem[]) => void;
};

export function ExchangeRateManager({ exchangeRates, onChange }: Props) {
  const { t } = useLanguage();
  const list = Array.isArray(exchangeRates) ? exchangeRates : [];

  const addRow = () => {
    onChange([...list, { pair: "USD_EUR", rate: 0.92, lastUpdated: new Date().toISOString().slice(0, 10) }]);
  };

  const updateRow = (index: number, field: keyof ExchangeRateItem, value: string | number) => {
    const next = [...list];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const removeRow = (index: number) => {
    onChange(list.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/30">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">{t("currency_language.exchange.title")}</p>
        <p className="text-xs text-sky-900/70 dark:text-sky-100/70">{t("currency_language.exchange.subtitle")}</p>
      </div>
      <div className="p-4 space-y-3">
        {list.map((row, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <Input className="w-28" value={row.pair || ""} onChange={(e) => updateRow(i, "pair", e.target.value)} placeholder="USD_EUR" />
            <Input type="number" step={0.0001} className="w-24" value={row.rate ?? ""} onChange={(e) => updateRow(i, "rate", e.target.value === "" ? 0 : Number(e.target.value))} placeholder={t("currency_language.exchange.rate")} />
            <Input className="w-32 text-xs" value={row.lastUpdated || ""} onChange={(e) => updateRow(i, "lastUpdated", e.target.value)} placeholder={t("currency_language.exchange.last_updated")} />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(i)}>{t("currency_language.exchange.remove")}</Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addRow}>{t("currency_language.exchange.add_rate")}</Button>
      </div>
    </Card>
  );
}
