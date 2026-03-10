"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ExpenseReportPanelProps {
  data: {
    totalExpenses?: number
    operationalCosts?: number
    maintenanceExpenses?: number
    totalVendorPayments?: number
  }
  loading?: boolean
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function ExpenseReportPanel({ data, loading }: ExpenseReportPanelProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">
        Expense Report
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none bg-white/70 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-gray-700">Total Expenses</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {loading ? "—" : fmt(data?.totalExpenses || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/70 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-gray-700">Operational</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {loading ? "—" : fmt(data?.operationalCosts || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/70 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-gray-700">Maintenance</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {loading ? "—" : fmt(data?.maintenanceExpenses || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/70 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-gray-700">Vendor Payments</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {loading ? "—" : fmt(data?.totalVendorPayments || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

