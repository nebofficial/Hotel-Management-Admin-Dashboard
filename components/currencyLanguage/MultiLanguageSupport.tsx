"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/app/language-context";

const LANG_OPTIONS = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "hi", name: "Hindi" },
  { code: "ne", name: "Nepali" },
  { code: "bho", name: "Bhojpuri" },
];

type Props = {
  enabledLanguages: string[];
  defaultLanguage: string;
  onChange: (field: string, value: string[] | string) => void;
};

export function MultiLanguageSupport({ enabledLanguages, defaultLanguage, onChange }: Props) {
  const { t } = useLanguage();
  const enabled = Array.isArray(enabledLanguages) ? enabledLanguages : ["en"];

  const toggle = (code: string) => {
    if (enabled.includes(code)) {
      onChange("enabledLanguages", enabled.filter((c) => c !== code));
    } else {
      onChange("enabledLanguages", [...enabled, code]);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-400/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">{t("currency_language.multi.title")}</p>
        <p className="text-xs text-amber-900/70 dark:text-amber-100/70">{t("currency_language.multi.subtitle")}</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          {LANG_OPTIONS.map((l) => (
            <div key={l.code} className="flex items-center gap-2">
              <Switch checked={enabled.includes(l.code)} onCheckedChange={() => toggle(l.code)} />
              <span className="text-sm">{l.name}</span>
            </div>
          ))}
        </div>
        <div>
          <Label className="text-xs">{t("currency_language.multi.default_language")}</Label>
          <select
            className="mt-2 flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={defaultLanguage || "en"}
            onChange={(e) => onChange("defaultLanguage", e.target.value)}
          >
            {LANG_OPTIONS.filter((l) => enabled.includes(l.code)).map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}
