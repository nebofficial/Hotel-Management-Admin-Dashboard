"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  onChange: (field: keyof Omit<Props, "onChange">, value: string) => void;
};

export function SocialMediaLinksPanel({
  facebookUrl,
  instagramUrl,
  twitterUrl,
  linkedinUrl,
  onChange,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-orange-500/10 backdrop-blur">
      <div className="p-4 border-b border-rose-500/40">
        <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">
          Social Media Links
        </p>
        <p className="text-xs text-rose-900/70 dark:text-rose-100/70">
          Connect your digital presence for marketing and guest engagement.
        </p>
      </div>
      <div className="p-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">Facebook</Label>
          <Input
            value={facebookUrl}
            onChange={(e) => onChange("facebookUrl", e.target.value)}
            placeholder="https://facebook.com/yourhotel"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Instagram</Label>
          <Input
            value={instagramUrl}
            onChange={(e) => onChange("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/yourhotel"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Twitter (X)</Label>
          <Input
            value={twitterUrl}
            onChange={(e) => onChange("twitterUrl", e.target.value)}
            placeholder="https://x.com/yourhotel"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">LinkedIn</Label>
          <Input
            value={linkedinUrl}
            onChange={(e) => onChange("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/company/yourhotel"
          />
        </div>
      </div>
    </Card>
  );
}

