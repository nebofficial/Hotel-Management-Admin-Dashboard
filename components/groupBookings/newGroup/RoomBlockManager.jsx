'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DEFAULT_ROOM_TYPES = ['Single', 'Double', 'Deluxe', 'Suite', 'Standard', 'Premium']

export default function RoomBlockManager({ value, onChange, availability, onValidate, roomTypes = [] }) {
  const blocks = Array.isArray(value) ? value : []

  const updateBlock = (index, patch) => {
    const next = blocks.map((b, i) => (i === index ? { ...b, ...patch } : b))
    onChange && onChange(next)
  }

  const addBlock = () => {
    onChange && onChange([...blocks, { roomType: '', quantity: 0, ratePerNight: 0 }])
  }

  const removeBlock = (index) => {
    const next = blocks.filter((_, i) => i !== index)
    onChange && onChange(next)
  }

  const getAvailabilityText = (roomType) => {
    if (!availability || !roomType) return ''
    const info = availability[roomType]
    if (!info) return ''
    return `Available: ${info.available}, Requested: ${info.requested}`
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white">
      <CardHeader>
        <CardTitle className="text-white text-sm">Room Block Management</CardTitle>
        <div className="text-xs text-sky-100/90">
          Select room types, enter quantities, and validate inventory in real time.
        </div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl space-y-3">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-white/10 rounded-xl px-3 py-2 text-xs"
          >
            <div>
              <Label className="text-sky-50">Room Type</Label>
              <Select
                value={block.roomType || undefined}
                onValueChange={(roomType) => updateBlock(index, { roomType: roomType || '' })}
              >
                <SelectTrigger className="mt-1 h-8 bg-white/15 text-sky-50 border-sky-100/40">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {(roomTypes.length ? roomTypes : DEFAULT_ROOM_TYPES).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sky-50">Quantity</Label>
              <Input
                type="number"
                min={0}
                value={block.quantity || 0}
                onChange={(e) => updateBlock(index, { quantity: Math.max(0, Number(e.target.value || 0)) })}
                className="mt-1 h-8 bg-white/15 text-sky-50 border-sky-100/40"
              />
            </div>
            <div>
              <Label className="text-sky-50">Rate / Night</Label>
              <Input
                type="number"
                min={0}
                value={block.ratePerNight || 0}
                onChange={(e) => updateBlock(index, { ratePerNight: Math.max(0, Number(e.target.value || 0)) })}
                className="mt-1 h-8 bg-white/15 text-sky-50 border-sky-100/40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-5 h-8 bg-white/80 text-blue-700 hover:bg-white"
                onClick={() => removeBlock(index)}
              >
                Remove
              </Button>
              <div className="text-[11px] text-sky-100/90">{getAvailabilityText(block.roomType)}</div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-sky-200 text-sky-50 hover:bg-sky-500/30"
            onClick={addBlock}
          >
            Add Room Type
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-white text-blue-700 hover:bg-blue-50"
            onClick={onValidate}
          >
            Validate Inventory
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

