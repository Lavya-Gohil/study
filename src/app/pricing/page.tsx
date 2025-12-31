'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANS = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Up to 3 subjects',
      'Basic AI study plans (3 tasks/day)',
      'Pomodoro timer',
      'Streak tracking',
      'Limited doubt solver (3/day)',
      'Weekly progress',
    ],
  },
  {
    name: 'Premium Monthly',
    price: 499,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
    features: [
      '7-day free trial',
      'AI-generated daily study plans',
      'Unlimited subjects',
      'AI doubt solver',
      'Advanced analytics',
      'Distraction lock mode',
      'Weekly progress reports',
    ],
    popular: true,
  },
  {
    name: 'Premium Yearly',
    price: 3999,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY,
    features: [
      '7-day free trial',
      'All Premium Monthly features',
      'Save ₹2000/year',
      'Priority support',
      'Early access to new features',
    ],
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | undefined, planName: string) => {
    if (planName === 'Free') {
      router.push('/onboarding')
      return
    }

    if (!priceId) {
      alert('Stripe not configured. Set NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY and NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY in .env.local')
      return
    }

    setLoading(planName)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        alert('Checkout failed. Stripe may not be configured.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout error. Check console for details.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="app-shell">
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">StudyFocus</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-600">
            Start with a 7-day free trial. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card rounded-3xl p-8 ${
                plan.popular ? 'ring-4 ring-blue-600 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-slate-900">
                    ₹{plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-600 ml-2">
                      /{plan.name.includes('Yearly') ? 'year' : 'month'}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.priceId, plan.name)}
                disabled={loading === plan.name}
                className={`w-full py-3 rounded-xl font-medium transition ${
                  plan.price === 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-800 text-white hover:bg-slate-900'
                }`}
              >
                {loading === plan.name
                  ? 'Processing...'
                  : plan.price === 0
                  ? 'Get Started Free'
                  : 'Start Free Trial'}
              </button>
              {plan.price > 0 && (
                <p className="mt-3 text-xs text-slate-500 text-center">
                  Cancel anytime during trial
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-slate-600">
          <p className="mb-2">💳 Secure payment powered by Stripe</p>
          <p>Cancel anytime. No questions asked.</p>
        </div>
      </main>
    </div>
  )
}
