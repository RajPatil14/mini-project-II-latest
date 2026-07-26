import { BusFront, ShieldCheck, UsersRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/passenger', label: 'Passenger', icon: UsersRound },
  { to: '/driver', label: 'Driver', icon: BusFront },
  { to: '/admin', label: 'Admin', icon: ShieldCheck }
]

export default function TopNav() {
  return (
    <header className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
      <nav className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-slate-950/80 px-5 py-4 shadow-2xl backdrop-blur-xl">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400 text-slate-950"><BusFront className="h-6 w-6" /></div>
          <div><p className="font-semibold text-white">Smart Bus System</p><p className="text-xs text-slate-400">Connected city mobility</p></div>
        </NavLink>
        <div className="flex flex-wrap items-center gap-2">
          {links.map(link => {
            const IconComponent = link.icon
            return <NavLink key={link.to} to={link.to} className={({ isActive }) => `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-sky-400 text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><IconComponent className="h-4 w-4" />{link.label}</NavLink>
          })}
        </div>
      </nav>
    </header>
  )
}
