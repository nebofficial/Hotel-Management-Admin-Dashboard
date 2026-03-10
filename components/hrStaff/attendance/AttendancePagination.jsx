'use client'

import { Button } from '@/components/ui/button'

export function AttendancePagination({ page, total, pageSize, onChange }) {
  const p = page || 1
  const size = pageSize || 20
  const pages = Math.max(1, Math.ceil((total || 0) / size))

  const go = (next) => {
    if (next < 1 || next > pages) return
    onChange?.(next)
  }

  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-end gap-2 pt-2 text-[11px] text-slate-600">
      <span>
        Page {p} of {pages}
      </span>
      <Button type="button" size="xs" variant="outline" className="h-7" onClick={() => go(p - 1)}>
        Prev
      </Button>
      <Button type="button" size="xs" variant="outline" className="h-7" onClick={() => go(p + 1)}>
        Next
      </Button>
    </div>
  )
}

