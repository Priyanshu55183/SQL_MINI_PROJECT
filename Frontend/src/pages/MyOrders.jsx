import { useEffect, useState } from 'react'
import { myOrders } from '../api'
import OrderCard from '../components/OrderCard'
import { PackageOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MyOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    myOrders().then(r => { setOrders(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100 mb-7">My Orders</h1>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="rounded-2xl h-32 animate-pulse bg-gray-100 dark:bg-zinc-800" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-14 text-center">
          <PackageOpen size={44} className="text-gray-200 dark:text-zinc-800 mx-auto mb-4" />
          <p className="font-bold text-gray-450 dark:text-zinc-500 mb-4 text-sm">No orders yet</p>
          <Link to="/menu"
            className="inline-block bg-[#E23744] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#C0303B] transition-colors shadow-md">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => <OrderCard key={o.order_id} order={o} />)}
        </div>
      )}
    </div>
  )
}