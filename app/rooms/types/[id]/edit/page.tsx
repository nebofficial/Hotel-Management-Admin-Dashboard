"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { LayoutGrid, ArrowLeft } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function EditRoomTypePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [defaultCapacity, setDefaultCapacity] = useState("2")
  const [defaultPricePerNight, setDefaultPricePerNight] = useState("")
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!user?.hotelId || !id) {
      setLoading(false)
      return
    }
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/room-type-definitions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) {
          setNotFound(true)
          return null
        }
        return r.json()
      })
      .then((data) => {
        if (!data?.definition) {
          setLoading(false)
          return
        }
        const d = data.definition
        setName(d.name ?? "")
        setDescription(d.description ?? "")
        setDefaultCapacity(String(d.defaultCapacity ?? 2))
        setDefaultPricePerNight(String(d.defaultPricePerNight ?? ""))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [user?.hotelId, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!user?.hotelId || !id) return
    setSaving(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/room-type-definitions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
            defaultCapacity: Number(defaultCapacity) || 2,
            defaultPricePerNight: Number(defaultPricePerNight) || 0,
          }),
        }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data.message || "Failed to save"
        const details = Array.isArray(data.errors)
          ? data.errors.map((e: { msg?: string }) => e.msg).filter(Boolean).join(". ")
          : ""
        throw new Error(details ? `${msg}: ${details}` : msg)
      }
      router.push("/rooms/types")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update room type")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="p-4">
        <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />
      </main>
    )
  }

  if (notFound) {
    return (
      <main className="p-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">Room type not found.</p>
            <Button asChild>
              <Link href="/rooms/types">Back to Room Types</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-4">
      <RoomSectionHeader
        icon={LayoutGrid}
        title="Update Room Type"
        description="Edit name, description, and default capacity."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/rooms/types" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back to Room Types
            </Link>
          </Button>
        }
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Room type details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md" role="alert">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Default capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={defaultCapacity}
                  onChange={(e) => setDefaultCapacity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Default price per night</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={defaultPricePerNight}
                  onChange={(e) => setDefaultPricePerNight(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Update"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/rooms/types">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
