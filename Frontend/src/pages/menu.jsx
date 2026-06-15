import { useEffect, useState } from 'react'
import { getMenu } from '../api'
import FoodCard from '../components/FoodCard'
import Cart from '../components/Cart'
import { Search, UtensilsCrossed } from 'lucide-react'

const CATS = [
  { key: 'All',      label: 'All',       emoji: '🍽️' },
  { key: 'Pizza',    label: 'Pizza',     emoji: '🍕' },
  { key: 'Burger',   label: 'Burger',    emoji: '🍔' },
  { key: 'Pasta',    label: 'Pasta',     emoji: '🍝' },
  { key: 'Sandwich', label: 'Sandwich',  emoji: '🥪' },
  { key: 'Drinks',   label: 'Drinks',    emoji: '🥤' },
  { key: 'Snacks',   label: 'Snacks',    emoji: '🍟' },
]

export default function Menu() {
  const [items, setItems]     = useState([])
  const [cat, setCat]         = useState('All')
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMenu().then(r => { setItems(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = items.filter(i =>
    (cat === 'All' || i.category === cat) &&
    i.item_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-4 py-7">
      <div className="flex flex-col lg:flex-row gap-7">
        {/* Left — menu */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#E23744]/10 dark:bg-[#E23744]/20 flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-[#E23744]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">Our Menu</h1>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                {items.length} dishes • Fresh & delicious
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="w-full border border-gray-200 dark:border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#E23744]/20 focus:border-[#E23744] dark:focus:border-[#E23744]
                         bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100
                         shadow-sm shadow-black/[0.02] dark:shadow-black/[0.1]
                         transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-zinc-600" />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-7">
            {CATS.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold border transition-all duration-200
                  ${cat === c.key
                    ? 'bg-[#E23744] text-white border-[#E23744] shadow-md shadow-red-500/20 scale-[1.03]'
                    : 'border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-[#E23744]/50 hover:text-[#E23744] hover:bg-red-50/50 dark:hover:bg-red-950/10'}`}>
                <span className="text-sm">{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="h-40 sm:h-44 bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                  <div className="p-3.5 space-y-2 bg-white dark:bg-zinc-900">
                    <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded-full w-3/4 animate-pulse" />
                    <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full w-1/2 animate-pulse" />
                    <div className="flex gap-1 mt-2">
                      <div className="h-5 w-12 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                      <div className="h-5 w-12 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                      <div className="h-5 w-12 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-9 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4 animate-float">🍽️</p>
              <p className="text-gray-500 dark:text-zinc-400 text-sm font-bold mb-1">No dishes found</p>
              <p className="text-gray-300 dark:text-zinc-600 text-xs">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {filtered.map((item, index) => <FoodCard key={item.item_id} item={item} index={index} />)}
            </div>
          )}
        </div>

        {/* Right — sticky cart */}
        <div className="lg:w-72 xl:w-80">
          <div className="sticky top-20">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  )
}