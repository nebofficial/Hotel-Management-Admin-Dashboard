'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AddExpenseEntry from './AddExpenseEntry'

export default function Expenses() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [expenses, setExpenses] = useState([])

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const loadExpenses = async () => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setExpenses(data.expenses || [])
    }
  }

  useEffect(() => {
    loadExpenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to manage expenses.
        </p>
      </div>
    )
  }

  if (!apiBase && !expenses.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading expenses...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-rose-50/20 to-amber-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">
            Record expenses with category, vendor, date and payment mode.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AddExpenseEntry apiBase={apiBase} onSaved={loadExpenses} />
        <Card className="border border-gray-200 shadow-xs rounded-2xl lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-2 max-h-[360px] overflow-y-auto">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{exp.category}</p>
                    <p className="text-xs text-gray-600">
                      {exp.vendor ? `${exp.vendor} • ` : ''}
                      {exp.expenseDate}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      ${Number(exp.amount || 0).toFixed(2)}
                    </p>
                    <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium mt-0.5">
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <p className="text-xs text-gray-500 px-1">No expenses recorded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

