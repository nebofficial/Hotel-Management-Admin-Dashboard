"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AssignPropertyManagerProps {
  open: boolean
  onOpenChange: (o: boolean) => void
  propertyId: string | null
  propertyName: string
  users: { id: string; name: string; email: string; hotel?: { name: string } }[]
  onSubmit: (propertyId: string, userId: string) => Promise<void>
}

export function AssignPropertyManager({
  open,
  onOpenChange,
  propertyId,
  propertyName,
  users,
  onSubmit,
}: AssignPropertyManagerProps) {
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) setUserId("")
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!propertyId || !userId) {
      setError("Please select a user")
      return
    }
    setError("")
    setLoading(true)
    try {
      await onSubmit(propertyId, userId)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-0 bg-gradient-to-br from-orange-50 to-amber-50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-orange-900">
            Assign Property Manager
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-orange-800">Assign a staff member as manager for {propertyName}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Staff Member</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">{loading ? "Assigning..." : "Assign"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
