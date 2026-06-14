import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login', data)
export const getMe    = ()     => api.get('/auth/me')
export const updateMe = (data) => api.put('/auth/me', data)

// ── Menu ────────────────────────────────────────────────────────
export const getMenu       = ()   => api.get('/menu')
export const getCategories = ()   => api.get('/menu/categories')

// ── Orders ──────────────────────────────────────────────────────
export const placeOrder = (data) => api.post('/orders/place', data)
export const myOrders   = ()     => api.get('/orders/my')

// ── Admin ───────────────────────────────────────────────────────
export const adminStats        = ()          => api.get('/admin/stats')
export const adminOrders       = (search='') => api.get(`/admin/orders?search=${search}`)
export const adminUsers        = ()          => api.get('/admin/users')
export const adminRevenue      = ()          => api.get('/admin/revenue')
export const updateOrderStatus = (data)      => api.put('/admin/order/status', data)
export const deleteOrder       = (id)        => api.delete(`/admin/order/${id}`)
export const updateMenuItem    = (id, data)  => api.put(`/admin/menu/${id}`, data)

export default api