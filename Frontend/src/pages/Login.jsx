import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuthStore } from '../store'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth  = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await login(form)
      setAuth({ user_id: data.user_id, full_name: data.full_name, email: data.email, goal: data.goal }, data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 transition-colors duration-300">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-zinc-800/60 w-full max-w-md p-8 md:p-10 shadow-xl shadow-black/5 dark:shadow-black/20 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-100 mb-1 tracking-tight">Welcome back!</h1>
        <p className="text-gray-400 dark:text-zinc-400 text-sm mb-8">Login to your BiteByte account</p>

        <form onSubmit={handle} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 block mb-1.5">Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E23744]/20 focus:border-[#E23744] dark:focus:border-[#E23744] bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-all duration-200"
              placeholder="you@email.com" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 block mb-1.5">Password</label>
            <input type="password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E23744]/20 focus:border-[#E23744] dark:focus:border-[#E23744] bg-white dark:bg-zinc-955 text-gray-900 dark:text-zinc-100 transition-all duration-200"
              placeholder="••••••••" required />
          </div>
          {error && <p className="text-[#E23744] text-xs font-semibold">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#E23744] hover:bg-[#C0303B] hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-500/10 dark:shadow-red-500/5">
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 dark:text-zinc-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#E23744] font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}