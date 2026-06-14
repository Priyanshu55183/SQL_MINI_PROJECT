import { useState } from 'react'
import { useAuthStore, GOALS } from '../store'
import { updateMe } from '../api'
import { CheckCircle } from 'lucide-react'

export default function Profile() {
  const { user, updateGoal } = useAuthStore()
  const [saved, setSaved]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGoal = async (goal) => {
    setLoading(true)
    try {
      await updateMe({ goal })
      updateGoal(goal)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100 mb-7">My Profile</h1>

      {/* User card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-6 mb-5 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-xl">👤</div>
          <div>
            <p className="font-extrabold text-gray-900 dark:text-zinc-100">{user?.full_name}</p>
            <p className="text-gray-400 dark:text-zinc-500 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Goal selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-6 transition-colors duration-300">
        <h2 className="font-bold text-gray-900 dark:text-zinc-100 mb-1">Nutrition Goal</h2>
        <p className="text-sm text-gray-400 dark:text-zinc-500 mb-5">Your cart warnings are based on this goal.</p>

        <div className="space-y-3">
          {Object.entries(GOALS).map(([key, g]) => (
            <button key={key} onClick={() => handleGoal(key)} disabled={loading}
              className={`w-full text-left p-4 rounded-xl border transition-all
                ${user?.goal === key
                  ? 'border-[#E23744] bg-red-50 dark:bg-red-950/20'
                  : 'border-gray-200 dark:border-zinc-800/80 hover:border-[#E23744]/50 dark:hover:border-[#E23744]/40 bg-white dark:bg-zinc-900'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-zinc-200 text-sm">{g.label}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 font-medium">
                    {g.cal} cal · {g.protein}g protein · {g.carbs}g carbs · {g.fat}g fat
                  </p>
                </div>
                {user?.goal === key && <CheckCircle size={18} className="text-[#E23744] shrink-0" />}
              </div>
            </button>
          ))}
        </div>

        {saved && (
          <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold">
            <CheckCircle size={15} /> Goal updated!
          </div>
        )}
      </div>
    </div>
  )
}