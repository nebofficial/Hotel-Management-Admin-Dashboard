'use client'

import { useMemo, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, X } from 'lucide-react'

export default function CategoryImageUpload({ value, onChange }) {
  const [busy, setBusy] = useState(false)

  const preview = useMemo(() => (value ? String(value) : ''), [value])

  const handleFile = async (file) => {
    if (!file) return
    setBusy(true)
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.onload = () => resolve(String(reader.result || ''))
        reader.readAsDataURL(file)
      })
      onChange?.(dataUrl)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>Category Image</Label>
      <div className="rounded-md border border-slate-200 bg-white p-3">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
              disabled={busy}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onChange?.(null)}
                disabled={!preview || busy}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
              <p className="text-xs text-slate-500">
                Upload an image (stored as URL or data URL).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

