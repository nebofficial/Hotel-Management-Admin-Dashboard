"use client"

import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserAccessHeaderProps {
  onGrantAccess: () => void
}

export function UserAccessHeader({ onGrantAccess }: UserAccessHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-emerald-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Access Control</h1>
          <p className="text-sm text-gray-600">
            Manage user permissions and property access across your hotel group.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        className="h-8 gap-2 bg-red-600 text-xs font-semibold text-white hover:bg-red-700"
        onClick={onGrantAccess}
      >
        + Grant Access
      </Button>
    </div>
  )
}

