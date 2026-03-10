'use client'

export function ExpenseSummaryCard({ data }) {
  const { totalExpenses = 0, operationalCosts = 0, maintenanceCosts = 0 } = data || {}

  const format = (value) =>
    typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : value || 0

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 text-slate-900 shadow-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide opacity-80">Expenses</p>
        <span className="text-[11px] bg-white/40 px-2 py-0.5 rounded-full font-medium">Summary</span>
      </div>
      <div className="text-2xl font-semibold">{format(totalExpenses)}</div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-amber-900/10 rounded-lg px-2 py-1.5">
          <p className="opacity-80">Operational</p>
          <p className="font-semibold">{format(operationalCosts)}</p>
        </div>
        <div className="bg-amber-900/10 rounded-lg px-2 py-1.5">
          <p className="opacity-80">Maintenance</p>
          <p className="font-semibold">{format(maintenanceCosts)}</p>
        </div>
      </div>
    </div>
  )
}

