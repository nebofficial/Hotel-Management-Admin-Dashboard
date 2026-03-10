"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/language-context";

type Props = {
  saving: boolean;
  onSave: () => void;
  onReset?: () => void;
};

export function SaveSettingsButton({ saving, onSave, onReset }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <Button
        size="sm"
        onClick={onSave}
        disabled={saving}
        className="bg-slate-900 text-slate-50 hover:bg-slate-800 shadow-lg shadow-emerald-500/30"
      >
        {saving ? t("currency_language.save.saving") : t("currency_language.save.save")}
      </Button>
      {onReset && (
        <Button type="button" variant="outline" size="sm" onClick={onReset} disabled={saving}>
          {t("currency_language.save.reset")}
        </Button>
      )}
    </div>
  );
}
