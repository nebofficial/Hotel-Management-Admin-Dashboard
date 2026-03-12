"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SecurityPatch } from "./SystemUpdatesDashboard";

type Props = {
  patches: SecurityPatch[];
  patchingId: string | null;
  onApplyPatch: (id: string) => Promise<void>;
};

export function SecurityPatchPanel({ patches, patchingId, onApplyPatch }: Props) {
  const hasAny = patches && patches.length > 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-rose-500/20 via-red-500/15 to-orange-500/20 backdrop-blur">
      <div className="p-4 border-b border-red-500/50">
        <p className="text-sm font-semibold text-red-50">Security Patch Updates</p>
        <p className="text-[11px] text-red-100/90">
          Apply critical security patches to keep the system protected.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs text-red-50">
        {!hasAny && (
          <p className="text-[11px] text-red-50/80">
            No pending security patches. Your system is up to date.
          </p>
        )}

        {hasAny && (
          <div className="space-y-2">
            {patches.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-1 rounded-md bg-red-900/50 border border-red-400/60 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-semibold">
                      {p.title || p.code || "Security patch"}
                    </p>
                    {p.code && (
                      <p className="text-[11px] text-red-100/80">{p.code}</p>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/30 text-[11px] capitalize">
                    {p.severity || "critical"}
                  </span>
                </div>
                {p.notes && (
                  <p className="text-[11px] text-red-100/90 line-clamp-2">
                    {p.notes}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {p.installedAt && (
                    <p className="text-[10px] text-red-100/75">
                      Installed{" "}
                      {new Date(p.installedAt).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200/80 text-red-50 hover:bg-red-500/40 hover:text-white"
                    onClick={() => {
                      void onApplyPatch(p.id);
                    }}
                    disabled={patchingId === p.id || p.status === "installed"}
                  >
                    {p.status === "installed"
                      ? "Applied"
                      : patchingId === p.id
                      ? "Applying..."
                      : "Apply Patch"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

