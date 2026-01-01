'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()

  useEffect(() => {
    // All features are now free, redirect to dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          All Premium Features Are Now Free! 🎉
        </h1>
        <p className="text-slate-600">Redirecting you to the dashboard...</p>
      </div>
    </div>
  )
}
