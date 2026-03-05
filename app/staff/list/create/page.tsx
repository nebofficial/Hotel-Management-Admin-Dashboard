'use client'

import { FormBuilder } from '@/components/form-builder'

export default function CreateStaffPage() {
  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'John' },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Smith' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@hotel.com' },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+1 (555) 000-0000' },
    {
      name: 'role',
      label: 'Position',
      type: 'select',
      required: true,
      options: [
        { label: 'Front Desk', value: 'front_desk' },
        { label: 'Housekeeping', value: 'housekeeping' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Manager', value: 'manager' },
      ],
    },
    { name: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
    { name: 'salary', label: 'Monthly Salary', type: 'number', required: true, placeholder: '2500' },
  ]

  return (
    <FormBuilder
      title="Add New Staff Member"
      description="Register a new employee"
      fields={fields}
      submitText="Add Staff"
      backLink="/staff/list"
    />
  )
}
