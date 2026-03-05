'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportTicketsPage() {
  const tickets = [
    { id: "TK-001", subject: "Login issue on dashboard", status: "Open", priority: "High", created: "2024-01-29" },
    { id: "TK-002", subject: "Report generation error", status: "In Progress", priority: "Medium", created: "2024-01-28" },
    { id: "TK-003", subject: "Slow page loading", status: "Resolved", priority: "Low", created: "2024-01-27" },
    { id: "TK-004", subject: "Missing reservation data", status: "Open", priority: "High", created: "2024-01-26" },
  ]

  const getStatusColor = (status: string) => {
    if (status === "Open") return "bg-red-100 text-red-800"
    if (status === "In Progress") return "bg-blue-100 text-blue-800"
    return "bg-green-100 text-green-800"
  }

  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "bg-red-100 text-red-800"
    if (priority === "Medium") return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Support Tickets</h1>
        <p className="text-xs text-gray-500 mt-0.5">Help desk support requests</p>
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Tickets (4)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-start justify-between p-2 bg-gray-50 rounded border border-gray-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{ticket.id}</p>
                  <p className="text-xs text-gray-600">{ticket.subject}</p>
                  <p className="text-xs text-gray-500">{ticket.created}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <div className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </div>
                  <div className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
