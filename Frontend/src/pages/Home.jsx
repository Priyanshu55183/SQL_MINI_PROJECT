import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Dumbbell, PieChart, Plus, Trash2, AlertTriangle, Check, Sparkles } from 'lucide-react'

// Mock data for the Home page interactive demo
const DEMO_DISHES = [
  { id: 'd1', name: 'Avocado Toast', calories: 280, protein: 10, carbs: 24, fat: 16, category: 'Healthy' },
  { id: 'd2', name: 'Double Cheese Burger', calories: 590, protein: 32, carbs: 40, fat: 28, category: 'Comfort' },
  { id: 'd3', name: 'Strawberry Protein Shake', calories: 220, protein: 26, carbs: 12, fat: 4, category: 'Fitness' },
]

const DEMO_GOALS = {
  balanced: { label: 'Balanced Diet', cal: 2000, protein: 50, carbs: 250, fat: 65 },
  weight_loss: { label: 'Weight Loss', cal: 1500, protein: 65, carbs: 140, fat: 45 },
  muscle_gain: { label: 'Muscle Gain', cal: 2500, protein: 130, carbs: 300, fat: 75 },
}

export default function Home() {
  // Demo States
  const [demoGoal, setDemoGoal] = useState('weight_loss')
  const [demoCart, setDemoCart] = useState([
    { id: 'd1', name: 'Avocado Toast', calories: 280, protein: 10, carbs: 24, fat: 16, qty: 1 }
  ])

  // Demo Cart Calculations
  const totalCal = demoCart.reduce((s, i) => s + i.calories * i.qty, 0)
  const totalProtein = demoCart.reduce((s, i) => s + i.protein * i.qty, 0)
  const totalCarbs = demoCart.reduce((s, i) => s + i.carbs * i.qty, 0)
  const totalFat = demoCart.reduce((s, i) => s + i.fat * i.qty, 0)

  const goalLimit = DEMO_GOALS[demoGoal]
  const calPct = Math.min(Math.round((totalCal / goalLimit.cal) * 100), 100)
  const isOverCal = totalCal > goalLimit.cal
  const isHighFat = totalFat > goalLimit.fat
  const isLowProt = demoGoal === 'muscle_gain' && totalProtein < 35

  const addDemoItem = (dish) => {
    setDemoCart(prev => {
      const existing = prev.find(i => i.id === dish.id)
      if (existing) {
        return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...dish, qty: 1 }]
    })
  }

  const removeDemoItem = (id) => {
    setDemoCart(prev => prev.filter(i => i.id !== id))
  }

  const updateDemoQty = (id, newQty) => {
    if (newQty < 1) {
      removeDemoItem(id)
      return
    }
    setDemoCart(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i))
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden transition-colors duration-300">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-12 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#E23744]/10 dark:bg-[#E23744]/5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute top-80 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full filter blur-[100px] animate-pulse-slow animation-delay-400"></div>
      </div>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12 md:py-24 max-w-[92vw] 2xl:max-w-[1536px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-[#E23744]/20 rounded-full px-4.5 py-1.5 text-xs font-semibold text-[#E23744] mb-6">
            <Flame size={14} className="text-[#E23744] animate-pulse" />
            <span>India's First Nutrition-Aware Ordering App</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Order Food.<br />
            <span className="text-[#E23744] bg-clip-text">Track Nutrition.</span><br />
            Eat Smart.
          </h1>

          <p className="text-gray-500 dark:text-zinc-400 text-base md:text-lg mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0">
            Every dish shows calories, protein, carbs and fat. 
            Our intelligent cart monitors your macros and warns you before you overeat.
          </p>

          <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
            <Link to="/menu"
              className="flex items-center gap-2 bg-[#E23744] hover:bg-[#C0303B] hover:scale-105 active:scale-95 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-red-500/10 transition-all text-sm">
              Explore Menu <ArrowRight size={16} />
            </Link>
            <Link to="/register"
              className="flex items-center gap-2 border border-gray-300 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 font-semibold px-7 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors text-sm">
              Create Account
            </Link>
          </div>
        </div>

        {/* Hero Illustration (Premium Food Bowl & Floating Macros) */}
        <div className="flex-1 flex justify-center items-center select-none relative animate-float">
          <div className="relative max-w-xs sm:max-w-sm md:max-w-md">
            {/* Main Image with decorative border and shadow */}
            <div className="relative z-10 rounded-[2rem] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl shadow-black/10 dark:shadow-black/40 rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80" 
                alt="Healthy nutrition bowl" 
                className="w-full h-72 md:h-80 object-cover"
              />
            </div>

            {/* Floating UI Elements for Nutrition App Concept */}
            <div className="absolute -top-6 -right-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-3 shadow-xl z-20 animate-float animation-delay-200 flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Target</p>
                <p className="text-xs font-black text-green-500">Perfect Fit</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-3.5 shadow-xl z-20 animate-float flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/45 flex items-center justify-center">
                <Flame size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-450 dark:text-zinc-500 uppercase tracking-wide">Calorie Cap</p>
                <p className="text-xs font-black text-gray-900 dark:text-zinc-100">1,500 / day</p>
              </div>
            </div>

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-500/25 dark:bg-red-500/10 rounded-full filter blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 py-12 animate-slide-up animation-delay-200">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-zinc-100">Try it live! Live Nutrition Calculator</h2>
          <p className="text-gray-400 dark:text-zinc-500 text-sm mt-2">
            Simulate how our smart cart checks your order metrics in real-time. Toggle goals and add dishes below.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm">
          {/* Demo Left: Quick Add Items & Goal Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#E23744]" /> Step 1: Select Your Current Fitness Goal
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {Object.entries(DEMO_GOALS).map(([key, g]) => (
                  <button
                    key={key}
                    onClick={() => setDemoGoal(key)}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                      demoGoal === key
                        ? 'border-[#E23744] bg-red-50/50 dark:bg-red-950/20 text-[#E23744]'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className="font-bold text-xs flex items-center justify-between w-full">
                      {g.label}
                      {demoGoal === key && <Check size={12} className="shrink-0" />}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1">
                      Target limit: {g.cal} cal
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wide mb-3">
                Step 2: Add Dishes to Cart
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {DEMO_DISHES.map(dish => (
                  <div key={dish.id} className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-gray-200 dark:hover:border-zinc-700 transition-colors">
                    <div>
                      <span className="text-[9px] uppercase font-extrabold tracking-wider bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-gray-200/50 dark:border-zinc-700/50 text-gray-400">
                        {dish.category}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-zinc-200 mt-2 leading-tight">{dish.name}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-500 mt-1">{dish.calories} cal | {dish.protein}g P</p>
                    </div>
                    <button
                      onClick={() => addDemoItem(dish)}
                      className="mt-3 flex items-center justify-center gap-1 bg-[#E23744] hover:bg-[#C0303B] text-white text-xs font-bold py-1.5 rounded-xl transition-colors"
                    >
                      <Plus size={12} /> Add to Demo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Right: The Live Cart Preview */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-zinc-950/60 border border-gray-100 dark:border-zinc-900 rounded-2xl p-5">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/60 dark:border-zinc-900 mb-4">
              <span className="text-xs font-extrabold text-gray-900 dark:text-zinc-200 uppercase tracking-wider">
                🛒 Live Demo Cart
              </span>
              <button
                onClick={() => setDemoCart([])}
                className="text-[10px] text-gray-400 hover:text-red-500 font-bold"
              >
                Clear
              </button>
            </div>

            {/* Cart Items List */}
            {demoCart.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-2xl mb-1">🛒</p>
                <p className="text-xs text-gray-400">Cart is empty. Add a dish above!</p>
              </div>
            ) : (
              <div className="space-y-3 mb-5 max-h-36 overflow-y-auto pr-1">
                {demoCart.map(item => (
                  <div key={item.id} className="flex justify-between items-center gap-2 text-xs bg-white dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800/80 p-2.5 rounded-xl">
                    <div className="truncate flex-1">
                      <p className="font-bold text-gray-800 dark:text-zinc-300 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.calories * item.qty} cal</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateDemoQty(item.id, item.qty - 1)}
                        className="w-5 h-5 rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="w-3 text-center font-bold text-gray-700 dark:text-zinc-300">{item.qty}</span>
                      <button
                        onClick={() => updateDemoQty(item.id, item.qty + 1)}
                        className="w-5 h-5 rounded bg-[#E23744] hover:bg-[#C0303B] text-white flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeDemoItem(item.id)}
                        className="text-gray-300 hover:text-red-500 ml-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations Panel */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-gray-100 dark:border-zinc-800 space-y-4">
              {/* Calories Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1 text-gray-700 dark:text-zinc-300">
                    <Flame size={13} className="text-orange-500" /> {totalCal} cal
                  </span>
                  <span className="text-gray-400">/ {goalLimit.cal} cal</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isOverCal ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${calPct}%` }}
                  />
                </div>
              </div>

              {/* Macro Grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Protein', val: totalProtein, limit: goalLimit.protein, color: 'text-blue-500' },
                  { label: 'Carbs', val: totalCarbs, limit: goalLimit.carbs, color: 'text-yellow-500' },
                  { label: 'Fat', val: totalFat, limit: goalLimit.fat, color: 'text-pink-400' },
                ].map(m => (
                  <div key={m.label} className="bg-gray-50 dark:bg-zinc-950 p-2 rounded-lg text-center border border-gray-100/50 dark:border-zinc-800/40">
                    <div className={`text-xs font-extrabold ${m.color}`}>{m.val}g</div>
                    <div className="text-[8px] text-gray-400 dark:text-zinc-500 mt-0.5 uppercase font-bold">{m.label} / {m.limit}g</div>
                  </div>
                ))}
              </div>

              {/* Dynamic Alerts */}
              {(isOverCal || isHighFat || isLowProt) ? (
                <div className="space-y-1.5 pt-1">
                  {isOverCal && (
                    <div className="flex items-start gap-1.5 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-lg p-2 text-[10px] text-red-700 dark:text-red-400 font-semibold">
                      <AlertTriangle size={12} className="shrink-0 mt-0.5 text-red-500" />
                      <span>Calorie overload! You are {totalCal - goalLimit.cal} cal over your {goalLimit.label} goal.</span>
                    </div>
                  )}
                  {isHighFat && (
                    <div className="flex items-start gap-1.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/50 rounded-lg p-2 text-[10px] text-orange-700 dark:text-orange-400 font-semibold">
                      <AlertTriangle size={12} className="shrink-0 mt-0.5 text-orange-500" />
                      <span>High Fat Warning! Exceeds target limits. Try removing a heavy item.</span>
                    </div>
                  )}
                  {isLowProt && (
                    <div className="flex items-start gap-1.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50 rounded-lg p-2 text-[10px] text-blue-700 dark:text-blue-400 font-semibold">
                      <AlertTriangle size={12} className="shrink-0 mt-0.5 text-blue-500" />
                      <span>Low Protein Warning! Add a fitness/protein rich shake to meet muscle gain targets.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50 rounded-lg p-2 text-[10px] text-green-700 dark:text-green-400 font-semibold justify-center">
                  <Check size={12} className="text-green-500" />
                  <span>Order is perfectly aligned with your nutrition goals!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Explanation Cards */}
      <section className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 py-16 animate-slide-up animation-delay-400">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-zinc-100 mb-2">
          Why BiteByte is Different
        </h2>
        <p className="text-gray-400 dark:text-zinc-500 text-sm text-center mb-12">
          Not just online ordering — intelligent, nutrition-aware ordering.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Flame size={22} className="text-red-500" />,
              title: 'Calorie Counter',
              desc: 'Every item on the menu lists exact calories. Your cart running total updates dynamically as you add items, keeping you accountable.'
            },
            {
              icon: <Dumbbell size={22} className="text-blue-500" />,
              title: 'Goal-Based Warnings',
              desc: 'Choose between Weight Loss, Muscle Gain, or Balanced nutrition goals. The system highlights smart alerts if you select conflicting foods.'
            },
            {
              icon: <PieChart size={22} className="text-green-500" />,
              title: 'Macro Breakdown',
              desc: 'View protein, carbs, and fat per dish and in total. Perfect for gym enthusiasts tracking precise macro ratios daily.'
            }
          ].map(f => (
            <div key={f.title} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-900 p-6 rounded-2xl hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 bg-gray-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-base mb-2">{f.title}</h3>
              <p className="text-gray-400 dark:text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full Page CTA */}
      <section className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-6 pb-16 animate-slide-up animation-delay-600">
        <div className="bg-[#E23744] dark:bg-red-950/20 border border-[#E23744]/10 rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-red-600/5 -z-10"></div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">Ready to eat smart?</h2>
          <p className="text-white/80 dark:text-zinc-300 text-sm md:text-base mb-8 max-w-md mx-auto">
            Create an account, pick your target nutrition plan, and browse our delicious menu.
          </p>
          <Link to="/menu"
            className="inline-flex items-center gap-2 bg-white text-[#E23744] hover:bg-gray-100 font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 text-sm">
            View Menu <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}