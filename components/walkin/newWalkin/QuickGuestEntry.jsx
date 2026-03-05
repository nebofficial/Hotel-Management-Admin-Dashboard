'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Phone, Mail, Users, CreditCard } from 'lucide-react'

const ID_PROOF_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'voter_id', label: 'Voter ID' },
  { value: 'pan_card', label: 'PAN Card' },
  { value: 'other', label: 'Other' },
]

export default function QuickGuestEntry({ walkinNumber, value, onChange, onPhoneLookup, existingGuest }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })
  const phoneRef = useRef(null)

  useEffect(() => {
    if (existingGuest && existingGuest.firstName) {
      const fullName = `${existingGuest.firstName} ${existingGuest.lastName || ''}`.trim()
      set({
        guestName: fullName,
        guestEmail: existingGuest.email || v.guestEmail,
        idProofType: existingGuest.idType || v.idProofType,
        idProofNumber: existingGuest.idNumber || v.idProofNumber,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingGuest])

  const handlePhoneBlur = () => {
    if (v.guestPhone && v.guestPhone.length >= 10 && onPhoneLookup) {
      onPhoneLookup(v.guestPhone)
    }
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <User className="h-5 w-5" />
          Quick Guest Entry
        </CardTitle>
        <p className="text-white/80 text-sm">Fast guest registration with tab-based navigation</p>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white/90 text-sm">Walk-in Number</Label>
              <span className="text-white font-bold text-lg tracking-wide bg-white/20 px-3 py-1 rounded-lg">
                {walkinNumber || '—'}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <User className="h-3 w-3" /> Guest Name *
            </Label>
            <Input
              value={v.guestName || ''}
              onChange={(e) => set({ guestName: e.target.value })}
              placeholder="Full name"
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-10 focus:bg-white/25"
              tabIndex={1}
            />
          </div>

          <div>
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <Phone className="h-3 w-3" /> Phone Number *
            </Label>
            <Input
              ref={phoneRef}
              value={v.guestPhone || ''}
              onChange={(e) => set({ guestPhone: e.target.value })}
              onBlur={handlePhoneBlur}
              placeholder="+91 9876543210"
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-10 focus:bg-white/25"
              tabIndex={2}
            />
            {existingGuest && (
              <p className="text-xs text-emerald-200 mt-1">Returning guest - details auto-filled</p>
            )}
          </div>

          <div>
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <Mail className="h-3 w-3" /> Email (Optional)
            </Label>
            <Input
              type="email"
              value={v.guestEmail || ''}
              onChange={(e) => set({ guestEmail: e.target.value })}
              placeholder="guest@email.com"
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-10 focus:bg-white/25"
              tabIndex={3}
            />
          </div>

          <div>
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <Users className="h-3 w-3" /> Number of Guests
            </Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={v.numberOfGuests || 1}
              onChange={(e) => set({ numberOfGuests: Math.max(1, Number(e.target.value || 1)) })}
              className="mt-1 bg-white/15 text-white border-white/20 h-10 focus:bg-white/25"
              tabIndex={4}
            />
          </div>

          <div>
            <Label className="text-white/90 text-sm flex items-center gap-1">
              <CreditCard className="h-3 w-3" /> ID Proof Type
            </Label>
            <Select value={v.idProofType || ''} onValueChange={(val) => set({ idProofType: val })}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20 h-10" tabIndex={5}>
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {ID_PROOF_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/90 text-sm">ID Number</Label>
            <Input
              value={v.idProofNumber || ''}
              onChange={(e) => set({ idProofNumber: e.target.value })}
              placeholder="Enter ID number"
              className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-10 focus:bg-white/25"
              tabIndex={6}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
