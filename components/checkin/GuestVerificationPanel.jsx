'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ID_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'national_id', label: 'National ID / Aadhaar' },
  { value: 'other', label: 'Other' },
]

export default function GuestVerificationPanel({ guest, onChange }) {
  const g = guest || {}
  const set = (patch) => onChange?.({ ...g, ...patch })

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Guest Verification</CardTitle>
        <p className="text-white/80 text-sm">Confirm and update guest profile & ID details.</p>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Label className="text-white/90">Full Name</Label>
            <Input
              value={g.guestName || ''}
              onChange={(e) => set({ guestName: e.target.value })}
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-9"
              placeholder="Guest full name"
            />
          </div>
          <div>
            <Label className="text-white/90">Phone</Label>
            <Input
              value={g.guestPhone || ''}
              onChange={(e) => set({ guestPhone: e.target.value })}
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-9"
              placeholder="+91…"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Label className="text-white/90">Email</Label>
            <Input
              type="email"
              value={g.guestEmail || ''}
              onChange={(e) => set({ guestEmail: e.target.value })}
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-9"
              placeholder="guest@email.com"
            />
          </div>
          <div>
            <Label className="text-white/90">ID Proof Type</Label>
            <Select value={g.idType || ''} onValueChange={(val) => set({ idType: val })}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20 h-9">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {ID_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Label className="text-white/90">ID Number</Label>
            <Input
              value={g.idNumber || ''}
              onChange={(e) => set({ idNumber: e.target.value })}
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-9"
              placeholder="Enter ID number"
            />
          </div>
          <div>
            <Label className="text-white/90">City / Country</Label>
            <Input
              value={g.city || ''}
              onChange={(e) => set({ city: e.target.value })}
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-9"
              placeholder="City / Country"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

