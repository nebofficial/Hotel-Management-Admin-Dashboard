'use client'

import { Button } from '@/components/ui/button'

export function ActionPermissionToggle({ label, enabled, onChange, disabled }) {
  const display = label === 'view' ? 'View' : label === 'create' ? 'Create' : label === 'edit' ? 'Edit' : 'Delete'
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      title={enabled ? 'On – click to turn off' : 'Off – click to turn on'}
      className={`h-6 text-[10px] px-2 min-w-0 font-medium transition-colors ${
        enabled
          ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500 shadow-sm'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
      }`}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!enabled)}
    >
      {display}
    </Button>
  )
}

