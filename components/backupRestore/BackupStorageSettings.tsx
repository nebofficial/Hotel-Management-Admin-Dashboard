"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function BackupStorageSettings() {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold">Backup Storage Configuration</p>
        <p className="text-[11px] text-slate-300">
          Configure where backups are stored (local server, cloud, or FTP).
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Storage Type</Label>
          <select className="flex h-9 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-1 text-xs shadow-sm">
            <option>Local Server</option>
            <option>AWS S3</option>
            <option>Google Cloud Storage</option>
            <option>Azure Blob Storage</option>
            <option>Remote FTP</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Bucket / Path / Directory</Label>
          <Input
            className="h-9 text-xs bg-slate-900 border-slate-700"
            placeholder="e.g. s3://hotel-backups/ or /mnt/backups"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Access Key / Username</Label>
          <Input className="h-9 text-xs bg-slate-900 border-slate-700" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Secret Key / Password</Label>
          <Input
            type="password"
            className="h-9 text-xs bg-slate-900 border-slate-700"
          />
        </div>
      </div>
    </Card>
  );
}

