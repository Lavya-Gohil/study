'use client'

import { useEffect } from 'react'

export default function CursorSpotlight() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches

    if (prefersReducedMotion || isCoarsePointer) return

    const root = document.documentElement
    const handleMove = (event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${event.clientX}px`)
      root.style.setProperty('--cursor-y', `${event.clientY}px`)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return (
    <div aria-hidden className="cursor-spotlight">
      <div className="cursor-spotlight__glow" />
      <div className="cursor-spotlight__ring" />
    </div>
  )
}
