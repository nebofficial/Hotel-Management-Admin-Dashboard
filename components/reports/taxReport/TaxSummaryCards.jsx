'use client'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function TaxSummaryCards({ summary }) {
  const {
    totalTaxCollected = 0,
    gstVatCollected = 0,
    serviceChargesCollected = 0,
    totalTaxableRevenue = 0,
    taxPercentage = 0,
  } = summary || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Tax Collected</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(totalTaxCollected)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">GST / VAT Collected</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(gstVatCollected)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 via-purple-400 to-fuchsia-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Service Charges Collected</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(serviceChargesCollected)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Taxable Revenue</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(totalTaxableRevenue)}</div>
        {taxPercentage > 0 && (
          <p className="text-[10px] mt-1 opacity-90">Effective tax: {taxPercentage.toFixed(1)}%</p>
        )}
      </div>
    </div>
  )
}
