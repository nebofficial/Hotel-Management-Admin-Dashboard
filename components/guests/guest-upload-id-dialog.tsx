"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface GuestUploadIdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotelId: string
  guestId: string | null
  onSuccess: () => void
}

export function GuestUploadIdDialog({
  open,
  onOpenChange,
  hotelId,
  guestId,
  onSuccess,
}: GuestUploadIdDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setFile(null)
    setPreview(null)
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.).")
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.")
      return
    }
    setError(null)
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }

  const submit = async () => {
    if (!guestId || !preview) {
      setError("Please select an image first.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/api/hotel-data/${hotelId}/guests/${guestId}`, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: { idProofUrl: preview },
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Failed to save ID proof.")
      }
      onOpenChange(false)
      reset()
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload.")
    } finally {
      setSaving(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white shadow-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>Upload ID proof photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
            <input
            id="guest-id-proof-file"
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Choose ID proof image file"
          />
          <div className="space-y-2">
            <Label htmlFor="guest-id-proof-file">Select image (passport, license, etc.)</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              {file ? file.name : "Choose file"}
            </Button>
          </div>
          {preview && (
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
              <img src={preview} alt="ID preview" className="max-h-48 w-full object-contain" />
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={submit} disabled={!preview || saving}>
              {saving ? "Saving…" : "Save ID proof"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
