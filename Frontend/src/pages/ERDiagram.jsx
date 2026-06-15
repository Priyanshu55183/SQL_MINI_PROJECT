import { useState } from 'react'
import { Database, Table2, Key, ArrowRight, Link as LinkIcon, Shield, ChevronDown, ChevronUp } from 'lucide-react'

const TABLES = [
  {
    name: 'profiles',
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-900/40',
    description: 'Extends Supabase auth.users with app-specific profile data',
    columns: [
      { name: 'id',        type: 'UUID',    pk: true, fk: 'auth.users(id)', note: 'ON DELETE CASCADE' },
      { name: 'full_name', type: 'TEXT',     required: true },
      { name: 'phone',     type: 'TEXT' },
      { name: 'address',   type: 'TEXT' },
      { name: 'goal',      type: 'TEXT',     default: "'balanced'", note: "weight_loss | muscle_gain | balanced" },
    ],
    rls: ['Users can only SELECT/UPDATE their own row'],
  },
  {
    name: 'food_items',
    color: 'from-orange-500 to-red-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-900/40',
    description: 'Menu items with full nutrition data',
    columns: [
      { name: 'item_id',      type: 'SERIAL',  pk: true },
      { name: 'item_name',    type: 'TEXT',     required: true },
      { name: 'category',     type: 'TEXT',     required: true, note: 'Pizza | Burger | Pasta | ...' },
      { name: 'price',        type: 'NUMERIC',  required: true },
      { name: 'description',  type: 'TEXT' },
      { name: 'is_veg',       type: 'BOOLEAN',  default: 'TRUE' },
      { name: 'is_available', type: 'BOOLEAN',  default: 'TRUE' },
      { name: 'calories',     type: 'INTEGER',  default: '0' },
      { name: 'protein',      type: 'NUMERIC',  default: '0', note: 'grams' },
      { name: 'carbs',        type: 'NUMERIC',  default: '0', note: 'grams' },
      { name: 'fat',          type: 'NUMERIC',  default: '0', note: 'grams' },
    ],
    rls: ['Public read for everyone', 'Only service role can write'],
  },
  {
    name: 'orders',
    color: 'from-green-500 to-emerald-500',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-900/40',
    description: 'Tracks each order with nutritional totals',
    columns: [
      { name: 'order_id',     type: 'SERIAL',      pk: true },
      { name: 'user_id',      type: 'UUID',         fk: 'profiles(id)', note: 'ON DELETE SET NULL' },
      { name: 'total_price',  type: 'NUMERIC',      required: true },
      { name: 'total_cal',    type: 'INTEGER',      default: '0' },
      { name: 'order_status', type: 'TEXT',          default: "'Pending'", note: 'Pending | Preparing | Delivered' },
      { name: 'created_at',   type: 'TIMESTAMPTZ',  default: 'NOW()' },
    ],
    rls: ['Users can only SELECT/INSERT their own orders'],
  },
  {
    name: 'order_items',
    color: 'from-purple-500 to-pink-500',
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-900/40',
    description: 'Junction table linking orders to food items (many-to-many)',
    columns: [
      { name: 'id',         type: 'SERIAL',  pk: true },
      { name: 'order_id',   type: 'INTEGER', fk: 'orders(order_id)', note: 'ON DELETE CASCADE', required: true },
      { name: 'item_id',    type: 'INTEGER', fk: 'food_items(item_id)', note: 'ON DELETE SET NULL' },
      { name: 'item_name',  type: 'TEXT',    required: true },
      { name: 'quantity',   type: 'INTEGER', required: true },
      { name: 'unit_price', type: 'NUMERIC', required: true },
      { name: 'calories',   type: 'INTEGER', default: '0' },
    ],
    rls: ['Users can only SELECT/INSERT items for their own orders'],
  },
]

const RELATIONS = [
  { from: 'profiles',    fromCol: 'id',       to: 'orders',      toCol: 'user_id',  type: '1:N', label: 'A user has many orders' },
  { from: 'orders',      fromCol: 'order_id', to: 'order_items', toCol: 'order_id', type: '1:N', label: 'An order has many items' },
  { from: 'food_items',  fromCol: 'item_id',  to: 'order_items', toCol: 'item_id',  type: '1:N', label: 'A food item can be in many order items' },
]

