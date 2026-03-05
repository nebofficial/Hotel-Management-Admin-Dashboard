'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function CheckOutActions({ canClose, closing, onClose, onSendInvoice }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <CheckCircle2 className="h-5 w-5" />
          Close Stay
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-2 text-xs">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10 border-white/40 text-white hover:bg-white/20"
            onClick={onSendInvoice}
          >
            Send Invoice (Email/WhatsApp)
          </Button>
          <Button
            type="button"
            disabled={!canClose || closing}
            onClick={onClose}
            className="flex-1 h-10 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 font-semibold"
          >
            {closing ? 'Closing…' : 'Close Stay'}
          </Button>
        </div>
        {!canClose && (
          <p className="text-[11px] text-amber-100 text-center">
            Generate and settle the final bill before closing the stay.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

