'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function FromToStoreSelection({ locations, fromLocationId, toLocationId, onFromChange, onToChange }) {
  const fromLoc = locations?.find((l) => l.id === fromLocationId)
  const toLoc = locations?.find((l) => l.id === toLocationId)
  const filteredTo = locations?.filter((l) => l.id !== fromLocationId) || []
  const filteredFrom = locations?.filter((l) => l.id !== toLocationId) || []

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-900">
          <MapPin className="h-5 w-5" />
          From Store → To Store
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-700">From Store</Label>
            <Select value={fromLocationId || ''} onValueChange={onFromChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select source store" />
              </SelectTrigger>
              <SelectContent>
                {filteredFrom.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name} {loc.code ? `(${loc.code})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-700">To Store</Label>
            <Select value={toLocationId || ''} onValueChange={onToChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select destination store" />
              </SelectTrigger>
              <SelectContent>
                {filteredTo.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name} {loc.code ? `(${loc.code})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {(fromLoc || toLoc) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            {fromLoc && <span className="font-medium text-cyan-700">{fromLoc.name}</span>}
            {fromLoc && toLoc && <span>→</span>}
            {toLoc && <span className="font-medium text-blue-700">{toLoc.name}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