function TableCard({ table, isExpanded, onToggle }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-2xl border ${table.borderColor} overflow-hidden transition-all duration-300 hover:shadow-lg`}>
      {/* Header */}
      <button onClick={onToggle}
        className={`w-full px-5 py-4 flex items-center justify-between ${table.bgLight}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${table.color} flex items-center justify-center shadow-lg`}>
            <Table2 size={18} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-extrabold text-gray-900 dark:text-zinc-100">{table.name}</h3>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">{table.columns.length} columns · {table.description}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {/* Columns */}
      {isExpanded && (
        <div className="divide-y divide-gray-50 dark:divide-zinc-800/40">
          {table.columns.map(col => (
            <div key={col.name} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors">
              {/* Icon */}
              <div className="w-5 flex justify-center shrink-0">
                {col.pk ? <Key size={13} className="text-amber-500" /> :
                 col.fk ? <LinkIcon size={13} className="text-blue-500" /> :
                 <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700" />}
              </div>

              {/* Name & type */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-bold ${col.pk ? 'text-amber-600 dark:text-amber-400' : col.fk ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-zinc-200'}`}>
                    {col.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                    {col.type}
                  </span>
                  {col.pk && <span className="text-[9px] font-extrabold text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">PK</span>}
                  {col.fk && <span className="text-[9px] font-extrabold text-blue-500 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded">FK</span>}
                  {col.required && <span className="text-[9px] font-extrabold text-red-400 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded">NOT NULL</span>}
                </div>
                {(col.fk || col.default || col.note) && (
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {col.fk && <span className="text-[10px] text-blue-500 font-medium">→ {col.fk}</span>}
                    {col.default && <span className="text-[10px] text-gray-400 dark:text-zinc-500">default: {col.default}</span>}
                    {col.note && !col.fk && <span className="text-[10px] text-gray-400 dark:text-zinc-500 italic">{col.note}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* RLS */}
          <div className="px-5 py-3 bg-gray-50/50 dark:bg-zinc-950/30">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1.5">
              <Shield size={11} /> Row Level Security
            </div>
            {table.rls.map((r, i) => (
              <p key={i} className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">• {r}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ERDiagram() {
  const [expanded, setExpanded] = useState({ profiles: true, food_items: true, orders: true, order_items: true })

  const toggle = (name) => setExpanded(prev => ({ ...prev, [name]: !prev[name] }))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E23744] to-[#FF6B6B] flex items-center justify-center shadow-lg shadow-red-500/20">
          <Database size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-100">Database Schema</h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">BiteByte ER Diagram — PostgreSQL on Supabase</p>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-4 flex-wrap text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-5 mb-7">
        <span className="flex items-center gap-1"><Key size={11} className="text-amber-500" /> Primary Key</span>
        <span className="flex items-center gap-1"><LinkIcon size={11} className="text-blue-500" /> Foreign Key</span>
        <span className="flex items-center gap-1"><Shield size={11} className="text-green-500" /> RLS Enabled</span>
        <span className="text-red-400">NOT NULL = Required</span>
      </div>

      {/* Relations */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800/60 p-5 mb-6">
        <h2 className="text-xs font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4">Relationships</h2>
        <div className="space-y-3">
          {RELATIONS.map((r, i) => (
            <div key={i} className="flex items-center gap-3 flex-wrap text-sm">
              <span className="font-bold text-gray-900 dark:text-zinc-100">{r.from}</span>
              <span className="text-[10px] font-mono text-gray-400">.{r.fromCol}</span>
              <div className="flex items-center gap-1 px-3 py-1 bg-[#E23744]/10 rounded-full">
                <ArrowRight size={12} className="text-[#E23744]" />
                <span className="text-[10px] font-extrabold text-[#E23744]">{r.type}</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-zinc-100">{r.to}</span>
              <span className="text-[10px] font-mono text-gray-400">.{r.toCol}</span>
              <span className="text-[10px] text-gray-400 dark:text-zinc-500 italic hidden sm:inline">— {r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table cards */}
      <div className="space-y-4">
        {TABLES.map(table => (
          <TableCard
            key={table.name}
            table={table}
            isExpanded={expanded[table.name]}
            onToggle={() => toggle(table.name)}
          />
        ))}
      </div>

      {/* SQL snippet */}
      <div className="mt-8 bg-gray-950 rounded-2xl p-5 overflow-x-auto">
        <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Sample SQL: Revenue by Item</h3>
        <pre className="text-green-400 text-xs leading-relaxed font-mono">
{`SELECT
    oi.item_name,
    SUM(oi.quantity)               AS total_qty,
    SUM(oi.unit_price * oi.quantity) AS total_revenue,
    SUM(oi.calories * oi.quantity)   AS total_calories
FROM order_items oi
GROUP BY oi.item_name
ORDER BY total_revenue DESC;`}
        </pre>
      </div>
    </div>
  )
}
