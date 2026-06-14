import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Login from './pages/Login'
import Register from './pages/Register'
import MyOrders from './pages/MyOrders'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

function Protected({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

function AdminOnly({ children }) {
  const user = useAuthStore(s => s.user)
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL
  return isAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/menu"      element={<Menu />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/orders"    element={<Protected><MyOrders /></Protected>} />
        <Route path="/profile"   element={<Protected><Profile /></Protected>} />
        <Route path="/admin"     element={<Protected><AdminOnly><Admin /></AdminOnly></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}