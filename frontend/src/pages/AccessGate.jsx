import { KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setPortalToken } from '../api'

export default function AccessGate({ role }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const isAdmin = role === 'admin'

  const submit = async event => {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/access/verify', { role, password })
      sessionStorage.setItem('smart-bus-portal-session', JSON.stringify(data))
      setPortalToken(data.token)
      navigate(`/${role}`)
    } catch (err) { setError(err?.response?.data?.message || 'Unable to unlock this portal.') } finally { setLoading(false) }
  }

  return <main className="mx-auto flex min-h-[72vh] w-full max-w-xl items-center px-4 py-12"><section className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl"><div className={`h-2 ${isAdmin ? 'bg-amber-400' : 'bg-violet-400'}`} /><div className="p-8 sm:p-10"><div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isAdmin ? 'bg-amber-400/15 text-amber-300' : 'bg-violet-400/15 text-violet-300'}`}>{isAdmin ? <ShieldCheck className="h-7 w-7" /> : <KeyRound className="h-7 w-7" />}</div><p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Secure access</p><h1 className="mt-3 text-3xl font-semibold text-white">{isAdmin ? 'Admin command center' : 'Driver operations portal'}</h1><p className="mt-3 text-slate-400">Enter the assigned password to continue.</p><form className="mt-8 space-y-5" onSubmit={submit}><label className="block text-sm font-medium text-slate-200">Password<input autoFocus type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-sky-400/40 focus:ring-2" placeholder="Enter password" /></label>{error && <p className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}<button disabled={loading} className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold text-slate-950 transition disabled:opacity-60 ${isAdmin ? 'bg-amber-400 hover:bg-amber-300' : 'bg-violet-400 hover:bg-violet-300'}`}><LockKeyhole className="h-5 w-5" />{loading ? 'Verifying…' : 'Unlock portal'}</button></form></div></section></main>
}
