import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ── Nutrition goals per user goal type ──────────────────────────
export const GOALS = {
  balanced:     { label: 'Balanced',     cal: 2000, protein: 50, carbs: 250, fat: 65 },
  weight_loss:  { label: 'Weight Loss',  cal: 1500, protein: 60, carbs: 150, fat: 50 },
  muscle_gain:  { label: 'Muscle Gain',  cal: 2500, protein: 120, carbs: 300, fat: 70 },
}

// ── Helper: get the current cart storage key for a user ─────────
const cartKeyFor = (userId) => `bitebyte-cart-${userId ?? 'guest'}`

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
  { name: 'bitebyte-cart-guest' }   // default key; switched on login/logout
))

// ── Switch cart to a different user's namespace ─────────────────
// Saves current cart, then loads the target user's cart from localStorage
function switchCartUser(userId) {
  const store = useCartStore
  const currentName = store.persist.getOptions().name

  // 1. Persist current items under the OLD key (already done automatically by zustand)
  //    We just need to rehydrate from the NEW key.

  const newName = cartKeyFor(userId)
  if (currentName === newName) return  // already on correct namespace

  // 2. Update the persist options to use the new key
  store.persist.setOptions({ name: newName })

  // 3. Try to load existing cart from the new key
  const saved = localStorage.getItem(newName)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      const items = parsed?.state?.items ?? []
      store.setState({ items })
    } catch {
      store.setState({ items: [] })
    }
  } else {
    // No saved cart for this user — start fresh
    store.setState({ items: [] })
  }

  // 4. Force a persist so the new key is written to localStorage
  store.persist.rehydrate()
}

// ── Auth store ──────────────────────────────────────────────────
export const useAuthStore = create(persist(
  (set) => ({
    user: null,   // { user_id, full_name, email, goal }
    token: null,

    setAuth: (user, token) => {
      localStorage.setItem('token', token)
      set({ user, token })
      // Switch cart to this user's namespace so they get their own cart
      switchCartUser(user.user_id)
    },

    logout: () => {
      localStorage.removeItem('token')
      // Clear current cart in memory & switch back to guest namespace
      useCartStore.getState().clearCart()
      set({ user: null, token: null })
      switchCartUser(null)
    },

    updateGoal: (goal) =>
      set(s => ({ user: s.user ? { ...s.user, goal } : null })),
  }),
  { name: 'bitebyte-auth' }
))

// ── On app start: if already logged in, switch cart to user's namespace ──
const initialUser = useAuthStore.getState().user
if (initialUser?.user_id) {
  switchCartUser(initialUser.user_id)
}