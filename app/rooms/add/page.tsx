"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, ArrowLeft, Sparkles, BedDouble, CreditCard, Users } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const BED_TYPES = ["Single", "Twin", "Double", "Queen", "King", "Other"]
const ROOM_STATUS = [
  { value: "available", label: "Vacant" },
  { value: "occupied", label: "Occupied" },
]
const CLEANING_STATUS = [
  { value: "clean", label: "Clean" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
]
const MAINTENANCE_STATUS = [
  { value: "ok", label: "OK" },
  { value: "required", label: "Required" },
  { value: "in_progress", label: "In progress" },
]
const AC_OPTIONS = [
  { value: "AC", label: "AC" },
  { value: "Non-AC", label: "Non-AC" },
]

const AMENITY_OPTIONS = [
  "Wi‑Fi",
  "TV",
  "AC",
  "Mini bar",
  "Safe",
  "Coffee maker",
  "Parking",
  "Breakfast",
  "Swimming pool",
  "Gym",
]

interface RoomTypeDef {
  name: string
  defaultCapacity?: number
  defaultPricePerNight?: number
}

/** Default room type options so the dropdown always has Single, Double, Deluxe, Suite, etc. */
const DEFAULT_ROOM_TYPE_OPTIONS: RoomTypeDef[] = [
  { name: "Single", defaultCapacity: 2, defaultPricePerNight: 80 },
  { name: "Double", defaultCapacity: 2, defaultPricePerNight: 120 },
  { name: "Triple", defaultCapacity: 3, defaultPricePerNight: 150 },
  { name: "Quad", defaultCapacity: 4, defaultPricePerNight: 180 },
  { name: "Standard", defaultCapacity: 2, defaultPricePerNight: 100 },
  { name: "Superior", defaultCapacity: 2, defaultPricePerNight: 140 },
  { name: "Deluxe", defaultCapacity: 2, defaultPricePerNight: 180 },
  { name: "Suite", defaultCapacity: 4, defaultPricePerNight: 280 },
  { name: "Queen", defaultCapacity: 2, defaultPricePerNight: 130 },
  { name: "King", defaultCapacity: 2, defaultPricePerNight: 150 },
  { name: "Twin", defaultCapacity: 2, defaultPricePerNight: 110 },
  { name: "Studio", defaultCapacity: 2, defaultPricePerNight: 160 },
  { name: "Apartment-Style", defaultCapacity: 4, defaultPricePerNight: 200 },
]

export default function AddRoomPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomTypes, setRoomTypes] = useState<RoomTypeDef[]>([])
  const [roomNumber, setRoomNumber] = useState("")
  const [floor, setFloor] = useState(1)
  const [roomType, setRoomType] = useState("")
  const [pricePerNight, setPricePerNight] = useState("")
  const [capacity, setCapacity] = useState(2)
  const [bedType, setBedType] = useState("")
  const [amenitiesText, setAmenitiesText] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [roomStatus, setRoomStatus] = useState("available")
  const [cleaningStatus, setCleaningStatus] = useState("clean")
  const [maintenanceStatus, setMaintenanceStatus] = useState("ok")
  const [acOption, setAcOption] = useState("")
  const [roomView, setRoomView] = useState("")
  const [extraGuestCharges, setExtraGuestCharges] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!user?.hotelId) return
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/room-type-definitions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { definitions: [] }))
      .then((data) => {
        const fromApi = (data.definitions || []).map((d: Record<string, unknown>) => ({
          name: String(d.name ?? "").trim(),
          defaultCapacity: Number(d.defaultCapacity ?? d.default_capacity ?? 2),
          defaultPricePerNight: Number(d.defaultPricePerNight ?? d.default_price_per_night ?? 0),
        }))
        const byName = new Map<string, RoomTypeDef>()
        fromApi.forEach((t: RoomTypeDef) => { if (t.name) byName.set(t.name, t) })
        DEFAULT_ROOM_TYPE_OPTIONS.forEach((t) => { if (!byName.has(t.name)) byName.set(t.name, t) })
        const merged = Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name))
        setRoomTypes(merged)
        if (merged.length > 0 && !roomType) {
          setRoomType(merged[0].name)
          setCapacity(merged[0].defaultCapacity ?? 2)
          setPricePerNight(String(merged[0].defaultPricePerNight ?? ""))
        } else if (merged.length === 0) {
          setRoomTypes(DEFAULT_ROOM_TYPE_OPTIONS)
          setRoomType("Single")
          setCapacity(2)
          setPricePerNight("80")
        }
      })
      .catch(() => {
        setRoomTypes(DEFAULT_ROOM_TYPE_OPTIONS)
        setRoomType("Single")
        setCapacity(2)
        setPricePerNight("80")
      })
  }, [user?.hotelId])

  useEffect(() => {
    if (!roomType || roomTypes.length === 0) return
    const def = roomTypes.find((t) => t.name === roomType)
    if (def) {
      setCapacity(def.defaultCapacity ?? 2)
      setPricePerNight(String(def.defaultPricePerNight ?? ""))
    }
  }, [roomType, roomTypes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!user?.hotelId) {
      setError("No hotel is associated with the current user, so a room cannot be added.")
      return
    }
    setSaving(true)
    const token = localStorage.getItem("token")
    const manualAmenities = amenitiesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    const amenities = Array.from(new Set([...selectedAmenities, ...manualAmenities]))
    const extra: Record<string, string> = {}
    if (bedType) extra.bedType = bedType
    if (acOption) extra.acOption = acOption
    if (roomView) extra.roomView = roomView
    if (extraGuestCharges) extra.extraGuestCharges = extraGuestCharges
    if (cleaningStatus && cleaningStatus !== "clean") extra.cleaningStatus = cleaningStatus
    if (maintenanceStatus && maintenanceStatus !== "ok") extra.maintenanceStatus = maintenanceStatus
    const descriptionParts = [notes].filter(Boolean)
    if (Object.keys(extra).length > 0) {
      descriptionParts.push(JSON.stringify(extra))
    }
    const description = descriptionParts.join(" | ") || null
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomNumber: roomNumber.trim(),
          roomType: roomType.trim(),
          floor: Number(floor),
          pricePerNight: Number(pricePerNight) || 0,
          capacity: Number(capacity) || 2,
          status: roomStatus,
          amenities,
          description,
        }),
      })

      if (res.ok) {
        setError(null)
        router.push("/rooms/list")
        return
      }

      const data = await res.json().catch(() => ({}))
      const msg = data.message || "Failed to save room"
      const details = Array.isArray(data.errors)
        ? data.errors.map((e: { msg?: string }) => e.msg).filter(Boolean).join(". ")
        : ""
      const serverHint = data.error && data.message !== data.error ? ` — ${data.error}` : ""
      setError(details ? `${msg}: ${details}` : `${msg}${serverHint}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save room")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-sky-50 via-violet-50 to-emerald-50 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <RoomSectionHeader
          icon={Plus}
          title="Add Room"
          description="Create a new room with number, floor, type, price, capacity, statuses, and amenities in one clear, colorful layout."
          action={
            <Button variant="outline" size="sm" asChild>
              <Link href="/rooms/list" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                Back to Room List
              </Link>
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-[2fr,1fr] items-start">
          <Card className="shadow-lg border border-white/60 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="h-4 w-4 text-violet-600" />
                Core room details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {error}
                    <p className="mt-1 text-red-600">
                      Correct the information below and click Add Room again.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room number *</Label>
                    <Input
                      className="border-gray-300 focus:ring-gray-500 focus:border-gray-500 max-w-1/2"
                      id="roomNumber"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. 101"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor number *</Label>
                    <Input
                    className="border-gray-300 focus:ring-gray-500 focus:border-gray-500 max-w-1/2"
                      id="floor"
                      type="number"
                      min={0}
                      value={floor}
                      onChange={(e) => setFloor(Number(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Room type *</Label>
                  <Select
                    value={roomType || (roomTypes[0]?.name ?? "Single")}
                    onValueChange={setRoomType}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="e.g. Single, Double, Deluxe, Suite" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.length > 0
                        ? roomTypes.map((t) => (
                            <SelectItem key={t.name} value={t.name}>
                              {t.name}
                            </SelectItem>
                          ))
                        : DEFAULT_ROOM_TYPE_OPTIONS.map((t) => (
                            <SelectItem key={t.name} value={t.name}>
                              {t.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Choose: Single, Double, Deluxe, Suite, Standard, etc. Price and capacity update from selection.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerNight">Fixed price (per night) *</Label>
                    <Input
                      id="pricePerNight"
                      type="number"
                      min={0}
                      step={0.01}
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min={1}
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bed type</Label>
                  <Select value={bedType || "none"} onValueChange={(v) => setBedType(v === "none" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bed type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                      {BED_TYPES.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-sky-600" />
                    Amenities
                  </Label>
                  <p className="text-xs text-gray-500">
                    Tick the amenities included in this room, and optionally add more below.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AMENITY_OPTIONS.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white/70 px-3 py-2 text-xs text-gray-700 shadow-xs"
                      >
                        <Checkbox
                          checked={selectedAmenities.includes(item)}
                          onCheckedChange={(checked) =>
                            setSelectedAmenities((prev) =>
                              checked ? [...prev, item] : prev.filter((a) => a !== item),
                            )
                          }
                          className="h-3.5 w-3.5"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="amenities" className="text-xs text-gray-600">
                      Additional amenities (one per line)
                    </Label>
                    <Textarea
                      id="amenities"
                      value={amenitiesText}
                      onChange={(e) => setAmenitiesText(e.target.value)}
                      placeholder="e.g. Iron&#10;Baby cot"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Room status *</Label>
                    <Select value={roomStatus} onValueChange={setRoomStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_STATUS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cleaning status</Label>
                    <Select value={cleaningStatus} onValueChange={setCleaningStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CLEANING_STATUS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance status</Label>
                    <Select value={maintenanceStatus} onValueChange={setMaintenanceStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MAINTENANCE_STATUS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>AC / Non-AC</Label>
                    <Select value={acOption || "none"} onValueChange={(v) => setAcOption(v === "none" ? "" : v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">—</SelectItem>
                        {AC_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomView">Room view</Label>
                    <Input
                      id="roomView"
                      value={roomView}
                      onChange={(e) => setRoomView(e.target.value)}
                      placeholder="e.g. Sea view, Garden"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extraGuestCharges">Extra guest charges</Label>
                    <Input
                      id="extraGuestCharges"
                      value={extraGuestCharges}
                      onChange={(e) => setExtraGuestCharges(e.target.value)}
                      placeholder="e.g. 20 or $20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-linear-to-r from-sky-500 via-violet-500 to-emerald-500 text-white shadow-md hover:opacity-95"
                  >
                    {saving ? "Saving…" : "Add Room"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/rooms/list">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* <div className="space-y-3">
            <Card className="border border-white/60 bg-white/70 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                  <BedDouble className="h-4 w-4" />
                  Quick summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-gray-700">
                <p>
                  Use this page to create a complete room record, including number, floor, room category, price,
                  capacity, bed, statuses, and amenities. Room type automatically suggests default price and capacity.
                </p>
                <p>
                  Amenities you tick here appear in the Amenities Management view and help staff and guests understand
                  what is included with each room.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-white/60 bg-white/70 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CreditCard className="h-4 w-4" />
                  Pricing & occupancy tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-xs text-gray-700">
                <p>• Keep pricing consistent for each room type to avoid confusion at the front desk.</p>
                <p>• Capacity should reflect the total number of adult guests the room comfortably supports.</p>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </main>
  )
}
