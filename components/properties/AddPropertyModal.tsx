"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface AddPropertyForm {
  name: string
  address: string
  phone: string
  email: string
  hotelAdminEmail?: string
  hotelAdminName?: string
  hotelAdminPassword?: string
}

interface AddPropertyModalProps {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSubmit: (data: AddPropertyForm) => Promise<void>
}

export function AddPropertyModal(props: AddPropertyModalProps) {
  const { open, onOpenChange, onSubmit } = props
  const [form, setForm] = useState<AddPropertyForm>({
    name: "", address: "", phone: "", email: "",
    hotelAdminEmail: "", hotelAdminName: "", hotelAdminPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const payload = { ...form }
      if (!payload.hotelAdminEmail) delete payload.hotelAdminEmail
      if (!payload.hotelAdminName) delete payload.hotelAdminName
      if (!payload.hotelAdminPassword) delete payload.hotelAdminPassword
      await onSubmit(payload)
      setForm({ name: "", address: "", phone: "", email: "" })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-0 bg-gradient-to-br from-violet-50 to-purple-50 shadow-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-violet-900">Add New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Property Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Grand Hotel" required />
          </div>
          <div className="space-y-2">
            <Label>Address *</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, City" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="border-t border-violet-200 pt-4">
            <p className="mb-2 text-xs font-medium text-violet-700">Property Manager (optional)</p>
            <div className="space-y-2">
              <Input placeholder="Admin Email" type="email" value={form.hotelAdminEmail || ""} onChange={(e) => setForm({ ...form, hotelAdminEmail: e.target.value })} />
              <Input placeholder="Admin Name" value={form.hotelAdminName || ""} onChange={(e) => setForm({ ...form, hotelAdminName: e.target.value })} />
              <Input type="password" placeholder="Admin Password" value={form.hotelAdminPassword || ""} onChange={(e) => setForm({ ...form, hotelAdminPassword: e.target.value })} />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">{loading ? "Saving..." : "Save Property"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
