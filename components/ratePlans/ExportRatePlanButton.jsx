'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export function ExportRatePlanButton({ plans = [] }) {
  const exportCsv = () => {
    const rows = plans.map((p) => ({
      Name: p.name,
      RoomTypes: (p.roomTypes || []).join(', '),
      BasePrice: p.basePrice,
      MealPlan: p.mealPlan,
      Refundable: p.isRefundable ? 'Yes' : 'No',
      NonRefundableDiscountPercent: p.nonRefundableDiscountPercent || '',
      MinStayNights: p.minStayNights || '',
      MaxStayNights: p.maxStayNights || '',
      Status: p.status,
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Rate Plans')
    XLSX.writeFile(wb, 'rate-plans.xlsx')
  }

  const exportPdf = () => {
    const doc = new jsPDF('l', 'pt')
    doc.setFontSize(14)
    doc.text('Rate Plans', 40, 40)
    doc.setFontSize(10)
    doc.text(`Total plans: ${plans.length}`, 40, 60)

    const body = plans.map((p) => [
      p.name,
      (p.roomTypes || []).join(', '),
      Number(p.basePrice || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      p.mealPlan,
      p.isRefundable ? 'Yes' : 'No',
      p.minStayNights || '',
      p.maxStayNights || '',
      p.status,
    ])

    autoTable(doc, {
      startY: 80,
      head: [['Name', 'Room Types', 'Base Price', 'Meal Plan', 'Refundable', 'Min Stay', 'Max Stay', 'Status']],
      body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] },
    })

    doc.save('rate-plans.pdf')
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={exportPdf}
        className="h-8 px-3 rounded-full text-[11px] font-medium bg-slate-900 text-slate-50 hover:bg-slate-800"
      >
        PDF
      </button>
      <button
        type="button"
        onClick={exportCsv}
        className="h-8 px-3 rounded-full text-[11px] font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
      >
        Excel
      </button>
    </div>
  )
}

