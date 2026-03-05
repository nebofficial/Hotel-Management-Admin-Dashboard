"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, Phone, MapPin, User } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface GuestViewContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotelId: string
  guestId: string | null
}

export function GuestViewContactDialog({
  open,
  onOpenChange,
  hotelId,
  guestId,
}: GuestViewContactDialogProps) {
  const [loading, setLoading] = useState(false)
  const [guest, setGuest] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: { line?: string }
    preferences?: {
      emergencyContactName?: string
      emergencyContactPhone?: string
      idProofUrl?: string
      profilePhotoUrl?: string
    }
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !guestId) {
      setGuest(null)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/api/hotel-data/${hotelId}/guests/${guestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load guest")
        return r.json()
      })
      .then((data) => setGuest(data?.guest || null))
      .catch(() => setError("Could not load contact information."))
      .finally(() => setLoading(false))
  }, [open, hotelId, guestId])

  const prefs = guest?.preferences || {}
  const address = guest?.address && typeof guest.address === "object" ? guest.address?.line : ""
  const photoUrl = prefs.profilePhotoUrl || prefs.idProofUrl || ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white shadow-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>View contact information</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : error ? (
          <p className="text-sm text-red-600 py-4">{error}</p>
        ) : guest ? (
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-500">Name</p>
                <p className="text-sm font-medium text-slate-900">
                  {[guest.firstName, guest.lastName].filter(Boolean).join(" ") || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-500">Email</p>
                <p className="text-sm text-slate-900">{guest.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-500">Phone</p>
                <p className="text-sm text-slate-900">{guest.phone || "—"}</p>
              </div>
            </div>
            {address ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Address</p>
                  <p className="text-sm text-slate-900">{address}</p>
                </div>
              </div>
            ) : null}
            {(prefs.emergencyContactName || prefs.emergencyContactPhone) ? (
              <div className="border-t pt-4 mt-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Emergency contact</p>
                <p className="text-sm text-slate-900">
                  {[prefs.emergencyContactName, prefs.emergencyContactPhone].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
            ) : null}
            <div className="border-t pt-4 mt-2">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Photo / ID proof <span className="text-red-500">*</span>
              </p>
              {photoUrl ? (
                <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={photoUrl}
                    alt="Guest photo or ID proof"
                    className="max-h-48 w-full object-contain"
                  />
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  Photo or ID proof has not been uploaded yet. Please upload it from the guest action menu.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-4">No guest selected.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
