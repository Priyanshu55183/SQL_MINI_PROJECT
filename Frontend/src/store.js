import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Nutrition goals per user goal type ──────────────────────────
export const GOALS = {
  balanced:     { label: 'Balanced',     cal: 2000, protein: 50, carbs: 250, fat: 65 },
  weight_loss:  { label: 'Weight Loss',  cal: 1500, protein: 60, carbs: 150, fat: 50 },
  muscle_gain:  { label: 'Muscle Gain',  cal: 2500, protein: 120, carbs: 300, fat: 70 },
}

// ── Cart store ──────────────────────────────────────────────────
export const useCartStore = create(persist(
  (set, get) => ({
    items: [],   // [{ item_id, item_name, price, qty, calories, protein, carbs, fat, is_veg }]

    addItem: (item) => {
      const existing = get().items.find(i => i.item_id === item.item_id)
      if (existing) {
        set(s => ({ items: s.items.map(i =>
          i.item_id === item.item_id ? { ...i, qty: i.qty + 1 } : i
        )}))
      } else {
        set(s => ({ items: [...s.items, { ...item, qty: 1 }] }))
      }
    },

    removeItem: (item_id) =>
      set(s => ({ items: s.items.filter(i => i.item_id !== item_id) })),

    updateQty: (item_id, qty) => {
      if (qty < 1) { get().removeItem(item_id); return }
      set(s => ({ items: s.items.map(i =>
        i.item_id === item_id ? { ...i, qty } : i
      )}))
    },

    clearCart: () => set({ items: [] }),

    // Derived totals
    get totalPrice() { return get().items.reduce((s, i) => s + i.price * i.qty, 0) },
    get totalCal()   { return get().items.reduce((s, i) => s + i.calories * i.qty, 0) },
    get totalProtein(){ return get().items.reduce((s, i) => s + i.protein * i.qty, 0) },
    get totalCarbs() { return get().items.reduce((s, i) => s + i.carbs * i.qty, 0) },
    get totalFat()   { return get().items.reduce((s, i) => s + i.fat * i.qty, 0) },
  }),
  { name: 'bitebyte-cart' }
))

// ── Auth store ──────────────────────────────────────────────────
export const useAuthStore = create(persist(
  (set) => ({
    user: null,   // { user_id, full_name, email, goal }
    token: null,

    setAuth: (user, token) => {
      localStorage.setItem('token', token)
      set({ user, token })
    },

    logout: () => {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    },

    updateGoal: (goal) =>
      set(s => ({ user: s.user ? { ...s.user, goal } : null })),
  }),
  { name: 'bitebyte-auth' }
))