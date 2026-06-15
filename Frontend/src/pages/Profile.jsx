import { useState, useEffect } from 'react'
import { useAuthStore, GOALS } from '../store'
import { updateMe, orderAnalytics } from '../api'
import { CheckCircle, ShoppingBag, Flame, TrendingUp, Award, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Profile() {
  const { user, updateGoal } = useAuthStore()
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    orderAnalytics()
      .then(r => setAnalytics(r.data))
      .catch(() => {})
      .finally(() => setLoadingStats(false))
  }, [])

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100">My Profile</h1>

      {/* User card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#E23744] to-[#FF6B6B] rounded-2xl flex items-center justify-center text-2xl text-white font-black shadow-lg shadow-red-500/20">
            {user?.full_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-extrabold text-lg text-gray-900 dark:text-zinc-100">{user?.full_name}</p>
            <p className="text-gray-400 dark:text-zinc-500 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* ── Order Analytics ────────────────────────────────────── */}
      {!loadingStats && analytics && analytics.total_orders > 0 && (
        <div className="space-y-5 animate-slide-up">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <ShoppingBag size={18} className="text-[#E23744]" />, label: 'Total Orders',    val: analytics.total_orders },
              { icon: <TrendingUp size={18} className="text-green-500" />,  label: 'Total Spent',     val: `₹${analytics.total_spent}` },
              { icon: <Flame size={18} className="text-orange-500" />,     label: 'Total Calories',  val: analytics.total_calories.toLocaleString() },
              { icon: <BarChart3 size={18} className="text-blue-500" />,   label: 'Avg Cal / Order', val: analytics.avg_calories },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-4 text-center transition-colors duration-300">
                <div className="flex justify-center mb-2">{s.icon}</div>
                <div className="text-xl font-extrabold text-gray-900 dark:text-zinc-100">{s.val}</div>
                <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold mt-1 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Calorie history chart */}
          {analytics.calorie_history?.length > 1 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-5 transition-colors duration-300">
              <h3 className="text-sm font-bold text-gray-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                <Flame size={16} className="text-orange-500" /> Calorie History
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.calorie_history} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-10" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#999' }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#999' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(v, name) => [name === 'calories' ? `${v} cal` : `₹${v}`, name === 'calories' ? 'Calories' : 'Price']}
                  />
                  <Bar dataKey="calories" fill="#E23744" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top ordered items */}
          {analytics.top_items?.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-5 transition-colors duration-300">
              <h3 className="text-sm font-bold text-gray-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                <Award size={16} className="text-amber-500" /> Your Most Ordered
              </h3>
              <div className="space-y-2.5">
                {analytics.top_items.map((item, i) => {
                  const maxCount = analytics.top_items[0]?.count || 1
                  const pct = Math.round((item.count / maxCount) * 100)
                  return (
                    <div key={item.item_name} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#E23744]/10 text-[#E23744] text-[10px] font-black flex items-center justify-center shrink-0">
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-gray-800 dark:text-zinc-200 truncate">{item.item_name}</span>
                          <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 shrink-0 ml-2">{item.count}×</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#E23744] to-[#FF6B6B] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {loadingStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse bg-gray-100 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {/* ── Goal selector ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-6 transition-colors duration-300">
        <h2 className="font-bold text-gray-900 dark:text-zinc-100 mb-1">Nutrition Goal</h2>
        <p className="text-sm text-gray-400 dark:text-zinc-500 mb-5">Your cart warnings are based on this goal.</p>

        <div className="space-y-3">
          {Object.entries(GOALS).map(([key, g]) => (
            <button key={key} onClick={() => handleGoal(key)} disabled={loading}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all
                ${user?.goal === key
                  ? 'border-[#E23744] bg-red-50 dark:bg-red-950/20 shadow-md shadow-red-500/5'
                  : 'border-gray-100 dark:border-zinc-800/80 hover:border-[#E23744]/50 dark:hover:border-[#E23744]/40 bg-white dark:bg-zinc-900'}`}>
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
          <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold animate-fade-in">
            <CheckCircle size={15} /> Goal updated!
          </div>
        )}
      </div>
    </div>
  )
}