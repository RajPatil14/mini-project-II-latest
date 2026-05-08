import { useState } from 'react'
import api from '../api'
import { routes } from '../routes'

export default function DriverRegister() {
  const [routeId, setRouteId] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (!routeId || !name.trim() || !phone.trim()) {
      setError('Please select route, enter driver name, and WhatsApp number.')
      return
    }

    setLoading(true)

    try {
      await api.post('/drivers/register', {
        routeId,
        name,
        phone
      })

      setMessage('Driver registered successfully.')
      setName('')
      setPhone('')
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Unable to register driver.'
      setError(errorMessage)
      if (err?.response?.status === 409) {
        alert(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_35px_60px_-35px_rgba(15,23,42,0.6)] sm:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Driver Register</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Register driver by route</h2>
          </div>
          <p className="max-w-xl text-slate-600">Add a driver with WhatsApp number and assign them to the selected route.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Route</h3>
            <p className="mt-2 text-sm text-slate-500">Select the route where this driver will be allocated.</p>

            <label className="mt-6 block text-sm font-medium text-slate-700">Route</label>
            <select
              value={routeId}
              onChange={event => setRouteId(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500"
            >
              <option value="">Select route</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>{route.label}</option>
              ))}
            </select>

            <div className="mt-6 space-y-3">
              {message && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-emerald-700 shadow-sm">{message}</div>}
              {error && <div className="rounded-3xl bg-rose-50 px-4 py-3 text-rose-700 shadow-sm">{error}</div>}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Driver details</h3>
              <p className="mt-1 text-sm text-slate-500">Enter the driver name and active WhatsApp number.</p>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Driver name</label>
                <input
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Enter driver name"
                  className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">WhatsApp number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  placeholder="Enter WhatsApp number"
                  className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full justify-center rounded-3xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition duration-200 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  )
}
