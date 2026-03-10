'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Line, LineChart, XAxis, YAxis } from 'recharts'

export function AttendanceAnalyticsChart({ trend }) {
  const data = trend || []

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-lime-50 border-yellow-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-yellow-800">
          Attendance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {data.length === 0 ? (
          <p className="text-xs text-yellow-700/80">No attendance data yet.</p>
        ) : (
          <ChartContainer
            className="h-40"
            id="hr-attendance-trend"
            config={{
              attendance: {
                label: 'Attendance Rate',
                theme: {
                  light: 'stroke-amber-500',
                  dark: 'stroke-amber-400',
                },
              },
            }}
          >
            <LineChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="var(--color-attendance)"
                strokeWidth={2}
                dot={{ r: 2 }}
                isAnimationActive
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

