import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BusFront, MapPinned, UsersRound } from 'lucide-react'
import { io } from 'socket.io-client'
import api from '../api'
import { routes as staticRoutes } from '../routes'
import LiveBusMap from '../components/LiveBusMap'

const labels = { live: ['Live fleet tracking', MapPinned], drivers: ['Driver status', UsersRound], buses: ['Bus status', BusFront] }

export default function AdminStatus({ type }) {
  const [routeId, setRouteId] = useState('')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [title, Icon] = labels[type]

  const loadRouteStatus = useCallback(async () => {
    if (!routeId) return
    setLoading(true); setError('')
    const endpoint = type === 'live' ? `/locations/active/${routeId}` : `/admin/${type}/${routeId}`
    try {
      const response = await api.get(endpoint)
      setItems(response.data)
    } catch (err) {
      setError(err?.response?.status === 401 ? 'Your admin session has expired. Sign in again to load route data.' : err?.response?.data?.message || 'Unable to load route data. Check that the backend is running on port 5000.')
    } finally { setLoading(false) }
  }, [routeId, type])

  useEffect(() => { void loadRouteStatus() }, [loadRouteStatus])

  useEffect(() => {
    if (type !== 'live' || !routeId) return undefined
    const socket = io(api.defaults.baseURL, { transports: ['websocket', 'polling'] })
    const updateLocation = location => setItems(current => [...current.filter(item => item.tripId !== location.tripId), location])
    socket.on('connect', () => socket.emit('subscribe-route', routeId))
    socket.on('location:update', updateLocation)
    socket.on('location:remove', ({ tripId }) => setItems(current => current.filter(item => item.tripId !== tripId)))
    const interval = setInterval(() => void loadRouteStatus(), 15000)
    return () => { socket.disconnect(); clearInterval(interval) }
  }, [type, routeId, loadRouteStatus])

  const selectRoute = event => { setRouteId(event.target.value); setItems([]); setError('') }
  const emptyMessage = type === 'live' ? 'No active buses with a recent location on this route. Start a trip and allow GPS tracking to see a bus here.' : `No ${type} found on this route.`

  return <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"><section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Admin portal</p><h1 className="mt-3 flex items-center gap-3 text-3xl font-semibold text-white"><Icon className="text-amber-300" />{title}</h1></div><select value={routeId} onChange={selectRoute} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option value="">Select route</option>{staticRoutes.map(route => <option key={route.id} value={route.id}>{route.label}</option>)}</select></div>{error && <p className="mt-6 rounded-xl bg-rose-500/10 p-3 text-rose-200">{error}{error.includes('expired') && <Link className="ml-2 font-semibold underline" to="/admin/login">Sign in</Link>}</p>}{loading && <p className="mt-8 text-slate-400">Loading route status…</p>}{routeId && !loading && (type === 'live' ? <div className="mt-8 overflow-hidden rounded-2xl border border-white/10"><div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-4"><p className="font-medium text-white">Route live map</p><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">{items.length} active bus{items.length === 1 ? '' : 'es'}</span></div><div className="h-[480px] bg-slate-800"><LiveBusMap locations={items} /></div>{!items.length && <p className="border-t border-white/10 p-4 text-center text-sm text-slate-400">{emptyMessage}</p>}</div> : <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">{items.length ? <table className="w-full text-left text-sm"><thead className="bg-white/5 text-slate-400"><tr>{type === 'drivers' ? <><th className="p-4">Driver</th><th className="p-4">Attendance</th><th className="p-4">Status</th></> : <><th className="p-4">Bus number</th><th className="p-4">Route</th><th className="p-4">Status</th></>}</tr></thead><tbody>{items.map(item => <tr key={item._id} className="border-t border-white/10 text-slate-200">{type === 'drivers' ? <><td className="p-4 font-medium">{item.name}</td><td className="p-4 capitalize">{item.attendanceStatus}</td><td className="p-4 capitalize">{item.status}</td></> : <><td className="p-4 font-medium">{item.number}</td><td className="p-4">{item.routeId}</td><td className="p-4 capitalize">{item.status}</td></>}</tr>)}</tbody></table> : <p className="p-10 text-center text-slate-500">{emptyMessage}</p>}</div>)}</section></main>
}
