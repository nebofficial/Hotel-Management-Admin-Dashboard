'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function GuestDetailsForm({ guest, onChange, hint }) {
  const set = (patch) => onChange((g) => ({ ...g, ...patch }))
  const setAddress = (patch) => onChange((g) => ({ ...g, address: { ...(g.address || {}), ...patch } }))

  const addressText =
    [
      guest?.address?.line1,
      guest?.address?.line2,
      guest?.address?.city,
      guest?.address?.state,
      guest?.address?.country,
      guest?.address?.zip,
    ]
      .filter(Boolean)
      .join(', ') || ''

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white">
      <CardHeader>
        <CardTitle className="text-white">Guest Details</CardTitle>
        <div className="text-white/80 text-sm">{hint || 'Auto-save guest profile if existing.'}</div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white/90">First Name</Label>
            <Input
              value={guest.firstName || ''}
              onChange={(e) => set({ firstName: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
          <div>
            <Label className="text-white/90">Last Name</Label>
            <Input
              value={guest.lastName || ''}
              onChange={(e) => set({ lastName: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
          <div>
            <Label className="text-white/90">Phone</Label>
            <Input
              value={guest.phone || ''}
              onChange={(e) => set({ phone: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
          <div>
            <Label className="text-white/90">Email</Label>
            <Input
              value={guest.email || ''}
              onChange={(e) => set({ email: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
          <div>
            <Label className="text-white/90">ID Proof Type</Label>
            <Select value={guest.idType || 'national_id'} onValueChange={(idType) => set({ idType })}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20">
                <SelectValue placeholder="Select ID Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="driving_license">Driving License</SelectItem>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white/90">ID Number</Label>
            <Input
              value={guest.idNumber || ''}
              onChange={(e) => set({ idNumber: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-white/90">Address</Label>
            <Textarea
              value={addressText}
              onChange={(e) => {
                // simple single-field input; also keep structured fields minimally
                setAddress({ line1: e.target.value })
              }}
              className="mt-1 bg-white/15 text-white border-white/20 min-h-[90px]"
              placeholder="Street, City, State, Country, ZIP"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

