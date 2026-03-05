'use client'

import IncreaseDecreaseStock from './IncreaseDecreaseStock'

export default function ExpiryAdjustment(props) {
  return <IncreaseDecreaseStock {...props} defaultType="EXPIRY" />
}
