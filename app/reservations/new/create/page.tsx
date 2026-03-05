'use client'

import { FormBuilder } from '@/components/form-builder'

export default function CreateReservationPage() {
  const fields = [
    { name: 'guestName', label: 'Guest Name', type: 'text', required: true, placeholder: 'John Smith' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@example.com' },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+1 (555) 000-0000' },
    { name: 'checkIn', label: 'Check-In Date', type: 'date', required: true },
    { name: 'checkOut', label: 'Check-Out Date', type: 'date', required: true },
    {
      name: 'roomType',
      label: 'Room Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Deluxe', value: 'deluxe' },
        { label: 'Suite', value: 'suite' },
      ],
    },
    { name: 'guests', label: 'Number of Guests', type: 'number', required: true },
    { name: 'notes', label: 'Special Requests', type: 'textarea', placeholder: 'Any special requests...' },
  ]

  return (
    <FormBuilder
      title="Create New Reservation"
      description="Add a new guest reservation"
      fields={fields}
      submitText="Create Reservation"
      backLink="/reservations/new"
    />
  )
}
