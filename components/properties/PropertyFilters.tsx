"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PropertyFiltersProps {
  search: string
  status: string
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
  onReset: () => void
}

export function PropertyFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: PropertyFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/80 px-3 py-2">
      <Search className="h-4 w-4 text-slate-500" />
      <Input
        placeholder="Search by name or location..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-8 w-48 border-slate-200"
      />
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="h-8 w-36 border-slate-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" variant="ghost" onClick={onReset} className="h-8 gap-1">
        <X className="h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  )
}
