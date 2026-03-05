'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PencilLine } from 'lucide-react'

export default function DigitalSignaturePad({ value, onChange }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#111827'
  }, [])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDraw = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endDraw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    setIsDrawing(false)
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')
    onChange?.(dataUrl)
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onChange?.(null)
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <PencilLine className="h-5 w-5" />
          Digital Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-2">
        <div className="bg-white rounded-lg overflow-hidden border border-orange-200">
          <canvas
            ref={canvasRef}
            width={600}
            height={160}
            className="w-full h-40 touch-none cursor-crosshair bg-white"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-white/80 mt-1">
          <span>Guest signs here for registration & deposit agreement.</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleClear}
            className="border-white/40 text-white hover:bg-white/20 h-7 px-3"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

