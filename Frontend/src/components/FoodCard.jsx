import { Plus, Flame, Dumbbell, Wheat, Droplets } from 'lucide-react'
import { useCartStore } from '../store'

const EMOJIS = { Pizza:'🍕', Burger:'🍔', Pasta:'🍝', Sandwich:'🥪', Drinks:'🥤', Snacks:'🍟' }
const BG_CLASSES = {
  Pizza: 'bg-[#FFF0E6] dark:bg-orange-950/35',
  Burger: 'bg-[#E8F5E9] dark:bg-green-950/35',
  Pasta: 'bg-[#FFF8E1] dark:bg-amber-950/35',
  Sandwich: 'bg-[#F3E5F5] dark:bg-purple-950/35',
  Drinks: 'bg-[#E3F2FD] dark:bg-blue-950/35',
  Snacks: 'bg-[#FCE4EC] dark:bg-pink-950/35'
}

export default function FoodCard({ item }) {
  const addItem = useCartStore(s => s.addItem)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 overflow-hidden hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/30 transition-all duration-200">
      {/* Image */}
      <div className={`h-28 flex items-center justify-center text-5xl transition-colors duration-300 ${BG_CLASSES[item.category] || 'bg-[#F5F5F5] dark:bg-zinc-800'}`}>
        {EMOJIS[item.category] || '🍽️'}
      </div>

      <div className="p-3.5">
        {/* Veg badge */}
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2 inline-block
          ${item.is_veg ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>
          {item.is_veg ? '● Veg' : '● Non-veg'}
        </span>

        <h3 className="font-bold text-sm text-gray-900 dark:text-zinc-100 leading-tight">{item.item_name}</h3>
        <p className="text-xs text-gray-400 dark:text-zinc-400 mt-1 mb-3 leading-relaxed line-clamp-2">{item.description}</p>

        {/* Nutrition grid */}
        <div className="grid grid-cols-4 gap-1 bg-gray-50 dark:bg-zinc-950 rounded-xl p-2 mb-3">
          {[
            { icon: <Flame size={10} className="text-red-500" />,    val: item.calories,         unit: 'cal'  },
            { icon: <Dumbbell size={10} className="text-blue-500" />, val: `${item.protein}g`,   unit: 'prot' },
            { icon: <Wheat size={10} className="text-yellow-500" />,  val: `${item.carbs}g`,     unit: 'carbs' },
            { icon: <Droplets size={10} className="text-pink-400" />, val: `${item.fat}g`,       unit: 'fat'  },
          ].map((n, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-0.5">{n.icon}</div>
              <div className="text-[11px] font-bold text-gray-800 dark:text-zinc-200">{n.val}</div>
              <div className="text-[9px] text-gray-400 dark:text-zinc-500">{n.unit}</div>
            </div>
          ))}
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <span className="text-base font-extrabold text-[#E23744]">₹{item.price}</span>
          <button onClick={() => addItem({
            item_id: item.item_id, item_name: item.item_name,
            price: item.price, calories: item.calories,
            protein: item.protein, carbs: item.carbs, fat: item.fat, is_veg: item.is_veg
          })}
            className="flex items-center gap-1 bg-[#E23744] text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-[#C0303B] transition-colors">
            <Plus size={13} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}