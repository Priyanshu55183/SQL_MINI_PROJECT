import { Flame, RotateCcw, Download } from 'lucide-react'
import { useCartStore } from '../store'
import { useToast } from './Toast'

const STATUS = {
  Pending:   'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-200/40 dark:border-yellow-900/30',
  Preparing: 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/30',
  Delivered: 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200/40 dark:border-green-900/30',
}

function generateInvoice(order) {
  const date = order.created_at || new Date().toISOString().slice(0, 16)
  const items = order.items || []

  let lines = []
  lines.push('═══════════════════════════════════════════')
  lines.push('              BITEBYTE INVOICE              ')
  lines.push('═══════════════════════════════════════════')
  lines.push('')
  lines.push(`  Order #:    ${order.order_id}`)
  lines.push(`  Date:       ${date}`)
  lines.push(`  Status:     ${order.order_status}`)
  lines.push('')
  lines.push('───────────────────────────────────────────')
  lines.push('  ITEM                    QTY    AMOUNT    ')
  lines.push('───────────────────────────────────────────')

  items.forEach(item => {
    const name = item.item_name.padEnd(22).slice(0, 22)
    const qty  = String(item.quantity).padStart(3)
    const amt  = `₹${(item.unit_price * item.quantity).toFixed(0)}`.padStart(8)
    lines.push(`  ${name}  ${qty}  ${amt}`)
  })

  lines.push('───────────────────────────────────────────')
  lines.push(`  TOTAL                        ₹${order.total_price}`.padEnd(43))
  lines.push(`  Total Calories:              ${order.total_cal} cal`)
  lines.push('───────────────────────────────────────────')
  lines.push('')
  lines.push('  Thank you for ordering with BiteByte!')
  lines.push('  Eat smart. Stay healthy. 🍕')
  lines.push('')
  lines.push('═══════════════════════════════════════════')

  return lines.join('\n')
}

export default function OrderCard({ order }) {
  const addItem = useCartStore(s => s.addItem)
  const toast = useToast()

  const handleReorder = () => {
    if (!order.items?.length) return
    order.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          item_id: item.item_id || 0,
          item_name: item.item_name,
          price: item.unit_price,
          calories: item.calories || 0,
          protein: 0, carbs: 0, fat: 0,
          is_veg: true,
        })
      }
    })
    toast.success(`${order.items.length} item(s) added to cart!`)
  }

  const handleDownload = () => {
    const text = generateInvoice(order)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BiteByte_Order_${order.order_id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Invoice downloaded!')
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/80 p-5 transition-all duration-300 hover:shadow-md">
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

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800/40">
        <button onClick={handleReorder}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl border-2 border-[#E23744]/20 text-[#E23744] hover:bg-red-50 dark:hover:bg-red-950/20 transition-all hover:border-[#E23744]/40 active:scale-[0.97]">
          <RotateCcw size={13} /> Reorder
        </button>
        <button onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl border-2 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all hover:border-gray-300 dark:hover:border-zinc-700 active:scale-[0.97]">
          <Download size={13} /> Invoice
        </button>
      </div>
    </div>
  )
}