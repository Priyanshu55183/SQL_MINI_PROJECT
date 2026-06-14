import { Flame } from 'lucide-react'

const STATUS = {
  Pending:   'bg-yellow-55 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-250/20 dark:border-yellow-900/30',
  Preparing: 'bg-blue-55 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-250/20 dark:border-blue-900/30',
  Delivered: 'bg-green-55 text-green-800 dark:bg-green-950/20 dark:text-green-400 border border-green-250/20 dark:border-green-900/30',
}

export default function OrderCard({ order }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-5 transition-colors duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold">Order #{order.order_id}</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{order.created_at}</p>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${STATUS[order.order_status] || STATUS.Pending}`}>
          {order.order_status}
        </span>
      </div>

      <div className="space-y-1 mb-3">
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-800 dark:text-zinc-200 font-semibold">
              {item.item_name}
              <span className="text-gray-400 dark:text-zinc-500 font-normal"> ×{item.quantity}</span>
            </span>
            <span className="text-gray-500 dark:text-zinc-400">₹{(item.unit_price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800/40">
        <span className="flex items-center gap-1 text-orange-500 text-xs font-semibold">
          <Flame size={12} /> {order.total_cal} cal
        </span>
        <span className="font-extrabold text-[#E23744] text-base">₹{order.total_price}</span>
      </div>
    </div>
  )
}