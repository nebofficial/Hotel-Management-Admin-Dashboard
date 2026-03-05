'use client'

import { Button } from '@/components/ui/button'

export default function ReservationActions({ reservation, onEdit, onCancel, onPrint }) {
  return (
    <div className="flex items-center gap-1 justify-end">
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-sky-700 hover:bg-sky-50"
        onClick={() => onEdit && onEdit(reservation)}
        title="Edit reservation"
      >
        ✏️
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-rose-700 hover:bg-rose-50"
        onClick={() => onCancel && onCancel(reservation)}
        title="Cancel reservation"
      >
        ✖
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-red-700 hover:bg-red-50"
        onClick={() => onPrint && onPrint(reservation)}
        title="Print voucher"
      >
        🖨
      </Button>
    </div>
  )
}

