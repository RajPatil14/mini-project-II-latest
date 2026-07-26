import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import TopNav from './components/TopNav'
import Dashboard from './pages/Dashboard'
import Reporting from './pages/Reporting'
import GoesOnRoute from './pages/GoesOnRoute'
import CheckOut from './pages/CheckOut'
import Tracking from './pages/Tracking'
import NotFound from './pages/NotFound'
import CameOnRoute from './pages/CameOnRoute'
import ExtraBus from './pages/ExtraBus'
import ExtraBusResult from './pages/ExtraBusResult'
import DriverRegister from './pages/DriverRegister'
import AccessGate from './pages/AccessGate'
import PassengerPortal from './pages/PassengerPortal'
import AdminStatus from './pages/AdminStatus'
import { setPortalToken } from './api'

const sessionKey = 'smart-bus-portal-session'

const readSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem(sessionKey))
  } catch {
    return null
  }
}

function ProtectedRoute({ role, children }) {
  const session = readSession()
  if (!session || session.role !== role || !session.token) {
    return <Navigate to={`/${role}/login`} replace />
  }
  setPortalToken(session.token)
  return children
}

function AppLayout() {
  const location = useLocation()
  const isTrackingPage = location.pathname === '/track'

  return (
    <>
      {!isTrackingPage && <TopNav />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/passenger" element={<PassengerPortal />} />
        <Route path="/driver/login" element={<AccessGate role="driver" />} />
        <Route path="/admin/login" element={<AccessGate role="admin" />} />
        <Route path="/driver" element={<ProtectedRoute role="driver"><Dashboard portal="driver" /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><Dashboard portal="admin" /></ProtectedRoute>} />
        <Route path="/reporting" element={<ProtectedRoute role="driver"><Reporting /></ProtectedRoute>} />
        <Route path="/driver-register" element={<ProtectedRoute role="driver"><DriverRegister /></ProtectedRoute>} />
        <Route path="/goes-on-route" element={<ProtectedRoute role="driver"><GoesOnRoute /></ProtectedRoute>} />
        <Route path="/came-on-route" element={<ProtectedRoute role="driver"><CameOnRoute /></ProtectedRoute>} />
        <Route path="/check-out" element={<ProtectedRoute role="driver"><CheckOut /></ProtectedRoute>} />
        <Route path="/admin/live" element={<ProtectedRoute role="admin"><AdminStatus type="live" /></ProtectedRoute>} />
        <Route path="/admin/drivers" element={<ProtectedRoute role="admin"><AdminStatus type="drivers" /></ProtectedRoute>} />
        <Route path="/admin/buses" element={<ProtectedRoute role="admin"><AdminStatus type="buses" /></ProtectedRoute>} />
        <Route path="/extra-bus" element={<ProtectedRoute role="admin"><ExtraBus /></ProtectedRoute>} />
        <Route path="/extra-bus-result" element={<ProtectedRoute role="admin"><ExtraBusResult /></ProtectedRoute>} />
        <Route path="/track" element={<Tracking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_45%)]" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative"><BrowserRouter><AppLayout /></BrowserRouter></div>
      </div>
    </div>
  )
}
