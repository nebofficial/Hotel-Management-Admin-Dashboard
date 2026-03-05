'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { History, Search } from 'lucide-react'

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Approved: 'bg-blue-100 text-blue-800',
  InTransit: 'bg-indigo-100 text-indigo-800',
  Completed: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
}

export default function TransferHistory({ transfers, locations, searchTerm, onSearch, statusFilter, onStatusFilter }) {
  const getLocationName = (id) => locations?.find((l) => l.id === id)?.name || id

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-900">
          <History className="h-5 w-5" />
          Transfer History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by transfer number..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="InTransit">In Transit</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {(!transfers || transfers.length === 0) && (
            <p className="text-center text-gray-500 py-6">No transfers found</p>
          )}
          {transfers?.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-semibold text-gray-900">{t.transferNumber}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${statusColors[t.status] || 'bg-gray-100'}`}>
                    {t.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {getLocationName(t.fromLocationId)} → {getLocationName(t.toLocationId)}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(t.requestedAt || t.createdAt).toLocaleString()}
                {t.totalItems != null && ` · ${t.totalItems} item(s)`}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
