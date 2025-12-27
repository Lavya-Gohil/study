'use client'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  totalDays: number
}

export default function StreakDisplay({
  currentStreak,
  longestStreak,
  totalDays,
}: StreakDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Streak</h3>
        <span className="text-3xl">🔥</span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-5xl font-bold mb-1">{currentStreak}</div>
          <div className="text-orange-100">days in a row</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-300">
          <div>
            <div className="text-2xl font-bold">{longestStreak}</div>
            <div className="text-sm text-orange-100">Longest Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalDays}</div>
            <div className="text-sm text-orange-100">Total Days</div>
          </div>
        </div>
      </div>

      {currentStreak > 0 && (
        <div className="mt-4 p-3 bg-white/20 rounded-lg text-center text-sm">
          {currentStreak >= 7
            ? '🎉 Amazing! Keep it up!'
            : `${7 - currentStreak} more days to unlock a reward!`}
        </div>
      )}
    </div>
  )
}
