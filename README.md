# POS Frontend

A role-based Point of Sale (POS) frontend application built with **React 18**, **Redux Toolkit**, and **Vite 5**. Supports three user roles — **Admin**, **Manager**, and **Cashier** — each with a dedicated dashboard and feature set.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **State Management** | Redux Toolkit + react-redux |
| **Routing** | React Router 7 |
| **HTTP Client** | Axios |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Alerts** | SweetAlert2 |
| **Runtime** | Node.js 22 (Alpine in Docker) |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   index.html                         │
│   ┌──────────────────────────────────────────────┐   │
│   │              src/main.jsx                     │   │
│   │   ┌────────────────────────────────────┐      │   │
│   │   │          src/App.jsx                │      │   │
│   │   │  <Provider store={store}>           │      │   │
│   │   │    <AppRouter />                    │      │   │
│   │   │  </Provider>                        │      │   │
│   │   └────────────────────────────────────┘      │   │
│   └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   src/router/                        │
│  routes.js ──> AppRouter.jsx ──> RoleGuard.jsx      │
│       │                                              │
│       ├── /login  ──> LoginPage                      │
│       ├── /admin/* ──> AdminLayout  (role: admin)    │
│       ├── /manager/* ──> ManagerLayout (role: mgr)   │
│       ├── /pos/* ──> CashierLayout  (role: cashier)  │
│       └── /403 ──> ErrorPage                         │
└─────────────────────────────────────────────────────┘

┌─────────────── Data Flow ───────────────────────────┐
│  Page Component                                     │
│       │ dispatch(createAsyncThunk)                   │
│       ▼                                             │
│  *Slice.js (Redux reducer)                          │
│       │                                             │
│       ▼                                             │
│  *Service.js (Axios call via axiosClient)           │
│       │                                             │
│       ▼                                             │
│  Backend API ────> Redux store updated              │
│       │                                             │
│       ▼                                             │
│  Component re-renders (useSelector)                  │
└─────────────────────────────────────────────────────┘
```

### Key Patterns

- **Feature Modules** — Each domain (`auth`, `users`, `branches`, `productItem`, `pos`, etc.) lives in `src/modules/<name>/` with its own service, Redux slice, and page components.
- **Role-Based Routing** — `RoleGuard` wraps protected routes; unauthorized users are redirected to `/403`.
- **API Layer** — A single Axios instance (`src/api/axiosClient.js`) attaches JWT tokens via an interceptor and handles 401 responses by logging out.
- **Custom Hooks** — 51 hooks in `src/hooks/` encapsulate data fetching, pagination, filtering, and role-checking logic.

---

## Project Structure

```
pos-frontend/
├── public/                     # Static assets (favicon)
├── src/
│   ├── api/
│   │   └── axiosClient.js      # Axios instance with interceptors
│   ├── app/
│   │   └── store.js            # Redux store (14 slices)
│   ├── components/             # Shared components
│   │   ├── AdminLayout.jsx     # Admin wrapper (sidebar + header)
│   │   ├── SideBar.jsx         # Admin sidebar navigation
│   │   └── StepNav.jsx         # Breadcrumb navigation
│   ├── hooks/                  # 51 custom React hooks
│   ├── layouts/                # Role-based layout wrappers
│   │   ├── CashierLayout.jsx
│   │   └── ManagerLayout.jsx
│   ├── modules/                # Feature modules (domain-driven)
│   │   ├── auth/               # Login & authentication
│   │   ├── users/              # User management (admin)
│   │   ├── branches/           # Branch CRUD & reports
│   │   ├── category/           # Categories & subcategories
│   │   ├── productList/        # Product list master data
│   │   ├── productItem/        # Product item (SKU) management
│   │   ├── productUnit/        # Stock per branch
│   │   ├── productUnitLog/     # Stock change audit trail
│   │   ├── stockTransfer/      # Stock transfers between branches
│   │   ├── issueItem/          # Issue items to branches
│   │   ├── bankAccount/        # Bank account CRUD & history
│   │   ├── notification/       # Notifications bell & list
│   │   ├── pos/                # Point of Sale (cashier)
│   │   ├── adminDashboard/     # Admin analytics
│   │   ├── managerDashboard/   # Manager analytics
│   │   └── voucher/            # Voucher/receipt views
│   ├── pages/                  # Top-level page wrappers
│   ├── router/                 # Route definitions & guards
│   │   ├── AppRouter.jsx
│   │   ├── RoleGuard.jsx
│   │   └── routes.js
│   └── utils/                  # Helpers (roles, redirects)
│       ├── roles.js
│       └── roleRedirect.js
├── Dockerfile                  # Node 22 Alpine container
├── docker-compose.yml          # Single-service Docker Compose
├── vite.config.js              # Vite config (React + Tailwind)
├── package.json
└── .env                        # Environment variables
```

---

## Features by Role

### Admin
- User management (CRUD)
- Branch management & reports
- Category & subcategory CRUD
- Product list & item management
- Stock unit management & audit logs
- Stock transfers (create, review)
- Issue items to branches
- Bank account management & history
- Dashboard with business metrics

### Manager
- Dashboard with branch-level metrics
- Stock transfers (create, receive)
- Issue items management
- Product units oversight
- Bank account history
- Voucher/receipt views

### Cashier
- Point of Sale (create vouchers)
- Voucher history
- Today's sales
- Debts management
- Cashier dashboard

---

## Setup & Installation

### Prerequisites

- Node.js 22+
- Docker & Docker Compose (optional)

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_BACKEND_API="http://localhost:4000/api"
```

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev
```

### Production Build

```bash
npm run build
npm run preview   # Preview the production build locally
```

### Docker

#### Build & Run

```bash
docker compose up --build
```

The app will be available at **http://localhost:5173**.

#### What happens under the hood

- A Node 22 Alpine container is built from the `Dockerfile`
- Source code is mounted as a volume for hot-reload
- `node_modules` is isolated via a named volume (not overwritten by the host)
- The Vite dev server runs on `0.0.0.0:5173` inside the container, mapped to host port `5173`

#### Stop

```bash
docker compose down
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint across the project |

---

## Linting

ESLint 9 with flat config. Plugins included for React, React Hooks, and React Refresh.

```bash
npm run lint
```
