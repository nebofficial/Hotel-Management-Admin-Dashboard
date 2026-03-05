'use client'

import IncreaseDecreaseStock from './IncreaseDecreaseStock'

export default function ManualCorrection(props) {
  return <IncreaseDecreaseStock {...props} defaultType="MANUAL_CORRECTION" />
}
