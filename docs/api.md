# Waste2Farm — API Documentation

## Base URL
```
http://localhost:3000
```

All endpoints are proxied through the API Gateway.

---

## Authentication

### POST `/api/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@hotel.com",
  "password": "securepass123",
  "role": "generator",
  "phone": "+919876543210",
  "city": "Hyderabad",
  "location": {
    "type": "Point",
    "coordinates": [78.4867, 17.3850]
  }
}
```

**Roles:** `generator`, `buyer`, `driver`, `admin`

**Response:** `201`
```json
{
  "success": true,
  "data": { "user": {...}, "token": "eyJhbG..." }
}
```

---

### POST `/api/auth/login`
**Body:** `{ "email": "...", "password": "..." }`
**Response:** `{ "success": true, "data": { "user": {...}, "token": "..." } }`

---

### GET `/api/auth/me`
Get current user profile. **Requires:** Bearer token.

---

## Waste Listings

### GET `/api/waste`
Get listings with filters.

**Query Params:** `type`, `city`, `status`, `page`, `limit`, `sort`

### GET `/api/waste/nearby`
Geospatial search for nearby listings.

**Query Params:** `lng`, `lat`, `radius` (km), `type`

### GET `/api/waste/:id`
Get single listing (increments view count).

### POST `/api/waste`
Create listing. **Role:** `generator`, `admin`

**Body:**
```json
{
  "type": "vegetable",
  "quantity": 50,
  "unit": "kg",
  "price": 200,
  "location": { "type": "Point", "coordinates": [78.4867, 17.3850] },
  "pickupTime": "2026-03-12T20:00:00Z",
  "city": "Hyderabad",
  "description": "Fresh vegetable waste from restaurant"
}
```

### PUT `/api/waste/:id`
Update listing. **Role:** owner only.

### DELETE `/api/waste/:id`
Delete listing. **Role:** owner only.

---

## Orders

### POST `/api/orders`
Create order. **Role:** `buyer`

**Body:**
```json
{
  "listingId": "65a1b2c3d4e5f6...",
  "generatorId": "65a1b2c3d4e5f6...",
  "quantity": 50,
  "price": 200,
  "deliveryFee": 80,
  "pickupLocation": { "type": "Point", "coordinates": [78.4867, 17.3850] },
  "deliveryLocation": { "type": "Point", "coordinates": [78.3, 17.2] }
}
```

### GET `/api/orders`
Get orders for current user (filtered by role).

### GET `/api/orders/:id`
Get single order with populated references.

### PATCH `/api/orders/:id/status`
Update order status. **Role:** `driver`, `admin`, `generator`

**Valid transitions:**
```
pending → confirmed → driver_assigned → picked_up → in_transit → delivered → completed
Any state → cancelled
```

### POST `/api/orders/:id/rate`
Rate completed order. **Role:** `buyer`

---

## Logistics

### POST `/api/logistics/assign`
Assign driver to order. **Role:** `admin`

### GET `/api/logistics/nearby-drivers?lng=...&lat=...`
Find available drivers near location.

### PATCH `/api/logistics/task/:id/status`
Update driver task status. **Role:** `driver`

### PATCH `/api/logistics/task/:id/location`
Update driver's live GPS location. **Role:** `driver`

### GET `/api/logistics/driver/:driverId/tasks`
Get driver's task history.

---

## Payments

### POST `/api/payments/create`
Create Razorpay payment order.

### POST `/api/payments/verify`
Verify Razorpay payment signature.

### POST `/api/payments/:id/release`
Release escrow payment. **Role:** `admin`

### POST `/api/payments/:id/refund`
Refund payment. **Role:** `admin`

### GET `/api/payments/order/:orderId`
Get payment for an order.

---

## Analytics

### GET `/api/analytics/dashboard`
Get sustainability dashboard stats.
**Query:** `city`, `period`, `months`

### GET `/api/analytics/cities`
City-level breakdown. **Role:** `admin`

### GET `/api/analytics/waste-types`
Waste type distribution.

### POST `/api/analytics/record`
Record analytics data point. **Role:** `admin` (internal use)

---

## Notifications

### GET `/api/notifications`
Get user's notifications.
**Query:** `page`, `limit`, `unreadOnly`

### PATCH `/api/notifications/:id/read`
Mark notification as read.

### PATCH `/api/notifications/read-all`
Mark all notifications as read.

---

## Socket.io Events (Logistics Service)

Connect to: `ws://localhost:3004`

### Client → Server
| Event | Data | Description |
|-------|------|-------------|
| `driver:join` | `driverId` | Driver enters tracking mode |
| `order:subscribe` | `orderId` | Subscribe to order updates |
| `driver:location` | `{ driverId, orderId, coordinates, heading, speed }` | Driver location update |
| `driver:eta` | `{ orderId, etaMinutes }` | ETA update |
| `order:status` | `{ orderId, status, eta }` | Status change |

### Server → Client
| Event | Data | Description |
|-------|------|-------------|
| `tracking:location` | `{ driverId, coordinates, heading, speed, timestamp }` | Live location |
| `tracking:status` | `{ orderId, status, eta, timestamp }` | Order status change |
| `tracking:eta` | `{ orderId, etaMinutes, timestamp }` | ETA update |

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
