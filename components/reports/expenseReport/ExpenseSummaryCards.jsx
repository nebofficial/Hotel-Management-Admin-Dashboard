'use client'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function ExpenseSummaryCards({ summary }) {
  const {
    totalExpenses = 0,
    totalVendorPayments = 0,
    operationalCosts = 0,
    maintenanceExpenses = 0,
  } = summary || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Expenses This Month</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(totalExpenses)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Vendor Payments</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(totalVendorPayments)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Operational Costs</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(operationalCosts)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-300 to-teal-500 text-slate-800 shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Maintenance Expenses</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(maintenanceExpenses)}</div>
      </div>
    </div>
  )
}
