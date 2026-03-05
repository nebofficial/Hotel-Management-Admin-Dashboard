"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LayoutGrid } from "lucide-react"

interface RoomTypeCardProps {
  id: string
  name: string
  description?: string | null
  defaultCapacity?: number
  roomCount?: number
}

export function RoomTypeCard({
  name,
  description,
  defaultCapacity,
  roomCount = 0,
}: RoomTypeCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm">{name || "Room type"}</p>
            {(description != null && description !== "") && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0 text-xs text-gray-500">
              {defaultCapacity != null && (
                <span>Capacity: {defaultCapacity} guests</span>
              )}
              {roomCount >= 0 && (
                <span>{roomCount} room{roomCount !== 1 ? "s" : ""}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
