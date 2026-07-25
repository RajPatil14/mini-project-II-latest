# Real-time bus tracking

The driver phone and dispatch dashboard can use different networks. Both only
need internet access to the same deployed backend and frontend URLs.

## How it works

1. Dispatch starts a trip and receives a token-protected tracking link.
2. The driver opens the link over mobile data or any Wi-Fi network and grants
   location permission.
3. The frontend sends GPS coordinates to the public backend.
4. The backend saves locations to MongoDB and broadcasts them with Socket.IO.
5. The dispatcher map receives the update immediately; a 15-second API poll is
   retained as a fallback.

## Local development

```powershell
npm --prefix frontend install
npm --prefix backend install
Copy-Item backend/.env.example backend/.env
npm --prefix backend run dev
npm --prefix frontend run dev
```

The local frontend defaults to `http://<your-computer-ip>:5000`. To use a
different API URL, set `VITE_API_URL` in `frontend/.env`.

## Production deployment

Deploy the folders independently:

| Service | Folder | Build command | Start command |
| --- | --- | --- | --- |
| Frontend | `frontend` | `npm install && npm run build` | Static hosting (`dist`) |
| Backend | `backend` | `npm install` | `npm run start` |

Set these backend environment variables:

```dotenv
MONGO_URI=mongodb+srv://...
FRONTEND_URL=https://your-frontend.example.com
CORS_ORIGINS=https://your-frontend.example.com
PORT=5000
```

Set this frontend build environment variable:

```dotenv
VITE_API_URL=https://your-backend.example.com
```

The backend host must support HTTPS and WebSockets. The frontend must be served
over HTTPS so mobile browsers can access GPS. Treat the tracking link as a
password because it authorizes GPS updates for that trip.
