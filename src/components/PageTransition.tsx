'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
const spotlightTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="relative"
        initial={{ opacity: 0, y: 16, scale: 0.985, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -14, scale: 0.995, filter: 'blur(10px)' }}
        transition={pageTransition}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: -10, backgroundImage: 'var(--page-gradient)', mixBlendMode: 'screen' }}
          initial={{ opacity: 0, scale: 0.96, rotate: 0.4 }}
          animate={{ opacity: 0.42, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.04, rotate: -0.35 }}
          transition={spotlightTransition}
        />

        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-[6%] rounded-[48px] blur-3xl"
          style={{ zIndex: -9, background: 'radial-gradient(circle at 52% 38%, color-mix(in srgb, var(--accent-violet) 36%, transparent), transparent 55%)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.24, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={spotlightTransition}
        />

        {children}
      </motion.div>
    </AnimatePresence>
  )
}
