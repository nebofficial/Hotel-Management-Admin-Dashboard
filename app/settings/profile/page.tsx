'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ProfileFieldKey =
  | "name"
  | "location"
  | "phone"
  | "email"
  | "website"
  | "plan"
  | "currency"
  | "language"
  | "timezone"
  | "dateFormat"
  | "timeFormat"
  | "currencySymbol"

type ProfileState = Record<ProfileFieldKey, string> & {
  logoUrl: string
}

const FIELD_CONFIG: { key: ProfileFieldKey; label: string }[] = [
  { key: "name", label: "Hotel Name" },
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "website", label: "Website" },
  { key: "plan", label: "Plan" },
  { key: "currency", label: "Currency" },
  { key: "language", label: "Language" },
  { key: "timezone", label: "Timezone" },
  { key: "dateFormat", label: "Date Format" },
  { key: "timeFormat", label: "Time Format" },
  { key: "currencySymbol", label: "Currency Symbol" },
]

const DEFAULT_PROFILE: ProfileState = {
  name: "Luxury Grand Hotel",
  location: "123 Main Street, New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "info@grandhotel.com",
  website: "www.grandhotel.com",
  plan: "Premium",
  currency: "USD",
  language: "English",
  timezone: "UTC+0",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "HH:mm",
  currencySymbol: "₹",
  logoUrl: "https://via.placeholder.com/150",
}

