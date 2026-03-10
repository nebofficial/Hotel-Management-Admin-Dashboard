'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'

const PIE_COLORS = ['#22c55e', '#0ea5e9', '#6366f1', '#f97316']

export function CampaignAnalytics({ analytics }) {
  const usageTrend = analytics?.usageTrend || []
  const topCampaigns = analytics?.topCampaigns || []
  const distribution = (analytics?.distribution || []).filter((d) => d.value > 0)

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-200/80 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10">
        <CardTitle className="text-sm font-semibold text-slate-800">
          Campaign Performance Analytics
        </CardTitle>
        <p className="text-[11px] text-slate-600">
          Track overall campaign usage trend, top performers and email vs SMS distribution.
        </p>
      </CardHeader>
      <CardContent className="p-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 h-52">
          {usageTrend.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Not enough data to display usage trend yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                />
                <Tooltip
                  formatter={(v) =>
                    typeof v === 'number'
                      ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 })
                      : v
                  }
                />
                <Line
                  type="monotone"
                  dataKey="sent"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Messages sent"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="space-y-4">
          <div className="h-24">
            {topCampaigns.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                No top-performing campaigns yet. Run a few campaigns to see analytics.
              </p>
            ) : (
              <div>
                <p className="text-[11px] font-semibold text-slate-700 mb-1">
                  Top Performing Campaigns
                </p>
                <ul className="text-[11px] text-slate-600 space-y-0.5 max-h-24 overflow-auto pr-1">
                  {topCampaigns.map((c) => (
                    <li key={c.name} className="flex items-center justify-between gap-2">
                      <span className="truncate">{c.name}</span>
                      <span className="text-slate-800">
                        {c.sent.toLocaleString('en-IN')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="h-24">
            {distribution.length === 0 ? (
              <p className="text-[11px] text-slate-500">No distribution data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={32}
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

