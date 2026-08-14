import { BrowserMultiFormatReader } from '@zxing/browser'
import type { IScannerControls } from '@zxing/browser'
import { useEffect, useRef, useState } from 'react'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
  onClose: () => void
}

/** Full-screen camera scanner. Requires HTTPS (or localhost) and camera permission. */
export function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    let cancelled = false

    reader
      .decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result, _err, controls) => {
        controlsRef.current = controls
        if (cancelled || !result) return
        controls.stop()
        onDetected(result.getText())
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not access the camera.')
        }
      })

    return () => {
      cancelled = true
      controlsRef.current?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95" role="dialog" aria-modal="true" aria-label="Barcode scanner">
      <div className="flex items-center justify-between p-4">
        <p className="font-display text-sm font-medium text-white">Scan a barcode</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-white/30 px-3 py-1.5 text-sm text-white hover:bg-white/10"
        >
          Close
        </button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-36 w-64 rounded-lg border-2 border-gold shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
        </div>
      </div>
      {error ? (
        <p className="bg-status-contains-bg p-3 text-center text-sm text-status-contains">
          {error} Try entering the barcode manually instead.
        </p>
      ) : (
        <p className="p-3 text-center text-xs text-white/70">Point your camera at a product barcode.</p>
      )}
    </div>
  )
}
