'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function MasterGroupInfo({ masterGroupId, onMasterGroupIdChange, value, onChange }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <CardHeader>
        <CardTitle className="text-white">Master Group Creation</CardTitle>
        <div className="text-white/80 text-sm">🧾 Master Group ID auto-generated on load (editable).</div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <Label className="text-white/90">Master Group ID</Label>
            <Input
              value={masterGroupId || ''}
              onChange={(e) => onMasterGroupIdChange && onMasterGroupIdChange(e.target.value)}
              className="mt-1 bg-white/15 text-white placeholder:text-white/70 border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Group / Event Name</Label>
            <Input
              value={v.groupName || ''}
              onChange={(e) => set({ groupName: e.target.value })}
              placeholder="e.g., ABC Corp Annual Meet"
              className="mt-1 bg-white/15 text-white placeholder:text-white/70 border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Company Name</Label>
            <Input
              value={v.companyName || ''}
              onChange={(e) => set({ companyName: e.target.value })}
              placeholder="Company / Organizer"
              className="mt-1 bg-white/15 text-white placeholder:text-white/70 border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Total Rooms Required</Label>
            <Input
              type="number"
              min={1}
              value={v.totalRoomsRequired || 0}
              onChange={(e) => set({ totalRoomsRequired: Math.max(0, Number(e.target.value || 0)) })}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div>
            <Label className="text-white/90">Contact Person</Label>
            <Input
              value={v.contactName || ''}
              onChange={(e) => set({ contactName: e.target.value })}
              placeholder="Primary contact"
              className="mt-1 bg-white/15 text-white placeholder:text-white/70 border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Contact Phone</Label>
            <Input
              value={v.contactPhone || ''}
              onChange={(e) => set({ contactPhone: e.target.value })}
              placeholder="+977-9800000000"
              className="mt-1 bg-white/15 text-white placeholder:text-white/70 border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Contact Email</Label>
            <Input
              value={v.contactEmail || ''}
              onChange={(e) => set({ contactEmail: e.target.value })}
              placeholder="contact@example.com"
              className="mt-1 bg-white/15 text-white placeholder:text-white/70 border-white/20 h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div>
            <Label className="text-white/90">Check-in</Label>
            <Input
              type="date"
              value={v.checkIn || ''}
              onChange={(e) => set({ checkIn: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Check-out</Label>
            <Input
              type="date"
              value={v.checkOut || ''}
              onChange={(e) => set({ checkOut: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

