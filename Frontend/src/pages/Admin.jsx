import { useEffect, useState } from 'react'
import { adminStats, adminOrders, adminUsers, adminRevenue, updateOrderStatus, deleteOrder } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, ShoppingBag, TrendingUp, Clock } from 'lucide-react'

export default function Admin() {
  const [stats,   setStats]   = useState({})
  const [orders,  setOrders]  = useState([])
  const [users,   setUsers]   = useState([])
  const [revenue, setRevenue] = useState([])
  const [search,  setSearch]  = useState('')
  const [tab,     setTab]     = useState('orders')

  const load = async () => {
    const [s, o, u, r] = await Promise.all([adminStats(), adminOrders(search), adminUsers(), adminRevenue()])
    setStats(s.data); setOrders(o.data); setUsers(u.data); setRevenue(r.data)
  }

  useEffect(() => { load() }, [search])

  const handleStatus = async (order_id, status) => { await updateOrderStatus({ order_id, status }); load() }
  const handleDelete = async (id) => { if (!confirm('Delete this order?')) return; await deleteOrder(id); load() }

  const TABS = ['orders', 'customers', 'revenue']
  const inp  = "border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#E23744] transition-colors"

  return (
    <div className="max-w-[92vw] 2xl:max-w-[1536px] mx-auto px-4 py-7">
      {/* Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-[#E23744] rounded-2xl p-6 mb-7 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white">Owner Dashboard</h1>
          <p className="text-white/60 text-xs mt-1">All data — visible only to you</p>
        </div>
        <span className="text-4xl animate-float">📊</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { icon:<Users size={18} className="text-blue-500"/>,    label:'Customers',    val: stats.total_users },
          { icon:<ShoppingBag size={18} className="text-[#E23744]"/>, label:'Orders',   val: stats.total_orders },
          { icon:<TrendingUp size={18} className="text-green-500"/>, label:'Revenue',   val: `₹${stats.total_revenue || 0}` },
          { icon:<Clock size={18} className="text-orange-500"/>,  label:'Pending',      val: stats.pending },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-5 text-center transition-colors duration-300">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100">{s.val ?? '—'}</div>
            <div className="text-xs text-gray-400 dark:text-zinc-500 font-bold mt-1.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all
              ${tab === t
                ? 'bg-[#E23744] text-white shadow-md'
                : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-[#E23744] border border-gray-200 dark:border-zinc-800'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Orders */}
      {tab === 'orders' && (
        <div>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, item or status…" className={`${inp} mb-5 w-full max-w-sm`} />
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o.order_id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-5 transition-colors duration-300">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                      #{o.order_id} · {o.full_name}
                      <span className="text-gray-405 dark:text-zinc-500 font-normal text-xs ml-2">{o.phone}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{o.items?.map(i => `${i.item_name} ×${i.quantity}`).join(', ')}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{o.created_at} · {o.total_cal} cal</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[#E23744] text-sm mr-2">₹{o.total_price}</span>
                    <select value={o.order_status} onChange={e => handleStatus(o.order_id, e.target.value)}
                      className="text-xs border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:border-[#E23744] bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-150 transition-colors">
                      {['Pending','Preparing','Delivered'].map(s => <option key={s} className="bg-white dark:bg-zinc-900">{s}</option>)}
                    </select>
                    <button onClick={() => handleDelete(o.order_id)}
                      className="text-xs text-red-400 hover:text-red-600 font-bold px-3 py-1.5 border border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-800/80 rounded-xl transition-all">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-gray-400 dark:text-zinc-500 text-center py-12 text-sm font-semibold">No orders found.</p>}
          </div>
        </div>
      )}

      {/* Customers */}
      {tab === 'customers' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 overflow-hidden shadow-sm transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-zinc-950/80">
                <tr>{['Name','Phone','Address','Goal','Joined'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wide border-b border-gray-100 dark:border-zinc-800/40">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-950/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-sm text-gray-900 dark:text-zinc-200">{u.full_name}</td>
                    <td className="px-5 py-3.5 text-gray-400 dark:text-zinc-550 text-sm">{u.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-400 dark:text-zinc-550 text-sm">{u.address || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-extrabold bg-red-50 dark:bg-red-950/30 text-[#E23744] px-2.5 py-1 rounded-full capitalize">
                        {u.goal?.replace('_',' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 dark:text-zinc-550 text-xs">{u.created_at?.slice(0,10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue */}
      {tab === 'revenue' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-6 transition-colors duration-300">
            <h2 className="font-bold text-gray-900 dark:text-zinc-150 mb-5 text-sm uppercase tracking-wider">Revenue by Item</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenue.slice(0,8)} margin={{ bottom: 40 }}>
                <XAxis dataKey="item_name" tick={{ fontSize: 10, fill: '#888' }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={v => [`₹${v}`, 'Revenue']}
                />
                <Bar dataKey="total_revenue" fill="#E23744" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 dark:bg-zinc-950/80">
                  <tr>{['Item','Qty Sold','Revenue','Total Cal'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wide border-b border-gray-100 dark:border-zinc-800/40">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
                  {revenue.map(r => (
                    <tr key={r.item_name} className="hover:bg-gray-50 dark:hover:bg-zinc-950/40 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-sm text-gray-900 dark:text-zinc-200">{r.item_name}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-zinc-400 text-sm">{r.total_qty}</td>
                      <td className="px-5 py-3.5 font-extrabold text-[#E23744] text-sm">₹{r.total_revenue}</td>
                      <td className="px-5 py-3.5 text-gray-400 dark:text-zinc-500 text-sm">{r.total_cal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}