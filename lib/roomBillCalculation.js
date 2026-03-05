/**
 * Room Bill calculation helpers
 * GST: CGST/SGST split (intrastate), IGST (interstate)
 */
export function calcGst(amount, gstRate = 18, isInterstate = false) {
  const rate = Number(gstRate) / 100
  const tax = amount * rate
  if (isInterstate) {
    return { igst: tax, cgst: 0, sgst: 0, total: tax }
  }
  const half = tax / 2
  return { cgst: half, sgst: half, igst: 0, total: tax }
}

export function calcServiceCharge(amount, serviceChargePercent = 0) {
  const pct = Number(serviceChargePercent) / 100
  return amount * pct
}

export function calcLateCheckoutCharge(actualCheckout, standardCheckout, hourlyRate = 0) {
  const standard = new Date(standardCheckout)
  const actual = new Date(actualCheckout)
  if (actual <= standard) return 0
  const extraMs = actual - standard
  const extraHours = Math.ceil(extraMs / (60 * 60 * 1000))
  return extraHours * Number(hourlyRate || 0)
}

export function calcStayNights(checkIn, checkOut) {
  const ci = new Date(checkIn)
  const co = new Date(checkOut)
  return Math.max(1, Math.ceil((co - ci) / (24 * 60 * 60 * 1000)))
}
