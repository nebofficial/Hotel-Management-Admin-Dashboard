"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Layers } from "lucide-react"
import Link from "next/link"

interface FloorCardProps {
  id: number
  floor: string
  floorNumber: number
  totalRooms: number
  occupied: number
  available: number
  maintenance?: number
  cleaning?: number
}

export function FloorCard({
  floor,
  floorNumber,
  totalRooms,
  occupied,
  available,
  maintenance = 0,
  cleaning = 0,
}: FloorCardProps) {
  return (
    <Link href={`/rooms/floors?floor=${floorNumber}`}>
      <Card className="border border-gray-200 shadow-sm transition-shadow hover:shadow-md hover:border-red-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Layers className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-sm">{floor}</p>
              <p className="text-xs text-gray-500 mt-0.5">{totalRooms} rooms</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800">
                  {available} available
                </span>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-800">
                  {occupied} occupied
                </span>
                {(maintenance > 0 || cleaning > 0) && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                    {maintenance + cleaning} other
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
