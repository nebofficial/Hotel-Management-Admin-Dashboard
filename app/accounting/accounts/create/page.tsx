'use client'

import { FormBuilder } from '@/components/form-builder'

export default function CreateAccountPage() {
  const fields = [
    { name: 'code', label: 'Account Code', type: 'text', required: true, placeholder: '1001' },
    { name: 'name', label: 'Account Name', type: 'text', required: true, placeholder: 'Cash' },
    {
      name: 'type',
      label: 'Account Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Asset', value: 'asset' },
        { label: 'Liability', value: 'liability' },
        { label: 'Income', value: 'income' },
        { label: 'Expense', value: 'expense' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Account details' },
  ]

  return (
    <FormBuilder
      title="Create New Account"
      description="Add a new account to the chart of accounts"
      fields={fields}
      submitText="Create Account"
      backLink="/accounting/accounts"
    />
  )
}
