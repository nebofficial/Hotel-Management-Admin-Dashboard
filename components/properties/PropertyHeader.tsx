"use client"

import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface PropertyHeaderProps {
  onAddProperty: () => void
  canAdd?: boolean
}

export function PropertyHeader({ onAddProperty, canAdd = true }: PropertyHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-emerald-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Property List</h1>
          <p className="text-sm text-gray-600">Manage and maintain all hotel properties</p>
        </div>
      </div>
      {canAdd && (
        <Button onClick={onAddProperty} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Add New Property
        </Button>
      )}
    </div>
  )
}
