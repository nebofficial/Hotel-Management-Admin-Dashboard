'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, LogOut, XCircle, Receipt, FileText } from 'lucide-react'

const statusColors = {
  checked_in: 'bg-green-100 text-green-800 border-green-200',
  checked_out: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const statusLabels = {
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
}

export default function WalkinTable({ walkins, onView, onCheckout, onCancel, onPrintBill }) {
  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (val) => {
    const num = Number(val || 0)
    return `₹${num.toLocaleString('en-IN')}`
  }

  if (!walkins || walkins.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <p className="text-gray-500">No walk-in bookings found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Walk-in #</TableHead>
            <TableHead className="font-semibold">Guest</TableHead>
            <TableHead className="font-semibold">Room</TableHead>
            <TableHead className="font-semibold">Check-in</TableHead>
            <TableHead className="font-semibold">Check-out</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Balance</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {walkins.map((w) => (
            <TableRow key={w.id} className="hover:bg-gray-50">
              <TableCell className="font-mono text-sm font-medium">{w.walkinNumber}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{w.guestName}</div>
                  <div className="text-xs text-gray-500">{w.guestPhone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{w.roomNumber}</div>
                  <div className="text-xs text-gray-500">{w.roomType}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{formatDate(w.checkInTime)}</div>
                  <div className="text-xs text-gray-500">{formatTime(w.checkInTime)}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{formatDate(w.actualCheckOut || w.expectedCheckOut)}</div>
                  {w.actualCheckOut && (
                    <div className="text-xs text-gray-500">{formatTime(w.actualCheckOut)}</div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(w.totalAmount)}</TableCell>
              <TableCell>
                <span className={Number(w.balanceAmount) > 0 ? 'text-amber-600 font-medium' : 'text-green-600'}>
                  {formatCurrency(w.balanceAmount)}
                </span>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[w.status] || 'bg-gray-100'}>
                  {statusLabels[w.status] || w.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView && onView(w)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPrintBill && onPrintBill(w)}
                    title="Print Bill"
                  >
                    <Receipt className="h-4 w-4" />
                  </Button>
                  {w.status === 'checked_in' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCheckout && onCheckout(w)}
                        title="Check Out"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancel && onCancel(w)}
                        title="Cancel"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
