"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditPropertyModalProps {
  open: boolean
  onOpenChange: (o: boolean) => void
  property: { id: string; name: string; address: string; phone: string; email: string } | null
  onSubmit: (id: string, data: { name: string; address: string; phone: string; email: string }) => Promise<void>
}

export function EditPropertyModal(props: EditPropertyModalProps) {
  const { open, onOpenChange, property, onSubmit } = props
  const [form, setForm] = useState({ name: "", address: "", phone: "", email: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (property) setForm({ name: property.name, address: property.address, phone: property.phone, email: property.email })
  }, [property])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!property) return
    setError("")
    setLoading(true)
    try {
      await onSubmit(property.id, form)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-0 bg-gradient-to-br from-violet-50 to-purple-50 shadow-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-violet-900">Edit Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Property Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Address *</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">{loading ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
