"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, ClipboardCheck, WashingMachine, Boxes, Users } from "lucide-react"

export default function HousekeepingPage() {
  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="pb-1">
        <h1 className="text-lg font-semibold text-slate-900">Housekeeping</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Choose a housekeeping module to open its full page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Link href="/housekeeping/schedule">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <ClipboardList className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Daily Cleaning Schedule</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-slate-600">
              Plan and view daily room cleaning tasks, staff shifts, and room coverage.
            </CardContent>
          </Card>
        </Link>

        <Link href="/housekeeping/inspection">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Room Inspection</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-slate-600">
              Review inspection checklists, issues reported, and quality scores by room.
            </CardContent>
          </Card>
        </Link>

        <Link href="/housekeeping/laundry">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <WashingMachine className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Laundry Management</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-slate-600">
              Track pending, in-progress, and completed laundry batches for all linen.
            </CardContent>
          </Card>
        </Link>

        <Link href="/housekeeping/linen">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Boxes className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Linen Inventory</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-slate-600">
              Monitor linen stock levels, par values, and low-stock alerts by item.
            </CardContent>
          </Card>
        </Link>

        <Link href="/housekeeping/staff">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Users className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Staff Assignment</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-slate-600">
              View who is assigned to which shift and area for housekeeping.
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  )
}

