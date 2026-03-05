"use client"

import { useEffect, useState } from "react"
import {
  Sparkles,
  Bed,
  Droplets,
  Building2,
  Wifi,
  Check,
  X,
  MoreVertical,
  RefreshCw,
  Plus,
} from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AmenityFormDialog } from "@/components/rooms/amenity-form-dialog"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  in_room: Bed,
  bathroom: Droplets,
  property: Building2,
  connectivity: Wifi,
}

interface AmenityItem {
  id: string
  name: string
  available: boolean
  category: string
  description?: string
  roomNumber?: string | null
  floor?: number | null
}

interface AmenityCategory {
  id: string
  label: string
  icon: string
  items: AmenityItem[]
}

export default function AmenitiesPage() {
  const { user } = useAuth()
  const [amenities, setAmenities] = useState<AmenityCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  const fetchAmenities = () => {
    if (!user?.hotelId) return
    const token = localStorage.getItem("token")
    setLoading(true)
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/amenities`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { amenities: [] }))
      .then((data) => setAmenities(data.amenities || []))
      .catch(() => setAmenities([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    fetchAmenities()
  }, [user?.hotelId])

  return (
    <main className="p-4 space-y-6">
      <RoomSectionHeader
        icon={Sparkles}
        title="Amenities Management"
        description="The Add Amenities button is used to add new amenities to the system. When clicked, it opens a form where the admin can enter the amenity name, select the category, set the availability status, and add a short description. After filling in the required details, clicking the Save / Add button stores the amenity in the system and makes it available for assignment to rooms."
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add amenities
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={fetchAmenities}>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : amenities.length === 0 ? (
        <Card className="border border-dashed border-gray-200">
          <CardContent className="py-8 text-center text-sm text-gray-500">
            No amenities configured.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {amenities.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles
            return (
              <Card key={cat.id} className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold">{cat.label}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          {(item.roomNumber || item.floor != null || item.description) && (
                            <span className="text-[11px] text-gray-500 mt-0.5">
                              {item.roomNumber && <>Room {item.roomNumber}</>}
                              {item.roomNumber && item.floor != null && " · "}
                              {item.floor != null && <>Floor {item.floor}</>}
                              {(item.roomNumber || item.floor != null) && item.description && " — "}
                              {item.description && <>{item.description}</>}
                            </span>
                          )}
                        </div>
                        {item.available ? (
                          <Badge className="bg-green-100 text-green-800 gap-1">
                            <Check className="h-3 w-3" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <X className="h-3 w-3" />
                            Unavailable
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {user?.hotelId && (
        <AmenityFormDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          hotelId={user.hotelId}
          onSuccess={fetchAmenities}
        />
      )}
    </main>
  )
}