export default function HotelProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileState>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.hotelId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("token")
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

        const response = await fetch(
          `${API_BASE_URL}/api/hotel-data/${user.hotelId}/profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const incoming =
            "profile" in data ? (data.profile as Partial<ProfileState>) : (data as Partial<ProfileState>)

          setProfile((prev) => ({
            ...prev,
            ...incoming,
            logoUrl: incoming.logoUrl || prev.logoUrl,
          }))
        } else {
          console.error("Failed to load profile settings")
          setError("Failed to load profile settings")
        }
      } catch (err) {
        console.error("Error fetching profile settings:", err)
        setError("An error occurred while loading settings")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.hotelId])

  const handleChange = (key: ProfileFieldKey, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    if (!user?.hotelId) return

    try {
      setSaving(true)
      setError(null)

      const token = localStorage.getItem("token")
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      const response = await fetch(
        `${API_BASE_URL}/api/hotel-data/${user.hotelId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      )

      if (!response.ok) {
        console.error("Failed to save profile settings")
        setError("Failed to save profile settings")
        return
      }

      setIsEditing(false)
    } catch (err) {
      console.error("Error saving profile settings:", err)
      setError("An error occurred while saving settings")
    } finally {
      setSaving(false)
    }
  }

  const handleLogoFileChange = async (file: File | null) => {
    if (!user?.hotelId || !file) return

    try {
      setUploadingLogo(true)
      setError(null)

      // 1) Load the image in browser
      const imageDataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (e) => reject(e)
        reader.readAsDataURL(file)
      })

      const image: HTMLImageElement = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
        img.src = imageDataUrl
      })

      // 2) Center‑crop to square and resize to 512×512 via canvas
      const size = Math.min(image.width, image.height)
      const sx = (image.width - size) / 2
      const sy = (image.height - size) / 2

      const canvas = document.createElement("canvas")
      const targetSize = 512
      canvas.width = targetSize
      canvas.height = targetSize
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Failed to get canvas context")
      }

      ctx.drawImage(image, sx, sy, size, size, 0, 0, targetSize, targetSize)

      const croppedBlob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to crop image"))
          } else {
            resolve(blob)
          }
        }, "image/png")
      })

      // 3) Upload cropped image as a new file
      const token = localStorage.getItem("token")
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      const formData = new FormData()
      formData.append("logo", new File([croppedBlob], file.name.replace(/\.[^.]+$/, "") + "-cropped.png", { type: "image/png" }))

      const response = await fetch(
        `${API_BASE_URL}/api/hotel-data/${user.hotelId}/profile/logo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        console.error("Failed to upload logo")
        setError("Failed to upload logo")
        return
      }

      const data = await response.json()
      if (data.logoUrl) {
        setProfile((prev) => ({ ...prev, logoUrl: data.logoUrl }))
      }
    } catch (err) {
      console.error("Error uploading logo:", err)
      setError("An error occurred while uploading logo")
    } finally {
      setUploadingLogo(false)
    }
  }

  const profileFields = FIELD_CONFIG.map(({ key, label }) => ({
    key,
    label,
    value: profile[key],
  }))

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Hotel Profile</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your hotel&apos;s basic information and preferences.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-900">
              Profile details
            </CardTitle>
            <p className="text-xs text-gray-500">
              These details are shown across your dashboard and guest-facing apps.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            {error && (
              <p className="mb-3 text-xs text-red-500">
                {error}
              </p>
            )}

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {loading ? (
                  <p className="text-xs text-gray-400">Loading profile settings…</p>
                ) : (
                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                    {profileFields.map((field) => (
                      <div key={field.key} className="space-y-0.5">
                        <p className="text-xs font-medium text-gray-500">
                          {field.label}
                        </p>
                        {isEditing ? (
                          <input
                            title={field.label}
                            placeholder={field.label}
                            className="mt-0.5 w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5"
                            value={field.value}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 break-all">
                            {field.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <button
                  type="button"
                  disabled={loading || saving}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEditing ? (saving ? "Saving..." : "Save changes") : "Edit"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-[11px] text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-900">
              Branding
            </CardTitle>
            <p className="text-xs text-gray-500">
              Update your logo and key branding preferences.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white ring-2 ring-gray-100 shadow-sm">
                <img
                  src={profile.logoUrl || "https://via.placeholder.com/150"}
                  alt="Hotel logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Logo</p>
                <p className="text-[11px] text-gray-500">
                  Recommended 512×512px, PNG or SVG.
                </p>
                {isEditing ? (
                  <div className="space-y-1">
                    <label className="inline-flex cursor-pointer items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5">
                      <span>{uploadingLogo ? "Uploading..." : "Upload logo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoFileChange(e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="text-[10px] text-gray-400">
                      Upload an image file to update your logo.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Change logo
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Plan</span>
                {isEditing ? (
                  <input
                    title="Plan"
                    placeholder="Plan"
                    className="w-24 rounded-md border border-emerald-100 bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                    value={profile.plan}
                    onChange={(e) => handleChange("plan", e.target.value)}
                  />
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    {profile.plan || "—"}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <div>
                  <p className="text-gray-500">Currency</p>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        title="Currency code"
                        placeholder="USD"
                        className="w-16 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5"
                        value={profile.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                      />
                      <input
                        title="Currency symbol"
                        placeholder="₹"
                        className="w-10 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5"
                        value={profile.currencySymbol}
                        onChange={(e) =>
                          handleChange("currencySymbol", e.target.value)
                        }
                      />
                    </div>
                  ) : (
                    <p className="font-medium text-gray-900">
                      {profile.currency} ({profile.currencySymbol})
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500">Timezone</p>
                  {isEditing ? (
                    <input
                      title="Timezone"
                      placeholder="UTC+0"
                      className="w-full rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5"
                      value={profile.timezone}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profile.timezone}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500">Language</p>
                  {isEditing ? (
                    <input
                      title="Language"
                      placeholder="English"
                      className="w-full rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5"
                      value={profile.language}
                      onChange={(e) => handleChange("language", e.target.value)}
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profile.language}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500">Date / Time</p>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        title="Date format"
                        placeholder="MM/DD/YYYY"
                        className="w-24 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5"
                        value={profile.dateFormat}
                        onChange={(e) => handleChange("dateFormat", e.target.value)}
                      />
                      <span className="text-gray-400">·</span>
                      <input
                        title="Time format"
                        placeholder="HH:mm"
                        className="w-16 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/5"
                        value={profile.timeFormat}
                        onChange={(e) => handleChange("timeFormat", e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="font-medium text-gray-900">
                      {profile.dateFormat} · {profile.timeFormat}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
