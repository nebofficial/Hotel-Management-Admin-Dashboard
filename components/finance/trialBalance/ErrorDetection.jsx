'use client'

import { AlertTriangle } from 'lucide-react'

export default function ErrorDetection({ isBalanced = true, difference = 0 }) {
  if (isBalanced) return null

  const fmt = (n) =>
    '\u20B9' + Math.abs(Number(n)).toLocaleString('en-IN', { minimumFractionDigits: 2 })
  const isDebitHigher = difference > 0

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
      <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-600" />
      <div>
        <p className="font-semibold">Trial balance is not balanced</p>
        <p className="text-sm text-red-700 mt-0.5">
          {isDebitHigher
            ? 'Debits exceed credits by ' + fmt(difference) + '. Please review journal entries.'
            : 'Credits exceed debits by ' + fmt(difference) + '. Please review journal entries.'}
        </p>
      </div>
    </div>
  )
}
