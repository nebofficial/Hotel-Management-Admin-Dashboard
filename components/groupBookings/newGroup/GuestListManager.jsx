'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function GuestListManager({ value, onChange }) {
  const guests = Array.isArray(value) ? value : []

  const updateGuest = (index, patch) => {
    const next = guests.map((g, i) => (i === index ? { ...g, ...patch } : g))
    onChange && onChange(next)
  }

  const addGuest = () => {
    onChange &&
      onChange([
        ...guests,
        { name: '', phone: '', email: '', idType: '', idNumber: '', roomType: '', roomNumber: '' },
      ])
  }

  const removeGuest = (index) => {
    const next = guests.filter((_, i) => i !== index)
    onChange && onChange(next)
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white">
      <CardHeader>
        <CardTitle className="text-white text-sm">Guest List Manager</CardTitle>
        <div className="text-xs text-purple-100/90">
          Add multiple guests and optionally pre-assign them to room types or numbers.
        </div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl space-y-3 text-xs">
        {guests.map((guest, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white/10 rounded-xl px-3 py-2 items-end"
          >
            <div>
              <Label className="text-purple-50">Name</Label>
              <Input
                value={guest.name || ''}
                onChange={(e) => updateGuest(index, { name: e.target.value })}
                placeholder="Guest name"
                className="mt-1 h-8 bg-white/15 text-white placeholder:text-purple-100/70 border-purple-100/40"
              />
            </div>
            <div>
              <Label className="text-purple-50">Phone</Label>
              <Input
                value={guest.phone || ''}
                onChange={(e) => updateGuest(index, { phone: e.target.value })}
                placeholder="+977-9800000000"
                className="mt-1 h-8 bg-white/15 text-white border-purple-100/40"
              />
            </div>
            <div>
              <Label className="text-purple-50">Email</Label>
              <Input
                value={guest.email || ''}
                onChange={(e) => updateGuest(index, { email: e.target.value })}
                placeholder="guest@example.com"
                className="mt-1 h-8 bg-white/15 text-white border-purple-100/40"
              />
            </div>
            <div>
              <Label className="text-purple-50">Room Type</Label>
              <Input
                value={guest.roomType || ''}
                onChange={(e) => updateGuest(index, { roomType: e.target.value })}
                placeholder="e.g., Deluxe"
                className="mt-1 h-8 bg-white/15 text-white border-purple-100/40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-purple-50">Room #</Label>
              <Input
                value={guest.roomNumber || ''}
                onChange={(e) => updateGuest(index, { roomNumber: e.target.value })}
                placeholder="Optional"
                className="mt-1 h-8 bg-white/15 text-white border-purple-100/40"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-1 h-7 text-purple-50 hover:bg-purple-500/40"
                onClick={() => removeGuest(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-1">
          <Button
            type="button"
            size="sm"
            className="bg-white text-purple-700 hover:bg-purple-50"
            onClick={addGuest}
          >
            Add Guest
          </Button>
          <div className="text-[11px] text-purple-100/90">
            Guests linked to group automatically on save.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

