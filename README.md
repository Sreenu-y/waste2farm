# 🌱 Waste2Farm

**Turn Waste Into Value** — A circular economy marketplace connecting organic waste generators with farmers, compost companies, and biogas plants.

![License](https://img.shields.io/badge/license-MIT-green) ![Node](https://img.shields.io/badge/node-18+-blue)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   API Gateway (:3000)                │
│         Rate Limiting · Proxy · CORS · Auth          │
├────────┬────────┬────────┬────────┬────────┬────────┤
│  Auth  │ Waste  │ Order  │Logist. │Payment │Analyt. │
│ :3001  │ :3002  │ :3003  │ :3004  │ :3005  │ :3006  │
├────────┴────────┴────────┴────────┴────────┴────────┤
│  Notification Service (:3007)  │  Socket.io (Live)  │
├────────────────────────────────┴────────────────────┤
│        MongoDB        │    Redis Cache    │   S3    │
└───────────────────────┴───────────────────┴─────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Node.js 18+
- MongoDB (local or cloud)

### 1. Clone & Configure
```bash
git clone https://github.com/Sreenu-y/waste2farm.git
cd waste2farm
cp .env.example .env
# Edit .env with your credentials
```

### 2. Start Services
```bash
npm install
npm run dev
```

### 3. Seed Test Data
```bash
node scripts/seed.js
```
Admin login: `admin@waste2farm.in` / `test123`

### 4. Access
| Service | URL |
|---------|-----|
| API Gateway | http://localhost:3000 |
| Admin Dashboard | Open `admin-dashboard/index.html` |
| Health Check | http://localhost:3000/health |

---

## 📦 Microservices

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | Rate limiting, routing, CORS |
| Auth Service | 3001 | JWT auth, registration, RBAC |
| Waste Service | 3002 | CRUD listings, geo-search |
| Order Service | 3003 | Order lifecycle, state machine |
| Logistics Service | 3004 | Driver matching, Socket.io tracking |
| Payment Service | 3005 | Razorpay, escrow hold/release |
| Analytics Service | 3006 | Sustainability metrics, aggregation |
| Notification Service | 3007 | Firebase FCM push notifications |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Generator** | Post waste, schedule pickup, track driver |
| **Buyer** | Browse marketplace, order waste, track delivery |
| **Driver** | Accept pickups, navigate routes, update status |
| **Admin** | Manage users, view analytics, release payments |
| **Super Admin** | All admin + city expansion, system config |

---

## 🔐 API Authentication

All API requests require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"buyer","phone":"+919876543210","city":"Hyderabad"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 📱 Mobile App UI

6 Uber/Swiggy-style screens designed via Stitch:
1. **Landing/Onboarding** — Role selection with premium dark theme
2. **Marketplace** — Swiggy-style card grid with nearby waste listings
3. **Live Tracking** — Uber-style real-time driver map
4. **Driver Pickup** — Accept/decline request with earnings display
5. **Sustainability** — Impact dashboard with eco badges
6. **Post Waste** — Clean form with photo upload

View designs: [Stitch Project](https://stitch.google.com/projects/7403339022358747129)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Cache | Redis |
| Realtime | Socket.io |
| Payments | Razorpay |
| Notifications | Firebase FCM |
| Maps | Google Maps API |
| Storage | AWS S3 |
| Containers | N/A |
| CI/CD | GitHub Actions |

---

## 📂 Project Structure

```
waste2farm/
├── services/
│   ├── shared/              # Common auth, DB, validators
│   ├── api-gateway/         # Entry point, rate limiting
│   ├── auth-service/        # JWT auth & RBAC
│   ├── waste-service/       # Waste listings CRUD
│   ├── order-service/       # Order state machine
│   ├── logistics-service/   # Driver matching & tracking
│   ├── payment-service/     # Razorpay integration
│   ├── analytics-service/   # Sustainability metrics
│   └── notification-service/# Firebase notifications
├── admin-dashboard/         # Web admin panel
├── scripts/                 # Seed data, utilities
├── docs/                    # API & schema documentation
└── .env.example
```

---

## 📄 License

MIT © 2026 Waste2Farm
