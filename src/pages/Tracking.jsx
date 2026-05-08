import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Navigation, Square } from 'lucide-react'
import api from '../api'

export default function Tracking() {
  const [searchParams] = useSearchParams()
  const tripId = searchParams.get('tripId')
  const [trip, setTrip] = useState(null)
  const [message, setMessage] = useState('Open this page on the driver phone, then tap Start Tracking.')
  const [error, setError] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const watchIdRef = useRef(null)

  const canTrack = useMemo(() => trip && trip.status === 'active', [trip])

  useEffect(() => {
    if (!tripId) {
      setError('Invalid tracking link. Trip ID is missing.')
      return
    }

    const loadTrip = async () => {
      setError(null)
      try {
        const response = await api.get(`/trip/${tripId}`)
        setTrip(response.data)
        if (response.data.status === 'completed') {
          setMessage('Tracking already ended for this trip.')
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load tracking link.')
      }
    }

    loadTrip()
  }, [tripId])

  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  const stopLocalTracking = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
  }

  const startTracking = () => {
    setError(null)

    if (!canTrack) {
      setError('This trip is not active.')
      return
    }

    if (!navigator.geolocation) {
      setError('This phone does not support location tracking.')
      return
    }

    if (!window.isSecureContext) {
      setError('Location needs HTTPS on mobile. Open this tracking link using a secure HTTPS URL.')
      return
    }

    setMessage('Starting location tracking...')
    setIsTracking(true)

    watchIdRef.current = navigator.geolocation.watchPosition(
      async position => {
        const { latitude, longitude } = position.coords

        try {
          await api.post('/location/update', {
            tripId,
            latitude,
            longitude
          })
          setMessage('Tracking is active. Keep this page open until the trip ends.')
          setError(null)
        } catch (err) {
          setError(err?.response?.data?.message || 'Unable to send location to server.')
        }
      },
      geoError => {
        stopLocalTracking()
        setError(geoError.message || 'Please allow location permission and try again.')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      }
    )
  }

  const endTracking = async () => {
    if (!tripId || isEnding) {
      return
    }

    setError(null)
    setIsEnding(true)
    stopLocalTracking()

    try {
      const response = await api.post('/end-trip', { tripId })
      setTrip(response.data.trip)
      setMessage('Tracking ended. You can close this page.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to end tracking.')
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-5 py-8 text-white">
      <section className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/15">
            <Navigation className="h-7 w-7 text-indigo-300" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">Driver Tracking</p>
        </div>

        {error && (
          <div className="mb-4 flex gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-300" />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-5 flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-300" />
            <p>{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            disabled={!canTrack || isTracking || isEnding}
            onClick={startTracking}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            <Navigation className="h-5 w-5" />
            {isTracking ? 'Tracking Started' : 'Start Tracking'}
          </button>

          <button
            type="button"
            disabled={!tripId || isEnding || trip?.status === 'completed'}
            onClick={endTracking}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {isEnding ? (
              <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Square className="h-5 w-5" />
            )}
            End Tracking
          </button>
        </div>
      </section>
    </main>
  )
}
