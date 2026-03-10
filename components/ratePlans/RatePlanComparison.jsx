'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export function RatePlanComparison({ plans = [], selectedIds = [] }) {
  const selectedPlans =
    selectedIds.length > 0 ? plans.filter((p) => selectedIds.includes(p.id)) : plans.slice(0, 5)

  const chartData = selectedPlans.map((p) => ({
    name: p.name,
    basePrice: Number(p.basePrice || 0),
  }))

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-200/80 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10">
        <CardTitle className="text-sm font-semibold text-slate-800">Rate Plan Comparison</CardTitle>
        <p className="text-[11px] text-slate-600">
          Compare pricing, meal plans and stay rules for multiple rate plans.
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {selectedPlans.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Select one or more rate plans from the table to compare.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Rate Plan</th>
                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Base Price</th>
                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Meal Plan</th>
                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Refund Policy</th>
                    <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Room Types</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPlans.map((p) => {
                    const mealPlanLabel =
                      p.mealPlan === 'breakfast'
                        ? 'Breakfast Included'
                        : p.mealPlan === 'half_board'
                        ? 'Half Board'
                        : p.mealPlan === 'full_board'
                        ? 'Full Board'
                        : 'Room Only'
                    const refundLabel = p.isRefundable
                      ? 'Refundable'
                      : p.nonRefundableDiscountPercent
                      ? `Non-Refundable (${p.nonRefundableDiscountPercent}% off)`
                      : 'Non-Refundable'
                    return (
                      <tr key={p.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-2 px-3 font-semibold text-slate-900">{p.name}</td>
                        <td className="py-2 px-3 text-slate-800">
                          ₹{' '}
                          {Number(p.basePrice || 0).toLocaleString('en-IN', {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="py-2 px-3 text-slate-700">{mealPlanLabel}</td>
                        <td className="py-2 px-3 text-slate-700">{refundLabel}</td>
                        <td className="py-2 px-3 text-slate-700">
                          {(p.roomTypes || []).join(', ') || 'All'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="h-52">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) =>
                        v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
                      }
                    />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === 'number'
                          ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
                          : v
                      }
                    />
                    <Bar dataKey="basePrice" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">
                  Not enough data to show price comparison.
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

