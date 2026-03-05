'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

export default function AlertsPage() {
  const alerts = [
    { id: 1, type: "warning", title: "Low Inventory Stock", message: "Room supplies running low", time: "30 mins ago" },
    { id: 2, type: "info", title: "Maintenance Request", message: "Room 305 AC needs repair", time: "1 hour ago" },
    { id: 3, type: "success", title: "Payment Received", message: "Guest in Room 102 settled bill", time: "2 hours ago" },
    { id: 4, type: "warning", title: "Check-out Pending", message: "3 rooms need immediate checkout", time: "45 mins ago" },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-600" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-orange-50 border-orange-200"
      case "success":
        return "bg-green-50 border-green-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h1>
        <p className="text-xs text-gray-500 mt-0.5">System and operational alerts</p>
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Recent Alerts (4)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex gap-2 p-2 rounded border ${getBgColor(alert.type)}`}>
                <div className="flex-shrink-0 pt-0.5">{getIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
