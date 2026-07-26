import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30]
})

function MapController({ locations }) {
  const map = useMap()
  useEffect(() => {
    const timers = [0, 200, 500].map(delay => setTimeout(() => map.invalidateSize(), delay))
    return () => timers.forEach(clearTimeout)
  }, [map])
  useEffect(() => {
    if (locations.length === 1) map.setView([locations[0].latitude, locations[0].longitude], 14)
    if (locations.length > 1) map.fitBounds(L.latLngBounds(locations.map(item => [item.latitude, item.longitude])), { padding: [40, 40] })
  }, [locations, map])
  return null
}

export default function LiveBusMap({ locations }) {
  return <MapContainer center={[16.705, 74.243]} zoom={12} style={{ height: '100%', minHeight: '420px', width: '100%' }}><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapController locations={locations} />{locations.map(location => <Marker key={location.tripId} position={[location.latitude, location.longitude]} icon={busIcon}><Popup><strong>{location.busNumber}</strong><br />Last updated: {new Date(location.timestamp).toLocaleTimeString()}</Popup></Marker>)}</MapContainer>
}
