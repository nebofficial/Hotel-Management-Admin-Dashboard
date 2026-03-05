'use client'

import IncreaseDecreaseStock from './IncreaseDecreaseStock'

export default function TheftLossEntry(props) {
  return <IncreaseDecreaseStock {...props} defaultType="THEFT_LOSS" />
}
