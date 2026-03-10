"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertySelectorProps {
  properties: { id: string; name: string }[]
  value: string
  onChange: (id: string) => void
}

export function PropertySelector({ properties, value, onChange }: PropertySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-56 border-slate-300 bg-white">
        <SelectValue placeholder="Select property" />
      </SelectTrigger>
      <SelectContent>
        {properties.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

