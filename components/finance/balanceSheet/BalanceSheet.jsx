'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import AssetOverview from './AssetOverview'
import LiabilityOverview from './LiabilityOverview'
import EquitySummary from './EquitySummary'
import FinancialSnapshot from './FinancialSnapshot'

export default function BalanceSheet() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [asOf, setAsOf] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [currentYearProfit, setCurrentYearProfit] = useState(0)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const loadBalanceSheet = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/balance-sheet?asOf=${asOf}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || 'Failed to load balance sheet')
      setData(json)
    } catch (e) {
      alert(e.message || 'Failed to load balance sheet')
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentYearProfit = async () => {
    if (!apiBase) return
    try {
      const token = localStorage.getItem('token')
      const year = new Date(asOf).getFullYear()
      const start = `${year}-01-01`
      const res = await fetch(`${apiBase}/profit-loss?startDate=${start}&endDate=${asOf}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && typeof json.netProfit === 'number') {
        setCurrentYearProfit(json.netProfit)
      }
    } catch {
      // ignore, not critical
    }
  }

  useEffect(() => {
    if (apiBase) {
      loadBalanceSheet()
      loadCurrentYearProfit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  const handleApply = () => {
    loadBalanceSheet()
    loadCurrentYearProfit()
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to view Balance Sheet.
        </p>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading Balance Sheet…</p>
      </div>
    )
  }

  const assetsTotal = Number(data?.assets?.totalAssets || 0)
  const liabilitiesTotal = Number(data?.liabilities?.totalLiabilities || 0)
  const equityTotal = Number(data?.equity?.totalEquity || 0)

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-sky-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-gray-600 mt-1">
            Snapshot of assets, liabilities, and equity as of selected date.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-gray-600">As of</span>
            <input
              type="date"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-1 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="mt-4 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AssetOverview assets={data.assets} />
            <LiabilityOverview liabilities={data.liabilities} />
            <EquitySummary equity={data.equity} currentYearProfit={currentYearProfit} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FinancialSnapshot
              assetsTotal={assetsTotal}
              liabilitiesTotal={liabilitiesTotal}
              equityTotal={equityTotal}
              isBalanced={data.isBalanced}
            />
          </div>
        </>
      )}
    </div>
  )
}

