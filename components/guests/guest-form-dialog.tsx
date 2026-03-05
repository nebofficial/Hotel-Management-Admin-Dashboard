"use client"

import { useEffect, useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const ID_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "national_id", label: "National ID" },
  { value: "other", label: "Other" },
]

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  idType: string
  idNumber: string
  emergencyContactName: string
  emergencyContactPhone: string
  address: string
  profilePhotoUrl: string
  idProofUrl: string
}

const defaultForm: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  idType: "",
  idNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  address: "",
  profilePhotoUrl: "",
  idProofUrl: "",
}

interface GuestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotelId: string
  onSuccess: () => void
  /** When set, dialog is in edit mode: fetch guest, prefill, and PUT on save */
  guestId?: string | null
}

export function GuestFormDialog({
  open,
  onOpenChange,
  hotelId,
  onSuccess,
  guestId,
}: GuestFormDialogProps) {
  const [form, setForm] = useState<FormValues>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const guestPhotoInputRef = useRef<HTMLInputElement | null>(null)
  const idPhotoInputRef = useRef<HTMLInputElement | null>(null)
  const isEdit = Boolean(guestId)

  useEffect(() => {
    if (!open) return
    setSaving(false)
    setError(null)
    if (!guestId) {
      setForm(defaultForm)
      return
    }
    setLoading(true)
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/api/hotel-data/${hotelId}/guests/${guestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const g = data?.guest
        if (!g) {
          setForm(defaultForm)
          return
        }
        const prefs = g.preferences || {}
        const addr = g.address
        setForm({
          firstName: g.firstName || "",
          lastName: g.lastName || "",
          email: g.email || "",
          phone: g.phone || "",
          dateOfBirth: g.dateOfBirth ? g.dateOfBirth.slice(0, 10) : "",
          idType: g.idType || "",
          idNumber: g.idNumber || "",
          emergencyContactName: prefs.emergencyContactName || "",
          emergencyContactPhone: prefs.emergencyContactPhone || "",
          address: typeof addr === "object" && addr?.line ? addr.line : "",
          profilePhotoUrl: prefs.profilePhotoUrl || "",
          idProofUrl: prefs.idProofUrl || "",
        })
      })
      .catch(() => setForm(defaultForm))
      .finally(() => setLoading(false))
  }, [open, hotelId, guestId])

  const submit = async () => {
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const email = form.email.trim()
    const phone = form.phone.trim()
    if (!firstName || !lastName || !email || !phone) {
      setError("First name, last name, email, and phone are required.")
      return
    }
    if (!form.idType) {
      setError("ID type is required.")
      return
    }
    if (!form.profilePhotoUrl || !form.idProofUrl) {
      setError("Guest photo and ID proof photo are required.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const body: Record<string, unknown> = {
        firstName,
        lastName,
        email,
        phone,
      }
      if (form.dateOfBirth) body.dateOfBirth = form.dateOfBirth
      if (form.idType) body.idType = form.idType
      if (form.idNumber.trim()) body.idNumber = form.idNumber.trim()
      if (form.address.trim()) body.address = { line: form.address.trim() }
      const preferences: Record<string, unknown> = {}
      if (form.emergencyContactName.trim() || form.emergencyContactPhone.trim()) {
        preferences.emergencyContactName = form.emergencyContactName.trim() || null
        preferences.emergencyContactPhone = form.emergencyContactPhone.trim() || null
      }
      if (form.profilePhotoUrl) {
        preferences.profilePhotoUrl = form.profilePhotoUrl
      }
      if (form.idProofUrl) {
        preferences.idProofUrl = form.idProofUrl
      }
      if (Object.keys(preferences).length > 0) {
        body.preferences = preferences
      }

      const url = isEdit
        ? `${API_BASE}/api/hotel-data/${hotelId}/guests/${guestId}`
        : `${API_BASE}/api/hotel-data/${hotelId}/guests`
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        let message = "Failed to add guest"
        try {
          const data = text ? JSON.parse(text) : {}
          message = data?.message || message
          if (Array.isArray(data?.errors) && data.errors.length) {
            const parts = data.errors
              .map((e: { msg?: string; message?: string; param?: string }) =>
                e?.msg || e?.message || e?.param
              )
              .filter(Boolean)
            if (parts.length) message = `${message}: ${parts.join(", ")}`
          }
        } catch {
          // ignore
        }
        throw new Error(`${message} (HTTP ${res.status})`)
      }

      onOpenChange(false)
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : isEdit ? "Failed to update guest" : "Failed to add guest")
    } finally {
      setSaving(false)
    }
  }

  const canSubmit =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.idType.trim().length > 0 &&
    form.profilePhotoUrl.trim().length > 0 &&
    form.idProofUrl.trim().length > 0 &&
    !saving

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-xl"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {isEdit ? "Edit guest details" : "Add new guest"}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading guest…</div>
        ) : (
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guest-firstName">First name *</Label>
              <Input
                id="guest-firstName"
                placeholder="e.g. John"
                value={form.firstName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, firstName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-lastName">Last name *</Label>
              <Input
                id="guest-lastName"
                placeholder="e.g. Doe"
                value={form.lastName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, lastName: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-email">Email *</Label>
            <Input
              id="guest-email"
              type="email"
              placeholder="guest@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-phone">Phone *</Label>
            <Input
              id="guest-phone"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-address">Address (optional)</Label>
            <Input
              id="guest-address"
              placeholder="Street, city, country"
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guest-dob">Date of birth (optional)</Label>
              <Input
                id="guest-dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm((p) => ({ ...p, dateOfBirth: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>ID type *</Label>
              <Select
                value={form.idType || "none"}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, idType: v === "none" ? "" : v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {ID_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-idNumber">ID number (optional)</Label>
            <Input
              id="guest-idNumber"
              placeholder="ID or document number"
              value={form.idNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, idNumber: e.target.value }))
              }
            />
          </div>
          <div className="border-t pt-4 mt-2">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Photos (required)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest-photo-file">Guest photo *</Label>
                <input
                  id="guest-photo-file"
                  ref={guestPhotoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  title="Guest photo file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const url = typeof reader.result === "string" ? reader.result : ""
                      setForm((p) => ({ ...p, profilePhotoUrl: url }))
                    }
                    reader.readAsDataURL(file)
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => guestPhotoInputRef.current?.click()}
                  aria-describedby="guest-photo-file"
                >
                  {form.profilePhotoUrl ? "Change photo" : "Upload guest photo"}
                </Button>
                {form.profilePhotoUrl && (
                  <div className="mt-2 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src={form.profilePhotoUrl}
                      alt="Guest photo preview"
                      className="max-h-40 w-full object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-id-photo-file">ID proof photo *</Label>
                <input
                  id="guest-id-photo-file"
                  ref={idPhotoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  title="Guest ID proof file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const url = typeof reader.result === "string" ? reader.result : ""
                      setForm((p) => ({ ...p, idProofUrl: url }))
                    }
                    reader.readAsDataURL(file)
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => idPhotoInputRef.current?.click()}
                  aria-describedby="guest-id-photo-file"
                >
                  {form.idProofUrl ? "Change ID proof" : "Upload ID proof"}
                </Button>
                {form.idProofUrl && (
                  <div className="mt-2 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src={form.idProofUrl}
                      alt="ID proof preview"
                      className="max-h-40 w-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-t pt-4 mt-2">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Emergency contact (optional)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest-emergencyName">Name</Label>
                <Input
                  id="guest-emergencyName"
                  placeholder="Contact name"
                  value={form.emergencyContactName}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      emergencyContactName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-emergencyPhone">Phone</Label>
                <Input
                  id="guest-emergencyPhone"
                  placeholder="+91 98765 43210"
                  value={form.emergencyContactPhone}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      emergencyContactPhone: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="button" onClick={submit} disabled={!canSubmit}>
              {saving ? "Saving…" : isEdit ? "Update guest" : "Save guest"}
            </Button>
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
