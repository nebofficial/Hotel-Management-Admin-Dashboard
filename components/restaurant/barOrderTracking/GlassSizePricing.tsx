'use client'

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Ruler } from "lucide-react"

export interface GlassSizeOption {
  id: "S" | "M" | "L"
  label: string
  multiplier: number
}

interface Props {
  options: GlassSizeOption[]
}

export default function GlassSizePricing({ options }: Props) {
  const [basePrice, setBasePrice] = useState(180)

  const priceRows = useMemo(() => {
    return options.map((o) => ({
      ...o,
      price: Math.round(basePrice * o.multiplier),
    }))
  }, [basePrice, options])

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-indigo-500 to-blue-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Glass Size Pricing
            <Badge className="bg-white/15 text-white border-none">
              Dynamic pricing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Select Small / Medium / Large and automatically adjust unit price via
          multiplier.
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-slate-900">
                Base drink price (demo)
              </div>
              <div className="text-xs text-slate-500">
                Used to preview size multipliers below.
              </div>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              ₹{basePrice}
            </div>
          </div>

          <Slider
            aria-label="Base price slider"
            value={[basePrice]}
            min={80}
            max={600}
            step={10}
            onValueChange={(v) => setBasePrice(Number(v?.[0] || 0))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {priceRows.map((r) => (
              <Card
                key={r.id}
                className="rounded-xl border border-slate-200 shadow-sm"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">
                      {r.label}
                    </div>
                    <Badge className="bg-slate-900 text-white border-none">
                      x{r.multiplier}
                    </Badge>
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">
                    ₹{r.price}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Unit price used inside bar order items.
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBasePrice(180)}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setBasePrice((p) => Math.min(600, p + 50))}
            >
              +₹50
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

