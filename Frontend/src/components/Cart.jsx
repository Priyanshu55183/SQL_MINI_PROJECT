import { Trash2, Flame, AlertTriangle, CheckCircle, ShoppingBag } from 'lucide-react'
import { useCartStore, useAuthStore, GOALS } from '../store'
import { placeOrder } from '../api'
import { useState } from 'react'
import { useToast } from './Toast'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const { items, removeItem, updateQty, clearCart } = useCartStore()
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const toast = useToast()
  const [success, setSuccess] = useState(false)

  const totalPrice   = items.reduce((s, i) => s + i.price * i.qty, 0)
  const totalCal     = items.reduce((s, i) => s + i.calories * i.qty, 0)
  const totalProtein = items.reduce((s, i) => s + i.protein * i.qty, 0)
  const totalCarbs   = items.reduce((s, i) => s + i.carbs * i.qty, 0)
  const totalFat     = items.reduce((s, i) => s + i.fat * i.qty, 0)

  const goal      = GOALS[user?.goal || 'balanced']
  const calPct    = Math.min(Math.round((totalCal / goal.cal) * 100), 100)
  const isOverCal = totalCal > goal.cal
  const isHighFat = totalFat > goal.fat
  const isLowProt = user?.goal === 'muscle_gain' && totalProtein < 20

  const handleOrder = async () => {
    if (!user) { navigate('/login'); return }
    setPlacing(true)
    try {
      await placeOrder({
        items: items.map(i => ({
          item_id: i.item_id, item_name: i.item_name,
          quantity: i.qty, unit_price: i.price, calories: i.calories,
        })),
        total_price: totalPrice,
        total_cal: totalCal,
      })
      clearCart()
      setSuccess(true)
      setTimeout(() => { setSuccess(false); navigate('/orders') }, 2000)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Order failed. Try again.';
      toast.error(msg);
    }
    finally { setPlacing(false) }
  }

  if (success) return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-8 text-center transition-colors duration-300">
      <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
      <p className="font-bold text-gray-800 dark:text-zinc-200">Order placed!</p>
      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Redirecting to your orders…</p>
    </div>
  )

  if (items.length === 0) return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-8 text-center transition-colors duration-300">
      <ShoppingBag size={36} className="text-gray-200 dark:text-zinc-800 mx-auto mb-3" />
      <p className="font-bold text-gray-450 dark:text-zinc-400 text-sm">Cart is empty</p>
      <p className="text-xs text-gray-300 dark:text-zinc-500 mt-1">Add items from the menu</p>
    </div>
  )

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="bg-[#E23744] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">
          🛒 Cart ({items.length} item{items.length > 1 ? 's' : ''})
        </span>
        <button onClick={clearCart} className="text-white/70 hover:text-white text-xs font-semibold">Clear all</button>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50 dark:divide-zinc-800/40">
        {items.map(item => (
          <div key={item.item_id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-gray-900 dark:text-zinc-200 truncate">{item.item_name}</p>
              <p className="text-[10px] text-gray-450 dark:text-zinc-500">₹{item.price} · {item.calories * item.qty} cal</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => updateQty(item.item_id, item.qty - 1)}
                className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-bold flex items-center justify-center text-gray-800 dark:text-zinc-200">
                −
              </button>
              <span className="text-xs font-bold w-4 text-center text-gray-800 dark:text-zinc-200">{item.qty}</span>
              <button onClick={() => updateQty(item.item_id, item.qty + 1)}
                className="w-6 h-6 rounded-lg bg-[#E23744] text-white hover:bg-[#C0303B] text-xs font-bold flex items-center justify-center">
                +
              </button>
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 w-10 text-right">₹{item.price * item.qty}</span>
            <button onClick={() => removeItem(item.item_id)} className="text-gray-300 dark:text-zinc-700 hover:text-[#E23744] dark:hover:text-[#E23744]">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Nutrition summary */}
      <div className="mx-4 my-3 bg-gray-50 dark:bg-zinc-950/80 rounded-xl p-3">
        <div className="flex justify-between text-[10px] text-gray-400 dark:text-zinc-500 mb-2">
          <span className="font-bold uppercase tracking-wide">Cart nutrition</span>
          <span className="font-semibold">Goal: {goal.label}</span>
        </div>

        {/* Calorie bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1 font-bold text-gray-600 dark:text-zinc-300">
              <Flame size={11} className="text-orange-500" /> {totalCal} cal
            </span>
            <span className="text-gray-400 dark:text-zinc-500">/ {goal.cal}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${isOverCal ? 'bg-red-500' : 'bg-green-500'}`}
                 style={{ width: `${calPct}%` }} />
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {[
            { label: 'Protein', val: Math.round(totalProtein), unit: 'g', goal: goal.protein, color: 'text-blue-500' },
            { label: 'Carbs',   val: Math.round(totalCarbs),   unit: 'g', goal: goal.carbs,   color: 'text-yellow-500' },
            { label: 'Fat',     val: Math.round(totalFat),     unit: 'g', goal: goal.fat,     color: 'text-pink-500' },
          ].map(m => (
            <div key={m.label} className="bg-white dark:bg-zinc-900 rounded-lg p-1.5 text-center border border-gray-100/30 dark:border-zinc-800/20">
              <div className={`text-xs font-extrabold ${m.color}`}>{m.val}{m.unit}</div>
              <div className="text-[9px] text-gray-400 dark:text-zinc-500">{m.label} / {m.goal}{m.unit}</div>
            </div>
          ))}
        </div>

        {/* Warnings */}
        {(isOverCal || isHighFat || isLowProt) && (
          <div className="space-y-1">
            {isOverCal && <Warn text={`${totalCal - goal.cal} cal over your ${goal.label} goal`} />}
            {isHighFat  && <Warn text="High fat — consider a lighter option" />}
            {isLowProt  && <Warn text="Low protein for muscle gain — add a protein dish" />}
          </div>
        )}
      </div>

      {/* Total + order */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-gray-600 dark:text-zinc-400">Total</span>
          <span className="text-lg font-extrabold text-[#E23744]">₹{totalPrice}</span>
        </div>
        <button onClick={handleOrder} disabled={placing}
          className="w-full bg-[#E23744] hover:bg-[#C0303B] text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 shadow-md">
          {placing ? 'Placing order…' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}

function Warn({ text }) {
  return (
    <div className="flex items-start gap-1.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/50 rounded-lg px-2.5 py-2">
      <AlertTriangle size={12} className="text-orange-500 mt-0.5 shrink-0" />
      <p className="text-[10px] text-orange-700 dark:text-orange-400 font-semibold">{text}</p>
    </div>
  )
}