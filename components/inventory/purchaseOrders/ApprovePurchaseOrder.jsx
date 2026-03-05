'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function ApprovePurchaseOrder({ order, onApprove, onCancel, canApprove = false }) {
  const canEdit = order?.status === 'Draft' || order?.status === 'Pending'
  const canCancel = order?.status !== 'Received' && order?.status !== 'Cancelled'

  return (
    <div className="flex gap-2">
      {canEdit && canApprove && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex-1">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve PO
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Purchase Order?</AlertDialogTitle>
              <AlertDialogDescription>
                This will change the status to "Approved" and allow the order to proceed. Order: {order?.orderNumber}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onApprove?.(order?.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {canCancel && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel PO
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Purchase Order?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The order will be marked as cancelled. Order: {order?.orderNumber}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Order</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onCancel?.(order?.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Cancel Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
