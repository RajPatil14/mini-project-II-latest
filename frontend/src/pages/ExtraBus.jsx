import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, ChevronDown, ImagePlus, UploadCloud, XCircle, Zap } from 'lucide-react'
import api from '../api'

export default function ExtraBus() {
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { api.get('/routes').then(response => setRoutes(response.data)).catch(() => {}) }, [])

  const addImages = event => {
    const files = Array.from(event.target.files || [])
    setImages(current => [...current, ...files].slice(0, 4))
    event.target.value = ''
  }

  const evaluate = async () => {
    if (!selectedRoute) return alert('Please select a route first.')
    if (images.length !== 4) return alert('Please upload exactly 4 images for evaluation.')
    setLoading(true)
    const formData = new FormData()
    formData.append('routeId', selectedRoute)
    images.forEach(image => formData.append('images', image))
    try {
      const response = await api.post('/extra-bus/evaluate', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/extra-bus-result', { state: { result: response.data } })
    } catch (err) {
      alert(err?.response?.status === 401 ? 'Your admin session has expired. Please sign in again.' : err?.response?.data?.message || 'Evaluation failed. Make sure the backend is running.')
    } finally { setLoading(false) }
  }

  return <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6"><section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl"><div className="border-b border-white/10 bg-gradient-to-r from-indigo-500/15 to-violet-500/5 p-8 sm:p-10"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-indigo-300"><Zap className="h-4 w-4" />Admin portal · AI decision tool</p><h1 className="mt-4 text-4xl font-bold text-white">Extra Bus Allocation</h1><p className="mt-3 max-w-2xl text-slate-300">Upload four crowd images for a route. YOLO estimates passenger demand, then checks whether an available driver and bus can be allocated.</p></div><div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[280px_1fr]"><aside className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"><div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300"><Activity className="h-5 w-5" /></span><div><h2 className="font-semibold text-white">Evaluation setup</h2><p className="text-xs text-slate-400">Choose a route first</p></div></div><label className="mt-7 block text-sm font-medium text-slate-200">Route<div className="relative mt-2"><select value={selectedRoute} onChange={event => setSelectedRoute(event.target.value)} className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400"><option value="">Select route</option>{routes.map(route => <option key={route.id} value={route.id}>{route.name || route.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-5 w-5 text-slate-400" /></div></label></aside><section><h2 className="text-xl font-semibold text-white">Upload crowd images</h2><p className="mt-1 text-sm text-slate-400">Add exactly four clear JPEG or PNG images.</p><button type="button" onClick={() => fileInputRef.current?.click()} className="mt-5 flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-400/30 bg-indigo-500/5 px-6 py-12 transition hover:border-indigo-300 hover:bg-indigo-500/10"><span className="rounded-2xl bg-indigo-500/15 p-4 text-indigo-300"><UploadCloud className="h-8 w-8" /></span><span className="mt-4 font-semibold text-white">Choose up to 4 images</span><span className="mt-1 text-sm text-slate-400">Click to browse from this device</span></button><input ref={fileInputRef} onChange={addImages} type="file" accept="image/*" multiple className="hidden" />{images.length > 0 && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{images.map((image, index) => <div key={`${image.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"><img src={URL.createObjectURL(image)} alt={`Uploaded crowd ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => setImages(current => current.filter((_, imageIndex) => imageIndex !== index))} className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-1.5 text-white opacity-0 transition group-hover:opacity-100"><XCircle className="h-5 w-5" /></button></div>)}</div>}<button onClick={evaluate} disabled={loading} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <ImagePlus className="h-5 w-5" />}{loading ? 'Analyzing crowd demand…' : `Analyze ${images.length}/4 images`}</button></section></div></section></main>
}
