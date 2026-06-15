import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, LayoutDashboard, Sun, Moon, Menu as MenuIcon, X } from 'lucide-react'
import { useAuthStore, useCartStore } from '../store'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const items = useCartStore(s => s.items)
  const cartCount = items.reduce((s, i) => s + i.qty, 0)
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL
  const [mobileOpen, setMobileOpen] = useState(false)

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const navLinks = [
    { to: '/menu', label: 'Menu' },
    ...(user ? [{ to: '/orders', label: 'My Orders' }] : []),
  ]

  return (
    <>
      <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-[#E23744]">Bite</span>
            <span className="text-[#1C1C1C] dark:text-[#F3F4F6]">Byte</span>
          </Link>

          {/* Center links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
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
            {/* Theme Toggle */}
            <button onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-gray-500 dark:text-zinc-400"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Cart */}
            <Link to="/menu" className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors">
              <ShoppingCart size={18} className="text-gray-500 dark:text-zinc-400" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#E23744] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth buttons (desktop) */}
            {user ? (
              <div className="hidden md:flex items-center gap-1">
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
              <div className="hidden md:flex items-center gap-1 sm:gap-2">
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

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-gray-500 dark:text-zinc-400">
              {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className={`md:hidden fixed inset-x-0 top-14 z-40 transition-all duration-300 ease-out
        ${mobileOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900 shadow-xl shadow-black/5 dark:shadow-black/30 px-5 py-4 space-y-1.5">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                ${location.pathname === l.to
                  ? 'text-[#E23744] bg-red-50 dark:bg-red-950/20'
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`}>
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-[#E23744] bg-red-50 dark:bg-red-950/20">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          )}

          <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 mt-2">
            {user ? (
              <div className="space-y-1.5">
                <Link to="/profile"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                  <User size={15} /> {user.full_name || 'Profile'}
                </Link>
                <button onClick={() => { logout(); navigate('/') }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left">
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"
                  className="flex-1 text-center text-sm font-semibold text-gray-600 dark:text-zinc-400 px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-[#E23744] hover:text-[#E23744] transition-colors">
                  Login
                </Link>
                <Link to="/register"
                  className="flex-1 text-center text-sm font-semibold bg-[#E23744] text-white px-4 py-3 rounded-xl hover:bg-[#C0303B] transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-black/20 dark:bg-black/40 z-30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}