'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, AlertCircle } from 'lucide-react'
import TimeBasedDiscounts from './TimeBasedDiscounts'
import ProductSpecificOffers from './ProductSpecificOffers'
import DayBasedOffers from './DayBasedOffers'
import AutomaticPriceRevert from './AutomaticPriceRevert'
import MultipleTimeSlots from './MultipleTimeSlots'
import WeekendSpecials from './WeekendSpecials'
import BarOnlyPricing from './BarOnlyPricing'
import AutoActivation from './AutoActivation'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function HappyHourPricing() {
  const { user } = useAuth()
  const [rules, setRules] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

  const fetchRules = async () => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    const token = getToken()
    if (!token) {
      setError('Not authenticated. Please log in again.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/happy-hour-pricing`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `Failed to load: ${res.status}`)
      }
      const data = await res.json()
      setRules(data.rules || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load happy hour rules')
      setRules([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) return

    try {
      const [menuRes, barRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/menu-items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/bar-inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const menuData = menuRes.ok ? await menuRes.json().catch(() => ({})) : {}
      const barData = barRes.ok ? await barRes.json().catch(() => ({})) : {}

      const menuItems = (menuData.items || []).map((item) => ({
        id: String(item.id),
        name: String(item.name || ''),
        type: 'menu',
      }))
      const barItems = (barData.items || []).map((item) => ({
        id: String(item.id),
        name: String(item.name || ''),
        type: 'bar',
      }))

      setProducts([...menuItems, ...barItems])
    } catch (e) {
      console.error('Failed to load products:', e)
    }
  }

  useEffect(() => {
    if (user?.hotelId) {
      fetchRules()
      fetchProducts()
    }
  }, [user?.hotelId])

  const handleSave = async (formData) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) {
      setError('Not authenticated. Please log in again.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/happy-hour-pricing`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `Failed to save: ${res.status}`)
      }

      await fetchRules()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save rule')
    } finally {
      setSaving(false)
    }
  }

  if (!user?.hotelId) {
    return (
      <main className="p-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">Select a hotel or log in with a hotel account to manage happy hour pricing.</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Happy Hour Pricing</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage time-based discounts and pricing rules</p>
          </div>
          <button
            type="button"
            onClick={fetchRules}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3 flex items-center gap-2 text-red-800 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="time-based" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="time-based" className="text-xs">Time-Based</TabsTrigger>
            <TabsTrigger value="product" className="text-xs">Product</TabsTrigger>
            <TabsTrigger value="day-based" className="text-xs">Day-Based</TabsTrigger>
            <TabsTrigger value="auto-revert" className="text-xs">Auto-Revert</TabsTrigger>
            <TabsTrigger value="multi-slot" className="text-xs">Multi-Slot</TabsTrigger>
            <TabsTrigger value="weekend" className="text-xs">Weekend</TabsTrigger>
            <TabsTrigger value="bar-only" className="text-xs">Bar-Only</TabsTrigger>
            <TabsTrigger value="auto-activate" className="text-xs">Auto-Activate</TabsTrigger>
          </TabsList>

          <TabsContent value="time-based" className="mt-4">
            <TimeBasedDiscounts rules={rules} onSave={handleSave} loading={saving} />
          </TabsContent>

          <TabsContent value="product" className="mt-4">
            <ProductSpecificOffers rules={rules} onSave={handleSave} loading={saving} products={products} />
          </TabsContent>

          <TabsContent value="day-based" className="mt-4">
            <DayBasedOffers rules={rules} onSave={handleSave} loading={saving} />
          </TabsContent>

          <TabsContent value="auto-revert" className="mt-4">
            <AutomaticPriceRevert rules={rules} onSave={handleSave} loading={saving} />
          </TabsContent>

          <TabsContent value="multi-slot" className="mt-4">
            <MultipleTimeSlots rules={rules} onSave={handleSave} loading={saving} />
          </TabsContent>

          <TabsContent value="weekend" className="mt-4">
            <WeekendSpecials rules={rules} onSave={handleSave} loading={saving} />
          </TabsContent>

          <TabsContent value="bar-only" className="mt-4">
            <BarOnlyPricing rules={rules} onSave={handleSave} loading={saving} />
          </TabsContent>

          <TabsContent value="auto-activate" className="mt-4">
            <AutoActivation rules={rules} onSave={handleSave} loading={saving} />
          </TabsContent>
        </Tabs>

        {rules.length > 0 && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">All Active Rules ({rules.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Time</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Days</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Discount</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Bar Only</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((rule) => (
                      <tr key={rule.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-900">{rule.name}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {rule.startTime} – {rule.endTime}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {rule.weekendOnly
                            ? 'Weekends'
                            : rule.daysOfWeek && rule.daysOfWeek.length
                              ? rule.daysOfWeek.join(', ')
                              : 'All'}
                        </td>
                        <td className="px-3 py-2">
                          {rule.discountType === 'percent'
                            ? `${rule.discountValue}%`
                            : `₹${rule.discountValue}`}
                        </td>
                        <td className="px-3 py-2">{rule.barOnly ? 'Yes' : 'No'}</td>
                        <td className="px-3 py-2">
                          <span
                            className={
                              rule.isActive
                                ? 'text-green-600 font-medium'
                                : 'text-gray-400'
                            }
                          >
                            {rule.isActive ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
