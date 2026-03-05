'use client'

import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function TransferQuantityValidation({ available, requested }) {
  const ok = requested <= available && requested > 0
  const over = requested > available
  return (
    <div className={`flex items-center gap-1 text-xs ${ok ? 'text-green-600' : over ? 'text-red-600' : 'text-gray-500'}`}>
      {ok && <CheckCircle2 className="h-4 w-4" />}
      {over && <AlertTriangle className="h-4 w-4" />}
      <span>Avail: {available}</span>
    </div>
  )
}
