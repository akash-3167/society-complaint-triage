# Society Complaint Triage 🏢⚡

> **Intelligent, AI-Powered Housing Society Complaint Management System**  
> Converts noisy resident complaints in English, Hindi, and Hinglish into structured, prioritized, and clustered tickets for managing committee volunteers.

---

## 🚀 Deployed on Vercel

The application is deployed on **Vercel** with client-side SPA routing and full role-based access control.

* **Frontend Framework**: Vite + React 19
* **Live Routes**:
  * `/` & `/committee` — Committee Triage Dashboard (Clusters, Urgency, Staff Assignment)
  * `/resident` — Resident Portal (Submit & Track)
  * `/submit` — AI-Powered Complaint Submission (English/Hindi/Hinglish)
  * `/my-complaints` — Resident Complaint History
  * `/complaints/:id` — Complaint Details, Resolution, & Staff Assignment

---

## 🌟 Implemented Phases

### ✅ Phase 1: Foundation & Architecture
* **React 19 + Vite** frontend with Tailwind CSS v3 and Lucide React icons.
* **Node.js + Express** REST backend with modular controllers, routes, and middleware.
* **Dual Database Architecture**: Supabase PostgreSQL database integration with automatic, zero-config in-memory fallback and realistic pre-seeded society tickets.
* Reusable design system: `StatusBadge`, `UrgencyBadge`, `CategoryBadge`, `DashboardStat`, `EmptyState`, and `LoadingState`.

### ✅ Phase 2: Gemini 3.8 Flash AI Complaint Triage
* Integrated **Google Gemini 3.8 Flash** via `@google/genai`.
* Automatic multilingual triage parsing messy complaints in **English, Hindi, and Hinglish** (e.g. *"Main pump motor trip ho gaya hai, paani nahi aa raha"*).
* Automatically extracts and infers:
  * **Category**: `WATER`, `LIFT`, `PARKING`, `NOISE`, `CLEANING`, `MAINTENANCE`, `OTHER`
  * **Urgency**: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`
  * **Detected Language**: e.g., `English`, `Hindi`, `Hinglish`
  * **AI Executive Summary**: One-sentence operational summary
  * **Suggested Action**: Practical next step for the managing committee
* Built-in resilience: Free-tier rate limit handling with automatic fallback analysis.

### ✅ Phase 3: Intelligent Complaint Clustering & Duplication Detection
* Algorithmic grouping of duplicate or related complaints across ~100 flats.
* Identifies shared infrastructure failures (e.g. 5 flats reporting low water pressure on the same wing pump).
* `/api/complaints/clusters` endpoint with summary cards on the Committee Dashboard.
* Displays **affected flats list**, **root cause summary**, and enables single-click filtering of all tickets in a cluster.

### ✅ Phase 4: Committee Resolution Workflow
* Complete ticket lifecycle: `OPEN` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `RESOLVED`.
* Quick action **"✓ Resolve"** button directly on complaint cards and table rows.
* Resolution banner displaying resolved status, assigned personnel, and timestamps.
* Real-time metrics updating Open, Critical, High, and Resolved ticket counters.

### ✅ Phase 5A: Role-Based Access Control (RBAC) & Complaint Assignment
* **Strict Role Separation**:
  * **Resident**: Can submit complaints, track tickets for their own flat, view AI analysis. Cannot view other flats or society-wide clusters.
  * **Committee**: Has full visibility across all 104 flats, staff assignment controls, cluster management, and status updates.
* **Bearer Token Authentication**: Simulated JWT demo tokens enforced in backend middleware (`server/middleware/auth.js`).
* **Predefined Staff Assignment**:
  * `Ramesh (Plumber)`
  * `Suresh (Electrician)`
  * `Anita (Housekeeping Lead)`
  * `Johnson Lifts Support`
  * `Security Team`
* **Assignment UI**:
  * **Dashboard**: Instant assignment dropdowns and **"Assign Staff"** modal on Cards and Table views.
  * **Complaint Details**: Dedicated **"Assign Complaint"** action inside the "Complaint Status & Progress" panel.

---

## 🏃 How to Run

### Option 1: Local Development

#### 1. Prerequisites
* **Node.js** v18+ (tested on Node v20 & v22)
* **npm** v9+

#### 2. Install Dependencies
```bash
# Install root, server, and client dependencies in one command:
npm run install:all
```

#### 3. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Gemini AI Key (stored only on server)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash

# Optional: Supabase (falls back to in-memory database if empty)
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

#### 4. Start the Application
You can run both client and server concurrently from the root:
```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:server

