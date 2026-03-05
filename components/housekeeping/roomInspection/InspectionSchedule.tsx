"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type ShiftOption = "Morning" | "Afternoon" | "Evening/Night" | "All day"

export interface ScheduleRoomMeta {
  roomNumber: string
  floor: number | null
  roomType?: string | null
}

interface InspectionScheduleProps {
  selectedDate: string
  rooms: ScheduleRoomMeta[]
  creating: boolean
  onCreate: (payload: {
    roomNumber: string
    inspector: string
    scheduledDate: string
    shift: ShiftOption
  }) => Promise<void> | void
}

export function InspectionSchedule({
  selectedDate,
  rooms,
  creating,
  onCreate,
}: InspectionScheduleProps) {
  const [roomNumber, setRoomNumber] = useState("")
  const [inspector, setInspector] = useState("")
  const [shift, setShift] = useState<ShiftOption>("All day")
  const [localDate, setLocalDate] = useState(selectedDate)

  const canSubmit = roomNumber.trim() && inspector.trim() && localDate

  const handleSubmit = async () => {
    if (!canSubmit || creating) return
    await onCreate({
      roomNumber: roomNumber.trim(),
      inspector: inspector.trim(),
      scheduledDate: localDate,
      shift,
    })
    // keep date, but reset other fields
    setRoomNumber("")
    setInspector("")
    setShift("All day")
  }

  const uniqueFloors = Array.from(
    new Set(rooms.map((r) => (r.floor != null ? r.floor : null))),
  ).filter((f): f is number => f !== null)

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-900">
          Schedule new inspection
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="inspection-room" className="text-[11px] text-slate-700">
              Room
            </Label>
            <select
              id="inspection-room"
              aria-label="Select room for inspection"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700"
            >
              <option value="">Select room</option>
              {rooms.map((r) => (
                <option key={r.roomNumber} value={r.roomNumber}>
                  Room {r.roomNumber}
                  {r.floor != null ? ` • Floor ${r.floor}` : ""}
                  {r.roomType ? ` • ${r.roomType}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="inspection-inspector"
              className="text-[11px] text-slate-700"
            >
              Inspector
            </Label>
            <Input
              id="inspection-inspector"
              placeholder="Supervisor name"
              value={inspector}
              onChange={(e) => setInspector(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="inspection-date" className="text-[11px] text-slate-700">
              Date
            </Label>
            <Input
              id="inspection-date"
              type="date"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="inspection-shift" className="text-[11px] text-slate-700">
              Shift
            </Label>
            <select
              id="inspection-shift"
              aria-label="Select inspection shift"
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftOption)}
              className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700"
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening/Night">Evening / Night</option>
              <option value="All day">All day</option>
            </select>
          </div>
        </div>

        {uniqueFloors.length > 0 && (
          <p className="text-[11px] text-slate-500">
            Floors covered today:{" "}
            {uniqueFloors
              .slice()
              .sort((a, b) => a - b)
              .map((f) => `Floor ${f}`)
              .join(", ")}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit || creating}
            className="text-xs"
          >
            {creating ? "Scheduling…" : "Schedule inspection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

