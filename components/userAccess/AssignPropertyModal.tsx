"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AssignPropertyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
  userName: string
  properties: { id: string; name: string }[]
  onSubmit: (hotelId: string, role: string) => Promise<void>
}

export function AssignPropertyModal({
  open,
  onOpenChange,
  userId,
  userName,
  properties,
  onSubmit,
}: AssignPropertyModalProps) {
  const [propertyId, setPropertyId] = useState("")
  const [role, setRole] = useState("staff")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setPropertyId("")
      setRole("staff")
    }
  }, [open])

  const handleSubmit = async () => {
    if (!propertyId || !userId) return
    setLoading(true)
    try {
      await onSubmit(propertyId, role)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-0 bg-gradient-to-br from-violet-50 to-purple-50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-violet-900">
            Assign User to Property
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p className="text-gray-700">
            Assign <span className="font-semibold">{userName || "selected user"}</span> to a
            specific property and role.
          </p>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Property</p>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger className="h-9 border-violet-200 bg-white">
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
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Role</p>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-9 border-violet-200 bg-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel_admin">Property Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-violet-600 text-white hover:bg-violet-700"
            disabled={loading || !propertyId || !userId}
            onClick={handleSubmit}
          >
            {loading ? "Assigning..." : "Assign Property"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

