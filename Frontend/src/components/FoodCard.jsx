import { useState } from 'react'
import { Plus, Check, Flame, Dumbbell, Wheat, Droplets } from 'lucide-react'
import { useCartStore } from '../store'

// ── Curated high-quality food images from Unsplash ──────────────
const FOOD_IMAGES = {
  // Pizza
  'Margherita Pizza':  'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=480&h=320&fit=crop&q=80',
  'Pepperoni Pizza':   'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=480&h=320&fit=crop&q=80',
  'Veggie Supreme':    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=480&h=320&fit=crop&q=80',
  // Burger
  'Veg Burger':        'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=480&h=320&fit=crop&q=80',
  'Chicken Burger':    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=480&h=320&fit=crop&q=80',
  'Double Smash':      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=480&h=320&fit=crop&q=80',
  // Pasta
  'Penne Arrabbiata':  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=480&h=320&fit=crop&q=80',
  'White Sauce Pasta': 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=480&h=320&fit=crop&q=80',
  'Chicken Alfredo':   'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=480&h=320&fit=crop&q=80',
  // Sandwich
  'Club Sandwich':     'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=480&h=320&fit=crop&q=80',
  'Grilled Sandwich':  'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=480&h=320&fit=crop&q=80',
  'Chicken Wrap':      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=480&h=320&fit=crop&q=80',
  // Drinks
  'Cold Coffee':       'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=480&h=320&fit=crop&q=80',
  'Mango Shake':       'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=480&h=320&fit=crop&q=80',
  'Green Detox Juice': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=480&h=320&fit=crop&q=80',
  // Snacks
  'French Fries':      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=480&h=320&fit=crop&q=80',
  'Loaded Fries':      'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=480&h=320&fit=crop&q=80',
  'Protein Bowl':      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=320&fit=crop&q=80',
}

// Fallback images by category
const CATEGORY_FALLBACK = {
  Pizza:    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&h=320&fit=crop&q=80',
  Burger:   'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=480&h=320&fit=crop&q=80',
  Pasta:    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=480&h=320&fit=crop&q=80',
  Sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=480&h=320&fit=crop&q=80',
  Drinks:   'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=480&h=320&fit=crop&q=80',
  Snacks:   'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=480&h=320&fit=crop&q=80',
}

const ACCENT_COLORS = {
  Pizza:    { bg: 'from-orange-500/90 to-red-500/90',    ring: 'ring-orange-200 dark:ring-orange-900/40' },
  Burger:   { bg: 'from-amber-500/90 to-orange-600/90',  ring: 'ring-amber-200 dark:ring-amber-900/40' },
  Pasta:    { bg: 'from-yellow-500/90 to-amber-500/90',  ring: 'ring-yellow-200 dark:ring-yellow-900/40' },
  Sandwich: { bg: 'from-emerald-500/90 to-teal-500/90',  ring: 'ring-emerald-200 dark:ring-emerald-900/40' },
  Drinks:   { bg: 'from-cyan-500/90 to-blue-500/90',     ring: 'ring-cyan-200 dark:ring-cyan-900/40' },
  Snacks:   { bg: 'from-pink-500/90 to-rose-500/90',     ring: 'ring-pink-200 dark:ring-pink-900/40' },
}

export default function FoodCard({ item, index = 0 }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const imgUrl = FOOD_IMAGES[item.item_name] || CATEGORY_FALLBACK[item.category] || CATEGORY_FALLBACK.Snacks
  const accent = ACCENT_COLORS[item.category] || ACCENT_COLORS.Snacks

  const handleAdd = () => {
    addItem({
      item_id: item.item_id, item_name: item.item_name,
      price: item.price, calories: item.calories,
      protein: item.protein, carbs: item.carbs, fat: item.fat, is_veg: item.is_veg
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/60 overflow-hidden
                 hover:shadow-xl hover:shadow-black/8 dark:hover:shadow-black/40 hover:-translate-y-1.5
                 transition-all duration-300 ease-out animate-slide-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* ── Image Section ──────────────────────────────────── */}
      <div className="relative h-40 sm:h-44 overflow-hidden bg-gray-100 dark:bg-zinc-800">
        {/* Shimmer placeholder while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 animate-pulse" />
        )}

        <img
          src={imgUrl}
          alt={item.item_name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110
                      ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Veg / Non-veg badge — top left */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md
            ${item.is_veg
              ? 'bg-green-500/20 text-green-100 border border-green-400/30'
              : 'bg-red-500/20 text-red-100 border border-red-400/30'}`}>
            <span className={`w-2 h-2 rounded-sm border-2 flex items-center justify-center
              ${item.is_veg ? 'border-green-400' : 'border-red-400'}`}>
              <span className={`w-1 h-1 rounded-full ${item.is_veg ? 'bg-green-400' : 'bg-red-400'}`} />
            </span>
            {item.is_veg ? 'Veg' : 'Non-veg'}
          </span>
        </div>

        {/* Price badge — bottom left, floating over image */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="text-lg font-extrabold text-white drop-shadow-lg">
            ₹{item.price}
          </span>
        </div>

        {/* Calorie badge — top right */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-black/30 backdrop-blur-md text-white/90 border border-white/10">
            <Flame size={10} className="text-orange-400" />
            {item.calories} cal
          </span>
        </div>
      </div>

      {/* ── Content Section ─────────────────────────────────── */}
      <div className="p-3.5 pt-3">
        {/* Title */}
        <h3 className="font-bold text-sm text-gray-900 dark:text-zinc-100 leading-snug mb-0.5 truncate">
          {item.item_name}
        </h3>

        {/* Description */}
        <p className="text-[11px] text-gray-400 dark:text-zinc-500 leading-relaxed line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* ── Nutrition row ─────────────────────────────── */}
        <div className="flex items-center gap-1 mb-3">
          {[
            { icon: <Dumbbell size={10} />, val: `${item.protein}g`, label: 'P', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
            { icon: <Wheat size={10} />,    val: `${item.carbs}g`,   label: 'C', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
            { icon: <Droplets size={10} />, val: `${item.fat}g`,     label: 'F', color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/30' },
          ].map((n, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg ${n.color}`}
            >
              {n.icon} {n.val}
            </span>
          ))}
        </div>

        {/* ── Add to Cart button ─────────────────────────── */}
        <button
          onClick={handleAdd}
          disabled={added}
          className={`w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl transition-all duration-300
            ${added
              ? 'bg-green-500 text-white scale-[0.97]'
              : 'bg-[#E23744] hover:bg-[#C0303B] text-white hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.96]'
            }`}
        >
          {added ? (
            <>
              <Check size={14} className="animate-bounce" /> Added!
            </>
          ) : (
            <>
              <Plus size={14} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}