'use client'

export function CommissionTypeSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="radio"
          name="commissionType"
          value="PERCENT"
          checked={value === 'PERCENT'}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <span>Percentage (%)</span>
      </label>
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="radio"
          name="commissionType"
          value="FIXED"
          checked={value === 'FIXED'}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <span>Fixed Amount</span>
      </label>
    </div>
  )
}

