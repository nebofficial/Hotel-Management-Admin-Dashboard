"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserSearchFiltersProps {
  name: string
  propertyId: string
  role: string
  accessLevel: string
  properties: { id: string; name: string }[]
  onChange: (next: {
    name?: string
    propertyId?: string
    role?: string
    accessLevel?: string
  }) => void
}

export function UserSearchFilters({
  name,
  propertyId,
  role,
  accessLevel,
  properties,
  onChange,
}: UserSearchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
      <Input
        placeholder="Search user name…"
        value={name}
        onChange={(e) => onChange({ name: e.target.value })}
        className="h-8 w-40 border-slate-200 bg-white"
      />
      <Select
        value={propertyId || "all"}
        onValueChange={(v) => onChange({ propertyId: v === "all" ? "" : v })}
      >
        <SelectTrigger className="h-8 w-40 border-slate-200 bg-white">
          <SelectValue placeholder="Property" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All properties</SelectItem>
          {properties.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={role || "all"}
        onValueChange={(v) => onChange({ role: v === "all" ? "" : v })}
      >
        <SelectTrigger className="h-8 w-36 border-slate-200 bg-white">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
          <SelectItem value="hotel_admin">Hotel Admin</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={accessLevel || "all"}
        onValueChange={(v) => onChange({ accessLevel: v === "all" ? "" : v })}
      >
        <SelectTrigger className="h-8 w-40 border-slate-200 bg-white">
          <SelectValue placeholder="Access level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          <SelectItem value="full">Full</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="limited">Limited</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

