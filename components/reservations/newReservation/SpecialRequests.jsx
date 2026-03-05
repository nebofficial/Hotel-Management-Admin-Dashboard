'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function SpecialRequests({ value, onChange }) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 text-white">
      <CardHeader>
        <CardTitle className="text-white">Special Requests</CardTitle>
        <div className="text-white/80 text-sm">Add any guest requests or notes.</div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl">
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white/15 text-white border-white/20 min-h-[90px]"
          placeholder="e.g., Late check-in, high floor, allergy notes…"
        />
      </CardContent>
    </Card>
  )
}

