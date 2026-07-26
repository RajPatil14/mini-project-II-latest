import { BusFront, ClipboardCheck, ImageUp, MapPinned, ShieldCheck, UserPlus, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'

const portalCards = [
  { to: '/passenger', title: 'Passenger portal', text: 'Track buses live and plan journeys with route timetables.', icon: UsersRound, tone: 'from-sky-500 to-cyan-400', tag: 'Open access' },
  { to: '/driver', title: 'Driver portal', text: 'Manage attendance, dispatch, return-to-route and checkout.', icon: BusFront, tone: 'from-violet-500 to-fuchsia-500', tag: 'Password required' },
  { to: '/admin', title: 'Admin command center', text: 'Monitor the fleet, driver status and extra-bus demand.', icon: ShieldCheck, tone: 'from-amber-400 to-orange-500', tag: 'Password required' }
]

const driverTools = [
  { to: '/reporting', title: 'Attendance', icon: ClipboardCheck }, { to: '/driver-register', title: 'Register driver', icon: UserPlus }, { to: '/goes-on-route', title: 'Start a trip', icon: BusFront }, { to: '/came-on-route', title: 'Return resources', icon: MapPinned }, { to: '/check-out', title: 'Check out', icon: ClipboardCheck }
]
const adminTools = [
  { to: '/admin/live', title: 'Live locations', icon: MapPinned }, { to: '/admin/drivers', title: 'Driver status', icon: UsersRound }, { to: '/admin/buses', title: 'Bus status', icon: BusFront }, { to: '/extra-bus', title: 'Extra bus allocation', icon: ImageUp }
]

export default function Dashboard({ portal }) {
  const tools = portal === 'driver' ? driverTools : adminTools
  if (portal) return <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"><section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl"><p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">{portal} portal</p><h1 className="mt-3 text-3xl font-semibold text-white">{portal === 'driver' ? 'Route operations at your fingertips' : 'Fleet operations command center'}</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{tools.map(tool => { const IconComponent = tool.icon; return <Link key={tool.to} to={tool.to} className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-sky-300/50 hover:bg-white/10"><IconComponent className="h-7 w-7 text-sky-300" /><p className="mt-8 font-semibold text-white">{tool.title}</p><p className="mt-2 text-sm text-slate-400">Open workspace →</p></Link> })}</div></section></main>

  return <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6"><section className="text-center"><p className="text-sm font-bold uppercase tracking-[0.32em] text-sky-300">Smart mobility operations</p><h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">One connected system for every journey.</h1><p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">Choose your portal to track buses, manage route operations, or supervise the fleet.</p></section><div className="mt-12 grid gap-6 lg:grid-cols-3">{portalCards.map(card => { const IconComponent = card.icon; return <Link key={card.to} to={card.to} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl transition hover:-translate-y-2"><div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.tone}`} /><div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-slate-950`}><IconComponent className="h-7 w-7" /></div><p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{card.tag}</p><h2 className="mt-3 text-2xl font-semibold text-white">{card.title}</h2><p className="mt-3 leading-7 text-slate-300">{card.text}</p><p className="mt-8 font-semibold text-sky-300">Enter portal →</p></Link> })}</div></main>
}
