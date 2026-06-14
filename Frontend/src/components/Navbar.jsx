import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { useAuthStore, useCartStore } from '../store'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const items = useCartStore(s => s.items)
  const cartCount = items.reduce((s, i) => s + i.qty, 0)
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return (
    <nav className="bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight">
          <span className="text-[#E23744]">Bite</span>
          <span className="text-[#1C1C1C] dark:text-[#F3F4F6]">Byte</span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-1">
          {[{ to: '/menu', label: 'Menu' },
            ...(user ? [{ to: '/orders', label: 'My Orders' }] : [])
          ].map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors
                ${location.pathname === l.to
                  ? 'text-[#E23744] bg-red-50 dark:bg-red-950/20'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-[#E23744] dark:hover:text-[#E23744] hover:bg-gray-50 dark:hover:bg-zinc-900'}`}>
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-[#E23744] bg-red-50 dark:bg-red-950/20">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-gray-500 dark:text-zinc-400"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link to="/menu" className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors">
            <ShoppingCart size={18} className="text-gray-500 dark:text-zinc-400" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#E23744] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-1">
              <Link to="/profile"
                className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 px-3 py-2 rounded-xl transition-colors">
                <User size={14} className="text-gray-500 dark:text-zinc-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300 hidden sm:block">
                  {user.full_name?.split(' ')[0] || 'User'}
                </span>
              </Link>
              <button onClick={() => { logout(); navigate('/') }}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                title="Log Out">
                <LogOut size={16} className="text-gray-400 dark:text-zinc-500 hover:text-[#E23744] dark:hover:text-[#E23744]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/login"
                className="text-sm font-semibold text-gray-600 dark:text-zinc-400 px-3 py-2 hover:text-[#E23744] dark:hover:text-[#E23744] transition-colors">
                Login
              </Link>
              <Link to="/register"
                className="text-sm font-semibold bg-[#E23744] text-white px-4 py-2 rounded-xl hover:bg-[#C0303B] transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}