# Terminal 2: Frontend Client (Port 5173)
npm run dev:client
```
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
* **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Option 2: Running on Vercel

The frontend is optimized for **Vercel** deployment with single-page app (SPA) rewrite rules.

#### Step 1: Connect GitHub Repository to Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** ➔ **Project** and import this repository.

#### Step 2: Configure Project Settings on Vercel
* **Framework Preset**: `Vite`
* **Root Directory**: `client`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`

#### Step 3: Set Environment Variables on Vercel
Under **Project Settings ➔ Environment Variables**, add:
| Variable Name | Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://your-backend-url.com/api` | The base URL of your deployed Express backend |

> **Note**: If running in local or demo preview mode without a separate backend URL, `VITE_API_URL` defaults to `http://localhost:5000/api`.

#### Step 4: SPA Routing Support
The `client/vercel.json` file ensures that direct visits and page refreshes on subroutes (`/committee`, `/resident`, `/complaints/:id`) route directly to `index.html`:
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

#### Deploying the Backend (Express API)
For a complete cloud deployment, host the Node.js backend (`/server`) on:
* **Render**, **Railway**, **Fly.io**, or **Vercel Serverless Functions**.
* In your backend environment settings, provide `GEMINI_API_KEY` and set `CLIENT_URL` to your Vercel deployment URL (e.g. `https://society-complaint-triage.vercel.app`).

---

## 🎭 Instant Demo Role Switcher

For live hackathon presentations and testing, the navigation bar includes an **instant role switcher**:
* **Sunil Mehta (Committee Member)**: View society-wide triage, cluster cards, assign staff, and mark resolved.
* **Akash (Resident — Flat B-402)**: View personal tickets, submit complaints, and track resolution.

---

## 📁 Project Directory Structure

```
society-complaint-triage/
├── client/                     # Frontend React 19 + Vite
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AssignStaffModal.jsx   # Staff assignment modal
│   │   │   ├── ComplaintCard.jsx      # Card with actions & badges
│   │   │   ├── Navbar.jsx             # Role-specific navigation & switcher
│   │   │   ├── Sidebar.jsx            # Quick filters & society overview
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── UrgencyBadge.jsx
│   │   │   └── CategoryBadge.jsx
│   │   ├── constants/
│   │   │   └── staff.js        # Predefined staff list & recommendations
│   │   ├── context/
│   │   │   └── AuthContext.jsx # RBAC state & token persistence
│   │   ├── pages/
│   │   │   ├── CommitteeDashboard.jsx # Committee triage & clusters
│   │   │   ├── ComplaintDetails.jsx   # Ticket detail & assignment
│   │   │   ├── ResidentDashboard.jsx  # Resident landing
│   │   │   ├── MyComplaints.jsx       # Resident personal tickets
│   │   │   └── SubmitComplaint.jsx    # Complaint submission with AI
│   │   ├── services/
│   │   │   └── api.js          # Authenticated fetch client
│   │   ├── App.jsx             # Role-guarded route definitions
│   │   └── main.jsx
│   ├── vercel.json             # Vercel SPA rewrite rules
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js + Express
│   ├── config/
│   │   ├── supabase.js         # Supabase client loader
│   │   └── schema.sql          # PostgreSQL DDL
│   ├── controllers/
│   │   ├── authController.js   # Demo login & session verification
│   │   └── complaintController.js # Triage, status, & assignment APIs
│   ├── middleware/
│   │   └── auth.js             # Bearer token verification & RBAC guard
│   ├── models/
│   │   └── complaintModel.js   # DB/in-memory store with demo seed data
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth
│   │   └── complaintRoutes.js  # /api/complaints
│   ├── services/
│   │   ├── aiTriage.js         # Gemini 3.8 Flash inference & fallback
│   │   └── clustering.js       # Complaint clustering algorithm
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── .env.example
├── package.json                # Root automation scripts
└── README.md
```

---

## 🧪 Testing & Verification

Automated test suites are included to verify functionality:
```bash
# Verify Phase 5A Role-Based Access Control:
node scratch/test_phase5a_rbac.js

# Verify Committee Complaint Assignment Workflow:
node scratch/test_committee_assignment.js

# Build client production bundle:
npm --prefix client run build
```

---

## 📜 License
MIT License. Built for modern residential communities.
