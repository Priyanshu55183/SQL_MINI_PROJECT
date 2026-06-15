import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Flame, Dumbbell, PieChart, Plus, Trash2,
  AlertTriangle, Check, Sparkles, ShieldCheck, Zap,
  TrendingUp, Star, ChevronRight, Heart, Clock, Users
} from 'lucide-react'

// ── Demo data ───────────────────────────────────────────────────
const DEMO_DISHES = [
  { id: 'd1', name: 'Avocado Toast',           calories: 280, protein: 10, carbs: 24, fat: 16, category: 'Healthy',  img: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=200&fit=crop&q=80' },
  { id: 'd2', name: 'Double Cheese Burger',     calories: 590, protein: 32, carbs: 40, fat: 28, category: 'Comfort',  img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&h=200&fit=crop&q=80' },
  { id: 'd3', name: 'Strawberry Protein Shake', calories: 220, protein: 26, carbs: 12, fat: 4,  category: 'Fitness',  img: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=200&h=200&fit=crop&q=80' },
]

const DEMO_GOALS = {
  balanced:    { label: 'Balanced Diet', cal: 2000, protein: 50, carbs: 250, fat: 65, emoji: '⚖️' },
  weight_loss: { label: 'Weight Loss',  cal: 1500, protein: 65, carbs: 140, fat: 45, emoji: '🏃' },
  muscle_gain: { label: 'Muscle Gain',  cal: 2500, protein: 130, carbs: 300, fat: 75, emoji: '💪' },
}

const HERO_FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop&q=80',
]

const POPULAR_DISHES = [
  { name: 'Margherita Pizza',  cal: 266,  price: 249, img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&h=200&fit=crop&q=80', tag: 'Bestseller' },
  { name: 'Chicken Burger',    cal: 490,  price: 199, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop&q=80', tag: 'Popular' },
  { name: 'Penne Arrabbiata',  cal: 380,  price: 229, img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=200&fit=crop&q=80', tag: 'Healthy' },
  { name: 'Protein Bowl',      cal: 320,  price: 199, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop&q=80', tag: 'Fit Pick' },
]

const STATS = [
  { value: '18+', label: 'Dishes', icon: <Heart size={16} /> },
  { value: '6',   label: 'Categories', icon: <Star size={16} /> },
  { value: '100%', label: 'Nutrition Data', icon: <ShieldCheck size={16} /> },
  { value: '24/7', label: 'Available', icon: <Clock size={16} /> },
]

// ── Animated counter hook ───────────────────────────────────────
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

// ── Scroll-triggered visibility hook ────────────────────────────
function useInView(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return visible
}

export default function Home() {
  const [demoGoal, setDemoGoal] = useState('weight_loss')
  const [demoCart, setDemoCart] = useState([
    { id: 'd1', name: 'Avocado Toast', calories: 280, protein: 10, carbs: 24, fat: 16, qty: 1 }
  ])
  const [heroImg, setHeroImg] = useState(0)

  // Rotate hero images
  useEffect(() => {
    const t = setInterval(() => setHeroImg(i => (i + 1) % HERO_FOOD_IMAGES.length), 4000)
    return () => clearInterval(t)
  }, [])

  // Section refs for scroll animations
  const demoRef   = { current: null }
  const featureRef = { current: null }
  const popularRef = { current: null }

  // Demo cart logic
  const totalCal     = demoCart.reduce((s, i) => s + i.calories * i.qty, 0)
  const totalProtein = demoCart.reduce((s, i) => s + i.protein * i.qty, 0)
  const totalCarbs   = demoCart.reduce((s, i) => s + i.carbs * i.qty, 0)
  const totalFat     = demoCart.reduce((s, i) => s + i.fat * i.qty, 0)

  const goalLimit = DEMO_GOALS[demoGoal]
  const calPct    = Math.min(Math.round((totalCal / goalLimit.cal) * 100), 100)
  const isOverCal = totalCal > goalLimit.cal
  const isHighFat = totalFat > goalLimit.fat
  const isLowProt = demoGoal === 'muscle_gain' && totalProtein < 35

  const addDemoItem = (dish) => {
    setDemoCart(prev => {
      const existing = prev.find(i => i.id === dish.id)
      if (existing) return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...dish, qty: 1 }]
    })
  }
  const removeDemoItem = (id) => setDemoCart(prev => prev.filter(i => i.id !== id))
  const updateDemoQty = (id, q) => {
    if (q < 1) { removeDemoItem(id); return }
    setDemoCart(prev => prev.map(i => i.id === id ? { ...i, qty: q } : i))
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden transition-colors duration-300">

      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND DECORATIVE ELEMENTS
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E23744]/8 dark:bg-[#E23744]/5 rounded-full filter blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[500px] right-1/4 w-[500px] h-[500px] bg-blue-500/6 dark:bg-blue-500/3 rounded-full filter blur-[120px] animate-pulse-slow animation-delay-400" />
        <div className="absolute top-[1200px] left-1/3 w-[400px] h-[400px] bg-amber-500/6 dark:bg-amber-500/3 rounded-full filter blur-[100px] animate-pulse-slow animation-delay-600" />
      </div>


      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-[92vw] 2xl:max-w-[1536px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-14">

        {/* ── Left text column ─────────────────────────────────── */}
        <div className="flex-1 text-center lg:text-left animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-[#E23744]/15 rounded-full px-5 py-2 text-xs font-bold text-[#E23744] mb-7 shadow-sm">
            <Flame size={14} className="text-[#E23744] animate-pulse" />
            India's First Nutrition-Aware Ordering App
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.08] tracking-tight mb-7">
            <span className="text-gray-900 dark:text-zinc-100">Order Food.</span><br />
            <span className="bg-gradient-to-r from-[#E23744] to-[#FF6B6B] bg-clip-text text-transparent">Track Nutrition.</span><br />
            <span className="text-gray-900 dark:text-zinc-100">Eat Smart.</span>
          </h1>

          <p className="text-gray-500 dark:text-zinc-400 text-base md:text-lg mb-9 max-w-xl leading-relaxed mx-auto lg:mx-0">
            Every dish shows <span className="text-gray-700 dark:text-zinc-300 font-semibold">calories, protein, carbs & fat</span>. 
            Our intelligent cart monitors your macros and warns you before you overeat.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap justify-center lg:justify-start mb-12">
            <Link to="/menu"
              className="group flex items-center gap-2 bg-gradient-to-r from-[#E23744] to-[#D42E3F] hover:from-[#C0303B] hover:to-[#B22835]
                         text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-red-500/20 hover:shadow-red-500/30
                         transition-all duration-300 text-sm hover:scale-[1.03] active:scale-[0.97]">
              Explore Menu
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/register"
              className="flex items-center gap-2 border-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200
                         font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-900 hover:border-gray-300
                         dark:hover:border-zinc-700 transition-all duration-200 text-sm">
              Create Account
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 justify-center lg:justify-start flex-wrap">
            {STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800/80 flex items-center justify-center text-[#E23744]">
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 leading-none">{s.value}</p>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right hero image ─────────────────────────────────── */}
        <div className="flex-1 flex justify-center items-center select-none relative">
          <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px]">

            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E23744]/20 dark:border-[#E23744]/10 animate-spin" style={{ animationDuration: '30s' }} />

            {/* Main circular image */}
            <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl shadow-black/15 dark:shadow-black/50 border-4 border-white dark:border-zinc-800">
              {HERO_FOOD_IMAGES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Delicious food"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
                    ${heroImg === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                />
              ))}
            </div>

            {/* Floating cards */}
            <div className="absolute -top-2 -right-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-3 shadow-xl shadow-black/8 dark:shadow-black/30 z-20 animate-float animation-delay-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
                  <Check size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Status</p>
                  <p className="text-xs font-extrabold text-green-500">Within Goal</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-3 -left-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-3.5 shadow-xl shadow-black/8 dark:shadow-black/30 z-20 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center">
                  <Flame size={16} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Daily Intake</p>
                  <p className="text-xs font-extrabold text-gray-900 dark:text-zinc-100">1,280 / 1,500 cal</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-zinc-800/80 px-3.5 py-2.5 shadow-xl shadow-black/8 dark:shadow-black/30 z-20 animate-float animation-delay-400">
              <div className="flex items-center gap-2">
                <Dumbbell size={14} className="text-blue-500" />
                <span className="text-xs font-extrabold text-gray-900 dark:text-zinc-100">48g</span>
                <span className="text-[10px] text-gray-400">protein</span>
              </div>
            </div>

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E23744]/15 dark:bg-[#E23744]/8 rounded-full filter blur-[60px] -z-10" />
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          POPULAR DISHES CAROUSEL
          ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#E23744] uppercase tracking-widest mb-1.5">🔥 Trending Now</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-zinc-100">Popular Dishes</h2>
          </div>
          <Link to="/menu" className="group hidden sm:flex items-center gap-1 text-sm font-bold text-[#E23744] hover:underline">
            View all <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {POPULAR_DISHES.map((dish, i) => (
            <Link key={i} to="/menu"
              className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/60
                         overflow-hidden hover:shadow-xl hover:shadow-black/8 dark:hover:shadow-black/40 hover:-translate-y-1.5
                         transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Image */}
              <div className="relative h-32 sm:h-36 overflow-hidden">
                <img src={dish.img} alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Tag */}
                <span className="absolute top-2.5 left-2.5 text-[9px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-[#E23744] border border-white/20">
                  {dish.tag}
                </span>

                {/* Calorie badge */}
                <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-black/30 backdrop-blur-md text-white/90 border border-white/10">
                  <Flame size={9} className="text-orange-400" /> {dish.cal} cal
                </span>
              </div>

              {/* Info */}
              <div className="p-3.5">
                <h3 className="font-bold text-sm text-gray-900 dark:text-zinc-100 truncate">{dish.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base font-extrabold text-[#E23744]">₹{dish.price}</span>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" /> 4.5
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          INTERACTIVE DEMO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 py-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E23744] uppercase tracking-widest mb-3">
            <Zap size={14} /> Interactive Demo
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-zinc-100 mb-3">
            See the Magic in Action
          </h2>
          <p className="text-gray-400 dark:text-zinc-500 text-sm leading-relaxed">
            Our smart cart analyzes your meal in real-time. Toggle goals and add dishes to see how nutrition alerts work.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">

          {/* ── Left Panel: Goals & Dishes ────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Goal Selector */}
            <div className="bg-white dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5 md:p-6">
              <h3 className="text-xs font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E23744] text-white text-[10px] font-black flex items-center justify-center">1</span>
                Choose Your Fitness Goal
              </h3>

              <div className="grid sm:grid-cols-3 gap-3">
                {Object.entries(DEMO_GOALS).map(([key, g]) => (
                  <button
                    key={key}
                    onClick={() => setDemoGoal(key)}
                    className={`relative flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200
                      ${demoGoal === key
                        ? 'border-[#E23744] bg-gradient-to-br from-red-50 to-orange-50/50 dark:from-red-950/30 dark:to-orange-950/10 shadow-md shadow-red-500/10'
                        : 'border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/50'}`}
                  >
                    <span className="text-xl mb-2">{g.emoji}</span>
                    <span className={`font-bold text-sm ${demoGoal === key ? 'text-[#E23744]' : 'text-gray-700 dark:text-zinc-300'}`}>
                      {g.label}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">
                      Target: {g.cal} cal / day
                    </span>
                    {demoGoal === key && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#E23744] flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Dishes */}
            <div className="bg-white dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5 md:p-6">
              <h3 className="text-xs font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E23744] text-white text-[10px] font-black flex items-center justify-center">2</span>
                Add Dishes to Cart
              </h3>

              <div className="grid sm:grid-cols-3 gap-3">
                {DEMO_DISHES.map(dish => (
                  <div key={dish.id}
                    className="group bg-gray-50 dark:bg-zinc-950/60 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden
                               hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    {/* Image */}
                    <div className="relative h-24 overflow-hidden">
                      <img src={dish.img} alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <span className="absolute top-2 left-2 text-[8px] uppercase font-extrabold tracking-wider bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-gray-500 dark:text-zinc-400">
                        {dish.category}
                      </span>
                    </div>

                    <div className="p-3">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-zinc-200 leading-tight truncate">{dish.name}</h4>
                      <div className="flex items-center gap-2 mt-1 mb-2.5">
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                          {dish.calories} cal
                        </span>
                        <span className="text-[10px] text-blue-500 font-medium">
                          {dish.protein}g protein
                        </span>
                      </div>
                      <button
                        onClick={() => addDemoItem(dish)}
                        className="w-full flex items-center justify-center gap-1 bg-[#E23744] hover:bg-[#C0303B] text-white text-[11px] font-bold py-2 rounded-xl transition-all hover:shadow-md active:scale-[0.96]"
                      >
                        <Plus size={12} /> Add to Demo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Panel: Live Demo Cart ───────────────────── */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="bg-white dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-lg shadow-black/[0.03] dark:shadow-black/20">
              {/* Cart Header */}
              <div className="bg-gradient-to-r from-[#E23744] to-[#D42E3F] px-5 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-sm flex items-center gap-2">
                    🛒 Live Demo Cart
                    {demoCart.length > 0 && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                        {demoCart.reduce((s, i) => s + i.qty, 0)} items
                      </span>
                    )}
                  </span>
                  <button onClick={() => setDemoCart([])}
                    className="text-white/60 hover:text-white text-[10px] font-bold transition-colors">
                    Clear all
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Cart Items */}
                {demoCart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2">🛒</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Add a dish above to see the magic!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {demoCart.map(item => (
                      <div key={item.id} className="flex justify-between items-center gap-2 text-xs bg-gray-50 dark:bg-zinc-950/60 border border-gray-100 dark:border-zinc-800 p-3 rounded-xl">
                        <div className="truncate flex-1">
                          <p className="font-bold text-gray-800 dark:text-zinc-300 truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">{item.calories * item.qty} cal total</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => updateDemoQty(item.id, item.qty - 1)}
                            className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center font-bold text-gray-600 dark:text-zinc-300">
                            −
                          </button>
                          <span className="w-4 text-center font-bold text-gray-700 dark:text-zinc-300">{item.qty}</span>
                          <button onClick={() => updateDemoQty(item.id, item.qty + 1)}
                            className="w-6 h-6 rounded-lg bg-[#E23744] hover:bg-[#C0303B] text-white flex items-center justify-center font-bold">
                            +
                          </button>
                          <button onClick={() => removeDemoItem(item.id)}
                            className="text-gray-300 dark:text-zinc-700 hover:text-[#E23744] ml-1 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Live Nutrition Panel */}
                <div className="bg-gray-50 dark:bg-zinc-950/60 rounded-xl p-4 border border-gray-100 dark:border-zinc-800 space-y-4">
                  <div className="flex justify-between text-[10px] text-gray-400 dark:text-zinc-500">
                    <span className="font-extrabold uppercase tracking-wider">Live Nutrition Analysis</span>
                    <span className="font-semibold flex items-center gap-1">
                      {goalLimit.emoji} {goalLimit.label}
                    </span>
                  </div>

                  {/* Calorie bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1 text-gray-700 dark:text-zinc-300">
                        <Flame size={13} className="text-orange-500" /> {totalCal} cal
                      </span>
                      <span className="text-gray-400 dark:text-zinc-500">/ {goalLimit.cal} cal</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${isOverCal
                          ? 'bg-gradient-to-r from-red-400 to-red-500'
                          : 'bg-gradient-to-r from-green-400 to-emerald-500'}`}
                        style={{ width: `${calPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Protein', val: totalProtein, limit: goalLimit.protein, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
                      { label: 'Carbs',   val: totalCarbs,   limit: goalLimit.carbs,   color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
                      { label: 'Fat',     val: totalFat,     limit: goalLimit.fat,     color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30' },
                    ].map(m => (
                      <div key={m.label} className={`${m.bg} rounded-xl p-2.5 text-center`}>
                        <div className={`text-sm font-extrabold ${m.color}`}>{m.val}g</div>
                        <div className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold mt-0.5">{m.label} / {m.limit}g</div>
                      </div>
                    ))}
                  </div>

                  {/* Alerts */}
                  {(isOverCal || isHighFat || isLowProt) ? (
                    <div className="space-y-2">
                      {isOverCal && (
                        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 rounded-xl p-2.5 text-[10px] text-red-700 dark:text-red-400 font-semibold">
                          <AlertTriangle size={12} className="shrink-0 mt-0.5 text-red-500" />
                          <span>⚠️ Calorie overload! You are <strong>{totalCal - goalLimit.cal} cal</strong> over your {goalLimit.label} goal.</span>
                        </div>
                      )}
                      {isHighFat && (
                        <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/40 rounded-xl p-2.5 text-[10px] text-orange-700 dark:text-orange-400 font-semibold">
                          <AlertTriangle size={12} className="shrink-0 mt-0.5 text-orange-500" />
                          <span>High fat warning! Exceeds target. Try removing a heavy item.</span>
                        </div>
                      )}
                      {isLowProt && (
                        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-xl p-2.5 text-[10px] text-blue-700 dark:text-blue-400 font-semibold">
                          <AlertTriangle size={12} className="shrink-0 mt-0.5 text-blue-500" />
                          <span>Low protein for muscle gain — add a protein shake!</span>
                        </div>
                      )}
                    </div>
                  ) : demoCart.length > 0 ? (
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/40 rounded-xl p-2.5 text-[10px] text-green-700 dark:text-green-400 font-bold justify-center">
                      <Check size={12} className="text-green-500" />
                      ✅ Perfectly aligned with your nutrition goals!
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E23744] uppercase tracking-widest mb-3">
            <Sparkles size={14} /> Why Choose Us
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-zinc-100 mb-3">
            Why BiteByte is Different
          </h2>
          <p className="text-gray-400 dark:text-zinc-500 text-sm leading-relaxed">
            Not just online ordering — intelligent, nutrition-aware ordering that keeps you healthy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Flame size={24} />,
              title: 'Real-Time Calorie Counter',
              desc: 'Every menu item shows exact calories. Your cart total updates dynamically, keeping you accountable with every bite.',
              gradient: 'from-red-500 to-orange-500',
              bgLight: 'bg-red-50 dark:bg-red-950/20',
            },
            {
              icon: <Dumbbell size={24} />,
              title: 'Goal-Based Smart Alerts',
              desc: 'Pick from Weight Loss, Muscle Gain, or Balanced plans. The system alerts you if your order conflicts with your goal.',
              gradient: 'from-blue-500 to-cyan-500',
              bgLight: 'bg-blue-50 dark:bg-blue-950/20',
            },
            {
              icon: <PieChart size={24} />,
              title: 'Complete Macro Breakdown',
              desc: 'Protein, carbs, fat per dish and in total. Built for fitness enthusiasts tracking precise macros daily.',
              gradient: 'from-green-500 to-emerald-500',
              bgLight: 'bg-green-50 dark:bg-green-950/20',
            },
          ].map((f, i) => (
            <div key={f.title}
              className="group relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/60 p-7 rounded-3xl
                         hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-1
                         transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${f.bgLight} rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <div className={`bg-gradient-to-br ${f.gradient} bg-clip-text text-transparent`}>
                  {f.icon}
                </div>
              </div>

              <h3 className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 dark:text-zinc-500 text-sm leading-relaxed">{f.desc}</p>

              {/* Decorative corner accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${f.gradient} opacity-[0.03] rounded-bl-full rounded-tr-3xl transition-opacity group-hover:opacity-[0.06]`} />
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E23744] uppercase tracking-widest mb-3">
            <TrendingUp size={14} /> Simple Process
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-zinc-100">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Set Your Goal', desc: 'Choose weight loss, muscle gain, or balanced nutrition.', emoji: '🎯' },
            { step: '02', title: 'Browse Menu', desc: 'Every dish shows full nutrition data — calories, protein, carbs, fat.', emoji: '🍽️' },
            { step: '03', title: 'Smart Cart', desc: 'Real-time macro tracking with intelligent alerts if you exceed goals.', emoji: '🧠' },
            { step: '04', title: 'Order & Enjoy', desc: 'Place your order confidently knowing it fits your nutrition plan.', emoji: '✅' },
          ].map((s, i) => (
            <div key={s.step}
              className="relative text-center animate-slide-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <div className="text-4xl mb-4">{s.emoji}</div>
              <div className="text-[10px] font-extrabold text-[#E23744] uppercase tracking-widest mb-2">Step {s.step}</div>
              <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-base mb-2">{s.title}</h3>
              <p className="text-gray-400 dark:text-zinc-500 text-xs leading-relaxed">{s.desc}</p>

              {/* Connector line */}
              {i < 3 && (
                <div className="hidden md:block absolute top-8 -right-3 w-6 border-t-2 border-dashed border-gray-200 dark:border-zinc-800" />
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 pb-20">
        <div className="relative bg-gradient-to-br from-[#E23744] via-[#D42E3F] to-[#B22835] rounded-3xl px-8 py-16 md:py-20 text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="text-5xl mb-5">🍕</div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Ready to eat smart?
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              Create an account, set your nutrition goals, and start ordering food that fits your lifestyle.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/menu"
                className="group inline-flex items-center gap-2 bg-white text-[#E23744] hover:bg-gray-50 font-extrabold px-8 py-4 rounded-2xl
                           shadow-xl shadow-black/10 transition-all duration-300 text-sm hover:scale-[1.03] active:scale-[0.97]">
                View Menu <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-4 rounded-2xl
                           transition-all duration-200 text-sm backdrop-blur-sm">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-100 dark:border-zinc-900 py-8">
        <div className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              <span className="text-[#E23744]">Bite</span>
              <span className="text-gray-900 dark:text-zinc-100">Byte</span>
            </span>
            <span className="text-xs text-gray-400 dark:text-zinc-600">© 2026</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-600 text-center">
            Built with ❤️ for nutrition-conscious food lovers
          </p>
          <div className="flex items-center gap-4">
            <Link to="/menu" className="text-xs text-gray-400 dark:text-zinc-500 hover:text-[#E23744] transition-colors font-medium">Menu</Link>
            <Link to="/schema" className="text-xs text-gray-400 dark:text-zinc-500 hover:text-[#E23744] transition-colors font-medium">Schema</Link>
            <Link to="/login" className="text-xs text-gray-400 dark:text-zinc-500 hover:text-[#E23744] transition-colors font-medium">Login</Link>
            <Link to="/register" className="text-xs text-gray-400 dark:text-zinc-500 hover:text-[#E23744] transition-colors font-medium">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}