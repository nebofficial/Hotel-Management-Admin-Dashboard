"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/app/language-context";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "hi", name: "Hindi" },
  { code: "ne", name: "Nepali" },
  { code: "bho", name: "Bhojpuri" },
  { code: "zh", name: "Chinese" },
];

type Props = {
  language: string;
  onChange: (field: string, value: string) => void;
};

export function LanguageSelector({ language, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-500/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/30">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">{t("currency_language.language.title")}</p>
        <p className="text-xs text-violet-900/70 dark:text-violet-100/70">{t("currency_language.language.subtitle")}</p>
      </div>
      <div className="p-4">
        <Label className="text-xs">{t("currency_language.language.system_language")}</Label>
        <select
          className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={language || "English"}
          onChange={(e) => onChange("language", e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.name}>{l.name}</option>
          ))}
        </select>
      </div>
    </Card>
  );
}
