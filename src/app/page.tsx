'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiArrowRight, FiLock, FiClock, FiTrendingUp, FiZap, FiCheck } from 'react-icons/fi'
import Image from 'next/image'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_60%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.18),_transparent_45%),radial-gradient(circle_at_20%_70%,_rgba(236,72,153,0.16),_transparent_45%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_60%),radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.12),_transparent_45%),radial-gradient(circle_at_20%_70%,_rgba(236,72,153,0.10),_transparent_45%),linear-gradient(135deg,_#0f172a,_#1e1b4b)]">
      <div className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full liquid-orb orb-glow animate-float-slow"></div>
      <div className="pointer-events-none absolute top-32 -right-28 h-[360px] w-[360px] rounded-full liquid-orb orb-glow animate-pulse-glow"></div>
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-[280px] w-[280px] rounded-full liquid-orb animate-float-slow opacity-70"></div>
      {/* Header */}
      <header className="fixed top-0 w-full glass-panel glass-shimmer border-b border-white/30 dark:border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Acadot Logo" 
              width={40} 
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Acadot
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 text-sm font-medium"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 glass-panel rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">
            <FiZap className="w-4 h-4" />
            <span>Device Lock Technology • Zero Distractions</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              Lock Your Device.
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">Master Your Focus.</span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The first study app that actually locks your device during study sessions.
            No notifications. No apps. Just pure, uninterrupted focus time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.03] transition-all duration-300 text-lg font-semibold flex items-center gap-3"
            >
              Start Free Trial
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 glass-panel rounded-2xl hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-lg font-semibold text-slate-700 dark:text-slate-200"
            >
              See How It Works
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Animation */}
        <div className="relative max-w-5xl mx-auto mb-32">
          <div className="relative glass-panel glass-shimmer rounded-[32px] overflow-hidden border border-white/40">
            <div className="aspect-video flex items-center justify-center p-12 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white">
              <div className="text-center space-y-6">
                <div className="text-8xl font-light tracking-tight">25:00</div>
                <div className="text-slate-300 text-sm tracking-[0.4em] uppercase">Focus Mode Active</div>
                <div className="flex gap-4 justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                    <div className="w-6 h-6 border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10"></div>
        </div>

        {/* Features */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: FiLock,
              title: 'Device Lock',
              description: 'Your phone becomes a study-only device. No apps, no notifications, no distractions.',
              gradient: 'from-blue-500 to-blue-600',
            },
            {
              icon: FiClock,
              title: 'Smart Sessions',
              description: 'Set custom study durations. Pause for emergencies. Track every minute automatically.',
              gradient: 'from-purple-500 to-purple-600',
            },
            {
              icon: FiTrendingUp,
              title: 'Real Analytics',
              description: 'See exactly how many hours you studied. No guessing. No manual logging.',
              gradient: 'from-pink-500 to-pink-600',
            },
          ].map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300 blur-xl`}></div>
              <div className="relative glass-panel rounded-3xl p-8 hover:border-white/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="glass-panel glass-shimmer rounded-3xl p-12 mb-32 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-900 dark:text-white">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-slate-600 dark:text-slate-300">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-slate-600 dark:text-slate-300">Study Hours Locked</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-slate-600 dark:text-slate-300">Success Rate</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">Three steps to distraction-free studying</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick Subject', desc: 'Click any subject you want to study' },
              { step: '02', title: 'Set Timer', desc: 'Choose duration from 5 to 120 minutes' },
              { step: '03', title: 'Lock & Focus', desc: 'Device locks. Timer starts. You study.' },
            ].map((item, i) => (
              <div key={i} className="text-center glass-panel rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-2">
                <div className="text-6xl font-bold text-slate-200 dark:text-slate-700 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center glass-outline backdrop-blur-2xl rounded-3xl p-16 shadow-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Actually Focus?
          </h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Join thousands of students who stopped getting distracted and started achieving their goals.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-bold"
          >
            Start Free Trial
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/40 dark:border-white/10 glass-panel py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Product</h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a></div>
                <div><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Company</h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</a></div>
                <div><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Legal</h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a></div>
                <div><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Support</h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Help Center</a></div>
                <div><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Community</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/40 dark:border-white/10 pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            © 2024 Acadot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
