'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

export function PromoUsageAnalytics({ analytics }) {
  const byCode = analytics?.byCode || []
  const activePromoCodes = analytics?.activePromoCodes ?? 0
  const totalDiscountGiven = analytics?.totalDiscountGiven ?? 0
  const totalPromoBookings = analytics?.totalPromoBookings ?? 0
  const averageDiscountValue = analytics?.averageDiscountValue ?? 0

  const lineData = byCode.map((c, i) => ({ code: c.code, usage: c.usedCount || 0, index: i + 1 }))
  const barData = [...byCode].sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0)).slice(0, 8)
  const totalUsage = barData.reduce((s, c) => s + (c.usedCount || 0), 0)
  const pieData = totalUsage > 0 ? barData.map((c) => ({ name: c.code, value: c.usedCount || 0 })) : []

  return (
    <div className="rounded-2xl border-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-pink-500/10 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-violet-200/60">
        <p className="text-sm font-semibold text-slate-800">Promo Usage Analytics</p>
        <p className="text-[11px] text-slate-600">Measure campaign success with usage and discount distribution.</p>
      </div>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white/80 border border-violet-100 px-3 py-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Active Codes</p>
            <p className="text-lg font-bold text-violet-700">{activePromoCodes}</p>
          </div>
          <div className="rounded-xl bg-white/80 border border-violet-100 px-3 py-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Discount</p>
            <p className="text-lg font-bold text-violet-700">₹ {Number(totalDiscountGiven).toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-xl bg-white/80 border border-violet-100 px-3 py-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Promo Bookings</p>
            <p className="text-lg font-bold text-violet-700">{totalPromoBookings}</p>
          </div>
          <div className="rounded-xl bg-white/80 border border-violet-100 px-3 py-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Avg Discount</p>
            <p className="text-lg font-bold text-violet-700">₹ {Number(averageDiscountValue).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {lineData.length > 0 && (
          <div className="h-52">
            <p className="text-xs font-medium text-slate-700 mb-2">Usage by code (trend)</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="code" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [v, 'Usage']} labelFormatter={(l) => `Code: ${l}`} />
                <Line type="monotone" dataKey="usage" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Usage" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {barData.length > 0 && (
          <div className="h-52">
            <p className="text-xs font-medium text-slate-700 mb-2">Top performing promo codes</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="code" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [v, 'Used']} />
                <Bar dataKey="usedCount" fill="#06b6d4" name="Used" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {pieData.length > 0 && (
          <div className="h-52">
            <p className="text-xs font-medium text-slate-700 mb-2">Discount distribution by code</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Uses']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {byCode.length === 0 && (
          <p className="text-xs text-slate-500 py-4 text-center">No promo usage data yet. Create and use promos to see analytics.</p>
        )}
      </div>
    </div>
  )
}
