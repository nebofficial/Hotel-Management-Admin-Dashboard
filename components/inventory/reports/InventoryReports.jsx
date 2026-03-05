'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/auth-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import StockSummaryReport from './StockSummaryReport'
import LowStockReport from './LowStockReport'
import PurchaseReport from './PurchaseReport'
import SupplierReport from './SupplierReport'
import StockMovementReport from './StockMovementReport'
import ExpiryReport from './ExpiryReport'
import InventoryValuationReport from './InventoryValuationReport'
import DateFilter from './DateFilter'
import CategoryFilter from './CategoryFilter'
import ExportReport from './ExportReport'
import ReportCharts from './ReportCharts'

export default function InventoryReports() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [stockSummary, setStockSummary] = useState(null)
  const [purchaseReport, setPurchaseReport] = useState(null)
  const [supplierReport, setSupplierReport] = useState(null)
  const [stockMovement, setStockMovement] = useState(null)
  const [expiryReport, setExpiryReport] = useState(null)
  const [valuationReport, setValuationReport] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (effectiveHotelId) {
      loadAllReports()
    }
  }, [effectiveHotelId, startDate, endDate])

  const loadAllReports = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      const baseUrl = `http://localhost:5000/api/hotel-data/${effectiveHotelId}/reports/inventory`
      const itemsUrl = `http://localhost:5000/api/hotel-data/${effectiveHotelId}/inventory-items`

      const [summaryRes, purchaseRes, supplierRes, movementRes, expiryRes, valuationRes, itemsRes] = await Promise.all([
        fetch(`${baseUrl}/stock-summary`, { headers }),
        fetch(`${baseUrl}/purchase-report?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${baseUrl}/supplier-report`, { headers }),
        fetch(`${baseUrl}/stock-movement?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${baseUrl}/expiry-report`, { headers }),
        fetch(`${baseUrl}/valuation`, { headers }),
        fetch(itemsUrl, { headers }),
      ])

      if (summaryRes.ok) setStockSummary(await summaryRes.json())
      if (purchaseRes.ok) setPurchaseReport(await purchaseRes.json())
      if (supplierRes.ok) setSupplierReport(await supplierRes.json())
      if (movementRes.ok) setStockMovement(await movementRes.json())
      if (expiryRes.ok) setExpiryReport(await expiryRes.json())
      if (valuationRes.ok) setValuationReport(await valuationRes.json())
      if (itemsRes.ok) {
        const data = await itemsRes.json()
        const items = data.items || []
        setInventoryItems(items)
        const cats = [...new Set(items.map((i) => i.category).filter(Boolean))]
        setCategories(cats)
      }
    } catch (error) {
      console.error('Load reports error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = selectedCategory ? inventoryItems.filter((i) => i.category === selectedCategory) : inventoryItems

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      
      doc.setFontSize(20)
      doc.text('Inventory Report', pageWidth / 2, 20, null, null, 'center')
      
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, null, null, 'center')
      
      if (startDate || endDate) {
        doc.text(`Period: ${startDate || 'Start'} to ${endDate || 'End'}`, pageWidth / 2, 34, null, null, 'center')
      }

      let yPos = 45

      if (stockSummary) {
        doc.setFontSize(14)
        doc.text('Stock Summary', 14, yPos)
        yPos += 8
        
        const summaryData = [
          ['Total Items', String(stockSummary.totalItems || 0)],
          ['Total Quantity', String(stockSummary.totalQuantity || 0)],
          ['Total Value', `$${(stockSummary.totalValue || 0).toFixed(2)}`],
          ['Low Stock Items', String(stockSummary.lowStock || 0)],
        ]
        
        autoTable(doc, {
          startY: yPos,
          head: [['Metric', 'Value']],
          body: summaryData,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] },
          margin: { left: 14, right: 14 },
        })
        
        yPos = doc.lastAutoTable.finalY + 10
      }

      if (filteredItems.length > 0) {
        doc.setFontSize(14)
        doc.text('Inventory Items', 14, yPos)
        yPos += 8
        
        const itemsData = filteredItems.slice(0, 50).map((item) => [
          String(item.itemName || ''),
          String(item.category || 'N/A'),
          String(item.currentStock || 0),
          `$${(Number(item.unitPrice || item.costPrice || 0)).toFixed(2)}`,
          `$${((item.currentStock || 0) * Number(item.unitPrice || item.costPrice || 0)).toFixed(2)}`,
        ])
        
        autoTable(doc, {
          startY: yPos,
          head: [['Item Name', 'Category', 'Stock', 'Unit Price', 'Total Value']],
          body: itemsData,
          theme: 'striped',
          headStyles: { fillColor: [16, 185, 129] },
          margin: { left: 14, right: 14 },
        })
        
        yPos = doc.lastAutoTable.finalY + 10
      }

      if (expiryReport && (expiryReport.expired?.length > 0 || expiryReport.nearExpiry?.length > 0)) {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFontSize(14)
        doc.text('Expiry Report', 14, yPos)
        yPos += 8
        
        const expiryData = []
        
        if (expiryReport.expired?.length > 0) {
          expiryReport.expired.slice(0, 10).forEach((item) => {
            expiryData.push([
              String(item.itemName || ''),
              'Expired',
              new Date(item.expiryDate).toLocaleDateString(),
            ])
          })
        }
        
        if (expiryReport.nearExpiry?.length > 0) {
          expiryReport.nearExpiry.slice(0, 10).forEach((item) => {
            expiryData.push([
              String(item.itemName || ''),
              'Near Expiry',
              new Date(item.expiryDate).toLocaleDateString(),
            ])
          })
        }
        
        if (expiryData.length > 0) {
          autoTable(doc, {
            startY: yPos,
            head: [['Item Name', 'Status', 'Expiry Date']],
            body: expiryData,
            theme: 'grid',
            headStyles: { fillColor: [239, 68, 68] },
            margin: { left: 14, right: 14 },
          })
        }
      }

      doc.save(`Inventory_Report_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('PDF export error:', error)
      alert(`Failed to export PDF: ${error.message}`)
    }
  }

  const handleExportExcel = () => {
    try {
      const workbook = XLSX.utils.book_new()

      if (stockSummary) {
        const summaryData = [
          ['Inventory Report Summary'],
          ['Generated on:', new Date().toLocaleDateString()],
          [],
          ['Metric', 'Value'],
          ['Total Items', stockSummary.totalItems || 0],
          ['Total Quantity', stockSummary.totalQuantity || 0],
          ['Total Value', `$${(stockSummary.totalValue || 0).toFixed(2)}`],
          ['Low Stock Items', stockSummary.lowStock || 0],
        ]
        
        if (stockSummary.byCategory && Object.keys(stockSummary.byCategory).length > 0) {
          summaryData.push([])
          summaryData.push(['Category Breakdown'])
          summaryData.push(['Category', 'Items', 'Quantity', 'Value'])
          Object.entries(stockSummary.byCategory).forEach(([cat, vals]) => {
            summaryData.push([cat, vals.count, vals.quantity, `$${vals.value.toFixed(2)}`])
          })
        }
        
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
      }

      if (filteredItems.length > 0) {
        const itemsData = [
          ['Item Name', 'Category', 'Current Stock', 'Unit Price', 'Total Value', 'Reorder Level', 'Supplier'],
        ]
        
        filteredItems.forEach((item) => {
          itemsData.push([
            item.itemName || '',
            item.category || 'N/A',
            item.currentStock || 0,
            Number(item.unitPrice || item.costPrice || 0).toFixed(2),
            ((item.currentStock || 0) * Number(item.unitPrice || item.costPrice || 0)).toFixed(2),
            item.reorderLevel || 0,
            item.supplier || 'N/A',
          ])
        })
        
        const itemsSheet = XLSX.utils.aoa_to_sheet(itemsData)
        XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Items')
      }

      if (purchaseReport && purchaseReport.orders?.length > 0) {
        const purchaseData = [
          ['Purchase Order', 'Supplier', 'Order Date', 'Status', 'Total Amount'],
        ]
        
        purchaseReport.orders.slice(0, 100).forEach((order) => {
          purchaseData.push([
            order.orderNumber || order.id,
            order.supplierName || 'N/A',
            new Date(order.orderDate || order.createdAt).toLocaleDateString(),
            order.status || 'N/A',
            `$${(order.totalAmount || 0).toFixed(2)}`,
          ])
        })
        
        const purchaseSheet = XLSX.utils.aoa_to_sheet(purchaseData)
        XLSX.utils.book_append_sheet(workbook, purchaseSheet, 'Purchases')
      }

      if (expiryReport && (expiryReport.expired?.length > 0 || expiryReport.nearExpiry?.length > 0)) {
        const expiryData = [
          ['Item Name', 'Category', 'Status', 'Expiry Date', 'Current Stock'],
        ]
        
        if (expiryReport.expired?.length > 0) {
          expiryReport.expired.forEach((item) => {
            expiryData.push([
              item.itemName || '',
              item.category || 'N/A',
              'Expired',
              new Date(item.expiryDate).toLocaleDateString(),
              item.currentStock || 0,
            ])
          })
        }
        
        if (expiryReport.nearExpiry?.length > 0) {
          expiryReport.nearExpiry.forEach((item) => {
            expiryData.push([
              item.itemName || '',
              item.category || 'N/A',
              'Near Expiry',
              new Date(item.expiryDate).toLocaleDateString(),
              item.currentStock || 0,
            ])
          })
        }
        
        const expirySheet = XLSX.utils.aoa_to_sheet(expiryData)
        XLSX.utils.book_append_sheet(workbook, expirySheet, 'Expiry')
      }

      if (supplierReport && supplierReport.report?.length > 0) {
        const supplierData = [
          ['Supplier Name', 'Total Orders', 'Total Amount', 'Outstanding Balance', 'Contact'],
        ]
        
        supplierReport.report.forEach((item) => {
          supplierData.push([
            item.supplier.supplierName || '',
            item.totalOrders || 0,
            `$${(item.totalAmount || 0).toFixed(2)}`,
            `$${(item.outstanding || 0).toFixed(2)}`,
            item.supplier.contactPerson || 'N/A',
          ])
        })
        
        const supplierSheet = XLSX.utils.aoa_to_sheet(supplierData)
        XLSX.utils.book_append_sheet(workbook, supplierSheet, 'Suppliers')
      }

      XLSX.writeFile(workbook, `Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('Excel export error:', error)
      alert('Failed to export Excel. Please try again.')
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Select a hotel or log in with a hotel account to view inventory reports.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading inventory reports...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and insights for your inventory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateFilter startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
        <ExportReport onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-white p-2 rounded-2xl shadow-md">
          <TabsTrigger value="summary" className="rounded-xl">Summary</TabsTrigger>
          <TabsTrigger value="lowstock" className="rounded-xl">Low Stock</TabsTrigger>
          <TabsTrigger value="purchase" className="rounded-xl">Purchase</TabsTrigger>
          <TabsTrigger value="supplier" className="rounded-xl">Supplier</TabsTrigger>
          <TabsTrigger value="movement" className="rounded-xl">Movement</TabsTrigger>
          <TabsTrigger value="expiry" className="rounded-xl">Expiry</TabsTrigger>
          <TabsTrigger value="valuation" className="rounded-xl">Valuation</TabsTrigger>
          <TabsTrigger value="charts" className="rounded-xl">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <StockSummaryReport data={stockSummary} />
        </TabsContent>

        <TabsContent value="lowstock">
          <LowStockReport items={filteredItems} />
        </TabsContent>

        <TabsContent value="purchase">
          <PurchaseReport data={purchaseReport} />
        </TabsContent>

        <TabsContent value="supplier">
          <SupplierReport data={supplierReport} />
        </TabsContent>

        <TabsContent value="movement">
          <StockMovementReport data={stockMovement} />
        </TabsContent>

        <TabsContent value="expiry">
          <ExpiryReport data={expiryReport} />
        </TabsContent>

        <TabsContent value="valuation">
          <InventoryValuationReport data={valuationReport} />
        </TabsContent>

        <TabsContent value="charts">
          <ReportCharts stockData={stockSummary} movementData={stockMovement} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
