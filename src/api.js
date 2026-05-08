import axios from 'axios'

const defaultBaseURL =
  window.location.protocol === 'https:' || window.location.port === '5000'
    ? window.location.origin
    : `http://${window.location.hostname}:5000`

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
