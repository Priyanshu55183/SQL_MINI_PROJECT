import { useEffect, useState } from 'react'
import { getMenu } from '../api'
import FoodCard from '../components/FoodCard'
import Cart from '../components/Cart'
import { Search } from 'lucide-react'

const CATS = ['All', 'Pizza', 'Burger', 'Pasta', 'Sandwich', 'Drinks', 'Snacks']

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
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100 mb-5">Our Menu</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E23744] dark:focus:border-[#E23744] bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 transition-colors" />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${cat === c
                    ? 'bg-[#E23744] text-white border-[#E23744]'
                    : 'border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-[#E23744] hover:text-[#E23744]'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl h-64 animate-pulse bg-gray-100 dark:bg-zinc-800" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-gray-400 dark:text-zinc-500 text-sm font-semibold">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map(item => <FoodCard key={item.item_id} item={item} />)}
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