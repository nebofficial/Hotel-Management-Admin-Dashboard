'use client'

export default function PaymentStatusBadge({ status }) {
  const s = status || 'PENDING'
  let classes = 'bg-blue-100 text-blue-800'
  if (s === 'PAID') classes = 'bg-green-100 text-green-800'
  else if (s === 'OVERDUE') classes = 'bg-red-100 text-red-800'

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      {s === 'PAID' ? 'Paid' : s === 'OVERDUE' ? 'Overdue' : 'Pending'}
    </span>
  )
}

