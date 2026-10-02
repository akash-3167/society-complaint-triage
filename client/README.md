# Society Complaint Triage — Frontend Client 🏢⚡

Modern React 19 + Vite frontend for residential housing society complaint management and triage.

---

## 🚀 Vercel Deployment Guide

This directory is ready for deployment on **Vercel**.

### Configuration
* **Framework Preset**: `Vite`
* **Root Directory**: `client`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`

### Environment Variables
Configure under **Project Settings ➔ Environment Variables** in Vercel:

| Variable | Recommended Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://your-backend.domain/api` | Base URL of the backend API (defaults to `http://localhost:5000/api`) |

### Single-Page Application (SPA) Routing
A `vercel.json` file is included in this directory to handle client-side routing rewrites so that page reloads on deep links (`/committee`, `/resident`, `/complaints/:id`) never trigger 404 errors:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🏃 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 4. Build for Production
```bash
npm run build
```

---

## 🌟 Key Features

* **Committee Dashboard**: Live metrics, urgency filtering, AI cluster detection, and staff assignment.
* **Resident Portal**: Seamless ticket logging in English, Hindi, or Hinglish with live status tracking.
* **Staff Assignment**: Integrated assignment modal with predefined society staff list.
* **Demo Role Switcher**: Quick toggle between Committee and Resident roles in the navigation bar.
