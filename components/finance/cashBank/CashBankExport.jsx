"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

export default function CashBankExport({ account, entries }) {
  const rows = entries || []

  const handlePDF = () => {
    if (!account) {
      alert("Select an account first")
      return
    }

    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text("Cash / Bank Ledger", w / 2, 16, { align: "center" })

    doc.setFontSize(10)
    doc.text(
      `${account.name} ${account.accountNumber || ""}`,
      w / 2,
      22,
      { align: "center" }
    )

    const body = rows.map((e) => [
      e.date || "-",
      e.description || e.referenceNo || "-",
      e.isDebit ? Number(e.amount || 0).toFixed(2) : "-",
      !e.isDebit ? Number(e.amount || 0).toFixed(2) : "-",
      Number(e.balance ?? 0).toFixed(2),
    ])

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Description", "Debit", "Credit", "Balance"]],
      body,
      theme: "striped",
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 14, right: 14 },
    })

    doc.save(`CashBank_${account.name || "account"}.pdf`)
  }

  const handleExcel = () => {
    if (!account) {
      alert("Select an account first")
      return
    }

    const wb = XLSX.utils.book_new()

    const wsData = [
      ["Cash / Bank Ledger"],
      ["Account", account.name],
      ["Number", account.accountNumber || ""],
      [],
      ["Date", "Description", "Debit", "Credit", "Balance"],
      ...rows.map((e) => [
        e.date || "-",
        e.description || e.referenceNo || "-",
        e.isDebit ? Number(e.amount || 0).toFixed(2) : "-",
        !e.isDebit ? Number(e.amount || 0).toFixed(2) : "-",
        Number(e.balance ?? 0).toFixed(2),
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, "Ledger")

    XLSX.writeFile(wb, `CashBank_${account.name || "account"}.xlsx`)
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-teal-900 text-base">
          <Download className="h-5 w-5" />
          Export Ledger
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2">
          <Button
            onClick={handlePDF}
            variant="outline"
            className="flex-1 border-red-300 text-red-700 hover:bg-red-50 text-sm"
          >
            <FileText className="h-4 w-4 mr-1" /> PDF
          </Button>

          <Button
            onClick={handleExcel}
            variant="outline"
            className="flex-1 border-green-300 text-green-700 hover:bg-green-50 text-sm"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}