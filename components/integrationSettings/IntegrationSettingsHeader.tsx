"use client";

import { Button } from "@/components/ui/button";

type Props = {
  saving: boolean;
  onRefresh: () => void;
};

export function IntegrationSettingsHeader({ saving, onRefresh }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Integration Settings
        </h1>
        <p className="text-xs text-muted-foreground">
          Connect payment gateways, OTAs, communication tools, and accounting apps.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={saving}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}

