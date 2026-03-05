'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export interface HappyHourConfig {
  enabled: boolean
  start: string // "HH:mm"
  end: string // "HH:mm"
  discountPercent: number
}

function toMinutes(hhmm: string) {
  const [h, m] = String(hhmm || "00:00").split(":").map((x) => Number(x))
  return (h || 0) * 60 + (m || 0)
}

function isNowInRange(start: string, end: string, now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes()
  const s = toMinutes(start)
  const e = toMinutes(end)
  if (s === e) return false
  // supports wrap (e.g., 22:00 -> 01:00)
  if (s < e) return mins >= s && mins <= e
  return mins >= s || mins <= e
}

interface Props {
  value: HappyHourConfig
  onChange: (next: HappyHourConfig) => void
}

export default function HappyHourIntegration({ value, onChange }: Props) {
  const active = value.enabled && isNowInRange(value.start, value.end)

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Happy Hour Integration
            <Badge className="bg-white/15 text-white border-none">
              {active ? "Active now" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Automatically applies discount pricing inside the Bar Orders flow based
          on selected time window.
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4 grid gap-4 md:grid-cols-4">
          <div className="flex items-center justify-between gap-3 md:col-span-1">
            <div>
              <div className="text-sm font-medium text-slate-900">Enable</div>
              <div className="text-xs text-slate-500">Turn happy hour on/off</div>
            </div>
            <Switch
              aria-label="Enable happy hour"
              checked={value.enabled}
              onCheckedChange={(checked) =>
                onChange({ ...value, enabled: Boolean(checked) })
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="happyhour-start">Start time</Label>
            <Input
              id="happyhour-start"
              aria-label="Happy hour start time"
              type="time"
              value={value.start}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="happyhour-end">End time</Label>
            <Input
              id="happyhour-end"
              aria-label="Happy hour end time"
              type="time"
              value={value.end}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="happyhour-discount">Discount (%)</Label>
            <Input
              id="happyhour-discount"
              aria-label="Happy hour discount percentage"
              type="number"
              min={0}
              max={90}
              value={value.discountPercent}
              onChange={(e) =>
                onChange({
                  ...value,
                  discountPercent: Number(e.target.value || 0),
                })
              }
            />
            <div className="text-xs text-slate-500">
              Tip: keep between 10–25% for bar menus.
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

