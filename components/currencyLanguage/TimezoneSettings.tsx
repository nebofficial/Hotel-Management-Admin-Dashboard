"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/app/language-context";

type Props = {
  timezone: string;
  autoTimeSync: boolean;
  onChange: (field: string, value: string | boolean) => void;
};

export function TimezoneSettings({ timezone, autoTimeSync, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <Card className="border-0 bg-gradient-to-br from-rose-500/10 via-red-400/5 to-orange-500/10 backdrop-blur">
      <div className="p-4 border-b border-rose-500/40">
        <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">{t("currency_language.timezone.title")}</p>
        <p className="text-xs text-rose-900/70 dark:text-rose-100/70">{t("currency_language.timezone.subtitle")}</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">{t("currency_language.timezone.default_timezone")}</Label>
          <Input value={timezone || ""} onChange={(e) => onChange("timezone", e.target.value)} placeholder="UTC+0" />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">{t("currency_language.timezone.auto_sync")}</Label>
          <Switch checked={!!autoTimeSync} onCheckedChange={(v) => onChange("autoTimeSync", v)} />
        </div>
      </div>
    </Card>
  );
}
