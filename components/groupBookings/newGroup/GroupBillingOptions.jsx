'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function GroupBillingOptions({ value, onChange }) {
  const mode = value || 'consolidated'

  const setMode = (next) => onChange && onChange(next)

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white">
      <CardHeader>
        <CardTitle className="text-white text-sm">Group Billing Mode</CardTitle>
        <div className="text-xs text-rose-100/90">
          Choose between consolidated billing (single invoice) or split billing (per room).
        </div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl text-xs">
        <RadioGroup
          value={mode}
          onValueChange={setMode}
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          <Label
            htmlFor="consolidated"
            className="flex flex-col gap-1 rounded-xl border border-white/40 bg-white/10 px-3 py-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="consolidated" value="consolidated" />
              <span className="font-semibold">Consolidated Billing</span>
            </div>
            <span className="text-rose-100/90">
              Single invoice for entire group. Company or organizer pays full amount.
            </span>
          </Label>
          <Label
            htmlFor="split"
            className="flex flex-col gap-1 rounded-xl border border-white/40 bg-white/10 px-3 py-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="split" value="split" />
              <span className="font-semibold">Split Billing</span>
            </div>
            <span className="text-rose-100/90">
              Individual invoices per room / guest. Ideal for event bookings.
            </span>
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

