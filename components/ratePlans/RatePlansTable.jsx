'use client'

import { RatePlanStatusToggle } from './RatePlanStatusToggle'

export function RatePlansTable({ plans = [], onEdit, onAssign, onToggleStatus, selectedIds = [], onToggleSelect }) {
  return (
    <div className="rounded-2xl border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-500/10 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-emerald-200/70">
        <p className="text-sm font-semibold text-slate-800">Rate Plan Management</p>
        <p className="text-[11px] text-slate-600">
          Central place to configure pricing, meal plans, stay rules and activation status.
        </p>
      </div>
      <div className="overflow-x-auto">
        {plans.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No rate plans defined yet.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-emerald-100/80 border-b border-emerald-200/70">
                <th className="w-8 py-2.5 px-2" />
                <th className="text-left py-2.5 px-2 font-semibold text-slate-700">Rate Plan Name</th>
                <th className="text-left py-2.5 px-2 font-semibold text-slate-700">Room Types</th>
                <th className="text-right py-2.5 px-2 font-semibold text-slate-700">Base Price</th>
                <th className="text-left py-2.5 px-2 font-semibold text-slate-700">Meal Plan</th>
                <th className="text-left py-2.5 px-2 font-semibold text-slate-700">Refund Policy</th>
                <th className="text-left py-2.5 px-2 font-semibold text-slate-700">Min / Max Stay</th>
                <th className="text-center py-2.5 px-2 font-semibold text-slate-700">Status</th>
                <th className="text-right py-2.5 px-2 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => {
                const roomTypes = (plan.roomTypes || []).join(', ') || 'All'
                const mealPlanLabel =
                  plan.mealPlan === 'breakfast'
                    ? 'Breakfast Included'
                    : plan.mealPlan === 'half_board'
                    ? 'Half Board'
                    : plan.mealPlan === 'full_board'
                    ? 'Full Board'
                    : 'Room Only'
                const refundLabel = plan.isRefundable
                  ? 'Refundable'
                  : plan.nonRefundableDiscountPercent
                  ? `Non-Refundable (${plan.nonRefundableDiscountPercent}% off)`
                  : 'Non-Refundable'

                return (
                  <tr key={plan.id} className="border-b border-emerald-100/80 hover:bg-emerald-50/60">
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
                        checked={selectedIds.includes(plan.id)}
                        onChange={() => onToggleSelect?.(plan.id)}
                      />
                    </td>
                    <td className="py-2 px-2 font-semibold text-slate-900">{plan.name}</td>
                    <td className="py-2 px-2 text-slate-700">{roomTypes}</td>
                    <td className="py-2 px-2 text-right text-slate-800">
                      ₹{' '}
                      {Number(plan.basePrice || 0).toLocaleString('en-IN', {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="py-2 px-2 text-slate-700">{mealPlanLabel}</td>
                    <td className="py-2 px-2 text-slate-700">{refundLabel}</td>
                    <td className="py-2 px-2 text-slate-700">
                      {plan.minStayNights || '-'} / {plan.maxStayNights || '-'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <RatePlanStatusToggle
                        status={plan.status}
                        onToggle={() => onToggleStatus?.(plan)}
                      />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          className="px-2 h-6 rounded-full border border-emerald-500/70 text-emerald-800 bg-white text-[10px] font-medium hover:bg-emerald-50"
                          onClick={() => onEdit?.(plan)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-2 h-6 rounded-full border border-slate-300 text-slate-700 bg-white text-[10px] font-medium hover:bg-slate-50"
                          onClick={() => onAssign?.(plan)}
                        >
                          Assign Rooms
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

