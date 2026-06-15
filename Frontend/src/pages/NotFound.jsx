import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center max-w-md animate-fade-in">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[140px] md:text-[180px] font-black text-gray-100 dark:text-zinc-900 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl animate-float">🍕</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-zinc-100 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-400 dark:text-zinc-500 text-sm mb-8 leading-relaxed">
          Oops! Looks like this page got eaten. Let's get you back to something delicious.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/"
            className="inline-flex items-center gap-2 bg-[#E23744] hover:bg-[#C0303B] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-red-500/15 hover:scale-[1.03] active:scale-[0.97]">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/menu"
            className="inline-flex items-center gap-2 border-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold px-6 py-3 rounded-xl text-sm transition-all hover:border-[#E23744] hover:text-[#E23744]">
            <ArrowLeft size={16} /> Browse Menu
          </Link>
        </div>
      </div>
    </div>
  )
}
