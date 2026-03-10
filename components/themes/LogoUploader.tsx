"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadLogo } from "@/services/api/themeSettingsApi";
import { useAuth } from "@/app/auth-context";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

type LogoConfig = {
  url: string | null;
  size: "sm" | "md" | "lg";
  position: "sidebar" | "topbar";
  faviconUrl?: string | null;
};

type Props = {
  value: LogoConfig;
  onChange: (patch: Partial<LogoConfig>) => void;
};

export function LogoUploader({ value, onChange }: Props) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.hotelId) return;
    setUploading(true);
    setError(null);
    try {
      const data = await uploadLogo(API_BASE, user.hotelId, file);
      if (data.logoUrl) {
        onChange({ url: data.logoUrl });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-rose-500/10 via-pink-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-rose-400/40">
        <p className="text-sm font-semibold text-rose-900 dark:text-rose-50">
          Logo Customization
        </p>
        <p className="text-[11px] text-rose-900/70 dark:text-rose-100/80">
          Upload your hotel logo and configure its appearance.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Logo File</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="h-9 text-xs"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Browse"}
            </Button>
          </div>
          {error && <p className="text-[11px] text-red-600">{error}</p>}
        </div>
        {value.url && (
          <div className="space-y-1.5">
            <Label className="text-xs">Preview</Label>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md overflow-hidden border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value.url}
                  alt="Hotel logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[11px] text-slate-700 dark:text-slate-200">
                Displayed on the dashboard and login screen.
              </span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Logo Size</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              value={value.size}
              onChange={(e) =>
                onChange({ size: e.target.value as LogoConfig["size"] })
              }
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Logo Position</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              value={value.position}
              onChange={(e) =>
                onChange({ position: e.target.value as LogoConfig["position"] })
              }
            >
              <option value="sidebar">Sidebar</option>
              <option value="topbar">Topbar</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
}

