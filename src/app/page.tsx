'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiArrowRight, FiLock, FiClock, FiTrendingUp, FiZap, FiCheck } from 'react-icons/fi'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-black/5 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StudyLock
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-medium"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <FiZap className="w-4 h-4" />
            <span>Device Lock Technology • Zero Distractions</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lock Your Device.
            </span>
            <br />
            <span className="text-gray-900">Master Your Focus.</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The first study app that actually locks your device during study sessions.
            No notifications. No apps. Just pure, uninterrupted focus time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all text-lg font-semibold flex items-center gap-3"
            >
              Start Free Trial
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all text-lg font-semibold text-gray-700"
            >
              See How It Works
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-green-600" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-green-600" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-green-600" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Animation */}
        <div className="relative max-w-5xl mx-auto mb-32">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="aspect-video flex items-center justify-center p-12">
              <div className="text-center space-y-6">
                <div className="text-8xl font-light text-white">25:00</div>
                <div className="text-gray-400 text-sm tracking-widest uppercase">Focus Mode Active</div>
                <div className="flex gap-4 justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
                    <div className="w-6 h-6 border-2 border-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10"></div>
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
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity blur-xl`}></div>
              <div className="relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-300 hover:shadow-xl transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 mb-32 shadow-2xl">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Study Hours Locked</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three steps to distraction-free studying</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick Subject', desc: 'Click any subject you want to study' },
              { step: '02', title: 'Set Timer', desc: 'Choose duration from 5 to 120 minutes' },
              { step: '03', title: 'Lock & Focus', desc: 'Device locks. Timer starts. You study.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-bold text-gray-200 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-16 shadow-2xl">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Actually Focus?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who stopped getting distracted and started achieving their goals.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all text-lg font-bold"
          >
            Start Free Trial
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><a href="#" className="hover:text-gray-900">Features</a></div>
                <div><a href="#" className="hover:text-gray-900">Pricing</a></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><a href="#" className="hover:text-gray-900">About</a></div>
                <div><a href="#" className="hover:text-gray-900">Contact</a></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><a href="#" className="hover:text-gray-900">Privacy</a></div>
                <div><a href="#" className="hover:text-gray-900">Terms</a></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><a href="#" className="hover:text-gray-900">Help Center</a></div>
                <div><a href="#" className="hover:text-gray-900">Community</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            © 2024 StudyLock. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
  return (
    <div className="min-h-screen bg-white">
      {/* Minimalist Header */}
      <header className="border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-xl font-light tracking-tight">Study</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-light opacity-60 hover:opacity-100 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="h-10 px-6 bg-black text-white rounded-full hover:bg-black/90 transition text-sm font-light"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="pt-32 pb-20 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-7xl md:text-8xl font-light tracking-tight leading-none">
              Focus.<br />Study.<br />Succeed.
            </h2>
            <p className="text-xl font-light opacity-40 max-w-2xl mx-auto leading-relaxed">
              A minimalist study companion that locks your device, blocks distractions, and helps you achieve deep focus.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/auth/signup"
              className="h-14 px-12 bg-black text-white rounded-full hover:bg-black/90 transition text-sm font-light tracking-wide"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="h-14 px-12 border border-black/10 rounded-full hover:bg-black/5 transition text-sm font-light tracking-wide"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="py-32 border-t border-black/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <h3 className="text-2xl font-light">Device Lock</h3>
              <p className="font-light opacity-40 leading-relaxed">
                Lock your entire device during study sessions. Only your study timer remains accessible.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <h3 className="text-2xl font-light">Zero Distractions</h3>
              <p className="font-light opacity-40 leading-relaxed">
                All notifications blocked. No apps accessible. Pure, uninterrupted focus time.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <h3 className="text-2xl font-light">Session Tracking</h3>
              <p className="font-light opacity-40 leading-relaxed">
                Automatic time tracking. See exactly how many hours you've studied for each subject.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="py-32 border-t border-black/5">
          <div className="grid grid-cols-3 gap-16 text-center">
            <div className="space-y-2">
              <div className="text-6xl font-light">10K+</div>
              <div className="text-sm font-light opacity-40 tracking-wide">Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl font-light">1M+</div>
              <div className="text-sm font-light opacity-40 tracking-wide">Study Hours</div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl font-light">95%</div>
              <div className="text-sm font-light opacity-40 tracking-wide">Success Rate</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-32 text-center space-y-8 border-t border-black/5">
          <h2 className="text-5xl font-light tracking-tight">
            Ready to focus?
          </h2>
          <p className="text-lg font-light opacity-40 max-w-xl mx-auto">
            Join thousands of students achieving their goals with distraction-free study sessions.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block h-14 px-12 bg-black text-white rounded-full hover:bg-black/90 transition text-sm font-light tracking-wide"
          >
            Start Free Today
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-light">Study</h3>
              <p className="text-sm font-light opacity-40 leading-relaxed">
                Minimalist study companion for focused learning.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-light opacity-40 uppercase tracking-wider">Product</div>
              <div className="space-y-2">
                <a href="#" className="block text-sm font-light opacity-60 hover:opacity-100 transition">
                  Features
                </a>
                <a href="#" className="block text-sm font-light opacity-60 hover:opacity-100 transition">
                  Pricing
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-light opacity-40 uppercase tracking-wider">Company</div>
              <div className="space-y-2">
                <a href="#" className="block text-sm font-light opacity-60 hover:opacity-100 transition">
                  About
                </a>
                <a href="#" className="block text-sm font-light opacity-60 hover:opacity-100 transition">
                  Contact
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-light opacity-40 uppercase tracking-wider">Legal</div>
              <div className="space-y-2">
                <a href="#" className="block text-sm font-light opacity-60 hover:opacity-100 transition">
                  Privacy
                </a>
                <a href="#" className="block text-sm font-light opacity-60 hover:opacity-100 transition">
                  Terms
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-black/5 mt-12 pt-8 text-center">
            <p className="text-xs font-light opacity-40">© 2024 Study. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-3xl">🎓</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StudyAI
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🚀 Trusted by 10,000+ Students
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Master Your Studies with
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Powered Planning
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Ace JEE, SAT, and Board Exams with personalized AI study plans, analytics dashboards,
            smart focus timers, and instant doubt solving. Your success companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl transition transform hover:scale-105 flex items-center gap-2"
            >
              Get Started Free
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition shadow-lg border-2 border-blue-200"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever plan</p>
        </div>

        {/* Features Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <FiTarget className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Study Plans</h3>
            <p className="text-gray-600 leading-relaxed">
              Get personalized daily schedules tailored to your subjects, exam dates, and learning pace.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-purple-100">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <FiClock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Focus Timer</h3>
            <p className="text-gray-600 leading-relaxed">
              Pomodoro and Deep Focus modes with smart breaks to maximize your productivity.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-pink-100">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <FiTrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
            <p className="text-gray-600 leading-relaxed">
              Track your progress with beautiful charts showing study hours, completion rates, and more.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-orange-100">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Doubt Solver</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant answers with step-by-step explanations powered by advanced AI.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-green-100">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Notes</h3>
            <p className="text-gray-600 leading-relaxed">
              Organize your study notes with tags, search, and pinning for quick access.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-yellow-100">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <FiAward className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Gamification</h3>
            <p className="text-gray-600 leading-relaxed">
              Earn XP, unlock achievements, and level up as you complete your study goals.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl my-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white px-8">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Study Plans Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Hours Studied</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Loved by Students Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "StudyAI helped me crack JEE with an AIR under 500! The AI study plans were spot on."
              </p>
              <div className="font-semibold text-gray-900">- Rahul S.</div>
              <div className="text-sm text-gray-500">JEE Rank 487</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The focus timer and analytics changed how I study. Got 1450 on SAT!"
              </p>
              <div className="font-semibold text-gray-900">- Priya M.</div>
              <div className="text-sm text-gray-500">SAT 1450/1600</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Best study app ever! The doubt solver saved me so much time during board prep."
              </p>
              <div className="font-semibold text-gray-900">- Aditya K.</div>
              <div className="text-sm text-gray-500">CBSE 12th - 98%</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Study Routine?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students using AI to ace their exams.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl hover:shadow-2xl transition transform hover:scale-105"
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🎓</div>
                <h3 className="text-xl font-bold">StudyAI</h3>
              </div>
              <p className="text-gray-400">
                AI-powered study companion for competitive exam success.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 StudyAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
