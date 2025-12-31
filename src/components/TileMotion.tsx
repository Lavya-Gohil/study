'use client'

import { useEffect } from 'react'

export default function TileMotion() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches

    if (prefersReducedMotion || isCoarse) return

    let frame = 0
    let lastTarget: HTMLElement | null = null
    let pendingEvent: PointerEvent | null = null

    const update = () => {
      frame = 0
      if (!pendingEvent) return

      const event = pendingEvent
      pendingEvent = null

      const target = (event.target as HTMLElement).closest('.glass-card') as HTMLElement | null
      if (!target) {
        if (lastTarget) {
          lastTarget.style.setProperty('--tilt-x', '0deg')
          lastTarget.style.setProperty('--tilt-y', '0deg')
          lastTarget.style.setProperty('--glow', '0')
          lastTarget = null
        }
        return
      }

      const rect = target.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height

      const tiltX = (0.5 - y) * 10
      const tiltY = (x - 0.5) * 10

      target.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
      target.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
      target.style.setProperty('--glow-x', `${(x * 100).toFixed(2)}%`)
      target.style.setProperty('--glow-y', `${(y * 100).toFixed(2)}%`)
      target.style.setProperty('--glow', '1')

      if (lastTarget && lastTarget !== target) {
        lastTarget.style.setProperty('--tilt-x', '0deg')
        lastTarget.style.setProperty('--tilt-y', '0deg')
        lastTarget.style.setProperty('--glow', '0')
      }
      lastTarget = target
    }

    const handleMove = (event: PointerEvent) => {
      pendingEvent = event
      if (!frame) {
        frame = window.requestAnimationFrame(update)
      }
    }

    const handleLeave = () => {
      if (lastTarget) {
        lastTarget.style.setProperty('--tilt-x', '0deg')
        lastTarget.style.setProperty('--tilt-y', '0deg')
        lastTarget.style.setProperty('--glow', '0')
        lastTarget = null
      }
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerleave', handleLeave)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerleave', handleLeave)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
