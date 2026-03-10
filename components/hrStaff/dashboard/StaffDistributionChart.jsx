'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Cell, Pie, PieChart } from 'recharts'

const COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#6366f1', '#ec4899', '#eab308']

export function StaffDistributionChart({ departments }) {
  const data = (departments || []).map((d, idx) => ({
    name: d.name,
    value: d.count,
    fill: COLORS[idx % COLORS.length],
  }))

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-rose-50 border-orange-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-orange-800">
          Staff Distribution by Department
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {data.length === 0 ? (
          <p className="text-xs text-orange-700/80">No active staff distribution data.</p>
        ) : (
          <div className="flex items-center gap-4">
            <ChartContainer
              className="h-40 w-40"
              id="hr-staff-distribution"
              config={{}}
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={28}
                  outerRadius={60}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ChartContainer>
            <div className="flex-1 space-y-1 text-xs">
              {data.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between border-b border-orange-100/70 pb-0.5 last:border-0"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: d.fill }}
                    />
                    <span className="text-slate-800">{d.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

