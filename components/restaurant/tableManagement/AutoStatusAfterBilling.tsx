'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function AutoStatusAfterBilling({ tables, onRefresh }: Props) {
  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-slate-500 via-gray-500 to-zinc-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Auto status management
            </div>
            <div className="text-lg font-semibold">Enabled</div>
          </div>
          <CheckCircle2 className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-slate-600" />
            Auto status after billing
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-xs font-semibold text-slate-900 mb-2">
                How it works:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                <li>
                  When a bill is marked as <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Paid</Badge> in POS Billing,
                  the associated table automatically changes status to{" "}
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">Cleaning</Badge>.
                </li>
                <li>
                  After 5 minutes (configurable), the table status automatically changes to{" "}
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Available</Badge>.
                </li>
                <li>
                  This ensures smooth table turnover and accurate availability tracking.
                </li>
              </ul>
            </div>
            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
              <div className="text-xs font-semibold text-blue-900 mb-1">
                Integration
              </div>
              <div className="text-[11px] text-blue-700">
                This feature is integrated with the Restaurant POS Billing system.
                When you complete a bill payment, the table status updates automatically.
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Note: To enable automatic status changes, ensure your POS Billing system
              updates table status when bills are paid. The backend API supports this
              through the restaurant-tables PUT endpoint.
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
