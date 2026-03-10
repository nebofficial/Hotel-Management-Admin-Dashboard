"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { fetchPropertiesList } from "@/services/api/multiPropertyApi"
import {
  fetchOccupancyReport,
  fetchRevenueReport,
  fetchExpenseReport,
  fetchInventoryReport,
  fetchStaffPerformanceReport,
  fetchRestaurantSalesReport,
  exportPropertyReports,
} from "@/services/api/propertyReportsApi"
import { PropertyReportsHeader } from "./PropertyReportsHeader"
import { PropertyReportOverview } from "./PropertyReportOverview"
import { OccupancyReportPanel } from "./OccupancyReportPanel"
import { RevenueReportPanel } from "./RevenueReportPanel"
import { ExpenseReportPanel } from "./ExpenseReportPanel"
import { InventoryReportPanel } from "./InventoryReportPanel"
import { StaffPerformanceReport } from "./StaffPerformanceReport"
import { RestaurantSalesReport } from "./RestaurantSalesReport"
import { ExportReportButtons } from "./ExportReportButtons"

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000"

function getDefaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 29)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export default function PropertyReportsDashboard() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
  const [{ startDate, endDate }, setRange] = useState(getDefaultRange)

  const [loading, setLoading] = useState(false)
  const [occupancy, setOccupancy] = useState<any>({})
  const [revenue, setRevenue] = useState<any>({})
  const [expense, setExpense] = useState<any>({})
  const [inventory, setInventory] = useState<any>({})
  const [staff, setStaff] = useState<any>({})
  const [restaurant, setRestaurant] = useState<any>({})

  const effectiveApiBase = API_BASE

  useEffect(() => {
    const loadProps = async () => {
      try {
        const res = await fetchPropertiesList(effectiveApiBase)
        const list = (res.properties || []).map((p: any) => ({ id: p.id, name: p.name }))
        setProperties(list)
        if (!selectedPropertyId) {
          const defaultId = user?.hotelId || list[0]?.id || ""
          setSelectedPropertyId(defaultId)
        }
      } catch {
        setProperties([])
      }
    }
    loadProps()
  }, [effectiveApiBase, selectedPropertyId, user?.hotelId])

  const canLoad = useMemo(
    () => !!selectedPropertyId && !!startDate && !!endDate,
    [selectedPropertyId, startDate, endDate],
  )

  useEffect(() => {
    const load = async () => {
      if (!canLoad) return
      setLoading(true)
      const params = { startDate, endDate }
      try {
        const [
          occRes,
          revRes,
          expRes,
          invRes,
          staffRes,
          restRes,
        ] = await Promise.all([
          fetchOccupancyReport(effectiveApiBase, selectedPropertyId, params),
          fetchRevenueReport(effectiveApiBase, selectedPropertyId, params),
          fetchExpenseReport(effectiveApiBase, selectedPropertyId, params),
          fetchInventoryReport(effectiveApiBase, selectedPropertyId, params),
          fetchStaffPerformanceReport(effectiveApiBase, selectedPropertyId, params),
          fetchRestaurantSalesReport(effectiveApiBase, selectedPropertyId, params),
        ])
        setOccupancy(occRes)
        setRevenue(revRes)
        setExpense(expRes)
        setInventory(invRes)
        setStaff(staffRes)
        setRestaurant(restRes)
      } catch (e) {
        console.error("Property reports load error", e)
        setOccupancy({})
        setRevenue({})
        setExpense({})
        setInventory({})
        setStaff({})
        setRestaurant({})
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [canLoad, effectiveApiBase, endDate, selectedPropertyId, startDate])

  const selectedPropertyName =
    properties.find((p) => p.id === selectedPropertyId)?.name || ""

  const handleExport = async () => {
    if (!selectedPropertyId) return
    const res = await exportPropertyReports(effectiveApiBase, selectedPropertyId, {
      startDate,
      endDate,
    })
    // If backend returns a file URL or buffer, you can hook that up here.
    console.log("Export response", res)
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <PropertyReportsHeader
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        onPropertyChange={setSelectedPropertyId}
        startDate={startDate}
        endDate={endDate}
        onStartChange={(v) => setRange((prev) => ({ ...prev, startDate: v }))}
        onEndChange={(v) => setRange((prev) => ({ ...prev, endDate: v }))}
        onApply={() => {}}
        onReset={() => setRange(getDefaultRange())}
      />

      <PropertyReportOverview
        propertyName={selectedPropertyName}
        totalRevenue={revenue?.totalRevenueThisMonth || 0}
        occupancyRate={occupancy?.occupancyRateToday || 0}
        totalExpenses={expense?.totalExpenses || 0}
        loading={loading}
      />

      <OccupancyReportPanel data={occupancy} loading={loading} />
      <RevenueReportPanel data={revenue} loading={loading} />
      <ExpenseReportPanel data={expense} loading={loading} />
      <InventoryReportPanel data={inventory} loading={loading} />
      <StaffPerformanceReport data={staff} loading={loading} />
      <RestaurantSalesReport data={restaurant} loading={loading} />

      <ExportReportButtons onExport={handleExport} loading={loading} />
    </main>
  )
}

