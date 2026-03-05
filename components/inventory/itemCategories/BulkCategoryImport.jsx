'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []
  const header = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim())
    const row = {}
    header.forEach((h, i) => {
      row[h] = cols[i] ?? ''
    })
    return row
  })
}

export default function BulkCategoryImport({ onImport, importing }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState([])

  const canImport = useMemo(() => Boolean(file) && preview.length > 0 && !importing, [file, preview.length, importing])

  const handleFile = async (f) => {
    setError(null)
    setPreview([])
    setFile(f)
    if (!f) return

    const ext = (f.name.split('.').pop() || '').toLowerCase()
    try {
      if (ext === 'csv') {
        const text = await f.text()
        const rows = parseCsv(text)
        setPreview(rows.slice(0, 25))
      } else if (ext === 'xlsx' || ext === 'xls') {
        // Optional: requires `xlsx` package. We load it dynamically.
        const mod = await import('xlsx')
        const buf = await f.arrayBuffer()
        const wb = mod.read(buf, { type: 'array' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const rows = mod.utils.sheet_to_json(sheet, { defval: '' })
        setPreview(rows.slice(0, 25))
      } else {
        setError('Unsupported file type. Please upload a CSV or Excel file.')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse file')
    }
  }

  const doImport = async () => {
    if (!file) return
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    let rows = []
    try {
      if (ext === 'csv') {
        rows = parseCsv(await file.text())
      } else {
        const mod = await import('xlsx')
        const buf = await file.arrayBuffer()
        const wb = mod.read(buf, { type: 'array' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        rows = mod.utils.sheet_to_json(sheet, { defval: '' })
      }

      // Expect columns: name, description, parentName, sortOrder, isActive, imageUrl
      const categories = rows
        .map((r) => ({
          name: String(r.name || r.Name || '').trim(),
          description: String(r.description || r.Description || '').trim() || null,
          parentName: String(r.parentName || r.Parent || r.parent || '').trim() || null,
          sortOrder: r.sortOrder != null && String(r.sortOrder).trim() !== '' ? Number(r.sortOrder) : 0,
          isActive:
            r.isActive != null && String(r.isActive).trim() !== ''
              ? String(r.isActive).toLowerCase() === 'true' || String(r.isActive) === '1' || String(r.isActive).toLowerCase() === 'yes'
              : true,
          imageUrl: String(r.imageUrl || r.Image || '').trim() || null,
        }))
        .filter((c) => c.name)

      await onImport?.(categories)
      setFile(null)
      setPreview([])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed')
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <FileSpreadsheet className="h-5 w-5 text-sky-600" />
          Bulk Category Import (CSV / Excel)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Upload file</Label>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-sky-700"
          />
          <p className="text-xs text-slate-500">
            Columns supported: <span className="font-medium">name</span>, description, parentName, sortOrder, isActive, imageUrl
          </p>
        </div>

        {preview.length > 0 && (
          <div className="rounded-md border border-slate-200 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {Object.keys(preview[0]).slice(0, 6).map((k) => (
                    <th key={k} className="px-3 py-2 text-left font-semibold text-slate-700">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 8).map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-0">
                    {Object.keys(preview[0]).slice(0, 6).map((k) => (
                      <td key={k} className="px-3 py-2 text-slate-700">
                        {String(row[k] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button
          type="button"
          className="w-full bg-sky-600 hover:bg-sky-700"
          disabled={!canImport}
          onClick={doImport}
        >
          <Upload className="h-4 w-4 mr-2" />
          {importing ? 'Importing…' : 'Import Categories'}
        </Button>
      </CardContent>
    </Card>
  )
}

