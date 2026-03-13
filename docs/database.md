# Waste2Farm — Database Schema

## Collections Overview

| Collection | Purpose | Key Indexes |
|------------|---------|-------------|
| `users` | All platform users | email, location(2dsphere), role, city |
| `wastelistings` | Marketplace listings | location(2dsphere), status+type, city+status+date |
| `orders` | Purchase orders | buyerId, generatorId, driverId+status, locations(2dsphere) |
| `drivertasks` | Driver assignments | driverId+status, orderId, locations(2dsphere) |
| `payments` | Transaction records | orderId, buyerId, razorpayOrderId |
| `analytics` | Sustainability metrics | city+date, period+date |
| `notifications` | Push notification log | userId+date, userId+isRead |

---

## Users Collection

```javascript
{
  _id: ObjectId,
  name: String,           // "Rajesh Kumar"
  email: String,          // unique, indexed
  password: String,       // bcrypt hashed (12 rounds)
  role: Enum,             // generator | buyer | driver | admin | super_admin
  phone: String,          // "+919876543210"
  city: String,           // "Hyderabad"
  avatar: String,         // S3 URL
  location: {
    type: "Point",
    coordinates: [lng, lat]  // 2dsphere indexed
  },
  isActive: Boolean,
  fcmToken: String,       // Firebase Cloud Messaging
  rating: Number,         // 0-5, default 5
  totalOrders: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `email(1)`, `role(1)`, `city(1)`, `location(2dsphere)`, `createdAt(-1)`

---

## Waste Listings Collection

```javascript
{
  _id: ObjectId,
  generatorId: ObjectId,   // ref: users
  type: Enum,              // vegetable | fruit | food | garden | dairy | grain | mixed | other
  quantity: Number,         // 50
  unit: Enum,              // kg | tons | liters
  price: Number,           // in INR
  description: String,
  status: Enum,            // available | reserved | sold | expired
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  address: String,
  city: String,
  pickupTime: Date,
  images: [String],        // S3 URLs
  aiClassification: {
    category: String,
    confidence: Number,
    spoilageRisk: Enum     // low | medium | high
  },
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `location(2dsphere)`, `{status:1, type:1}`, `{city:1, status:1, createdAt:-1}`, `{generatorId:1, createdAt:-1}`

---

## Orders Collection

```javascript
{
  _id: ObjectId,
  listingId: ObjectId,      // ref: wastelistings
  buyerId: ObjectId,        // ref: users
  generatorId: ObjectId,    // ref: users
  driverId: ObjectId,       // ref: users (nullable)
  status: Enum,             // pending → confirmed → driver_assigned → picked_up → in_transit → delivered → completed | cancelled
  quantity: Number,
  unit: String,
  price: Number,
  deliveryFee: Number,
  totalAmount: Number,
  pickupLocation: GeoJSON,
  deliveryLocation: GeoJSON,
  pickupAddress: String,
  deliveryAddress: String,
  estimatedDistance: Number, // km
  estimatedDuration: Number,// minutes
  paymentId: String,
  paymentStatus: Enum,      // pending | paid | released | refunded
  rating: Number,           // 1-5
  review: String,
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `{buyerId:1, createdAt:-1}`, `{generatorId:1, createdAt:-1}`, `{driverId:1, status:1}`, `{status:1, createdAt:-1}`, `pickupLocation(2dsphere)`, `deliveryLocation(2dsphere)`

---

## Payments Collection

```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  buyerId: ObjectId,
  generatorId: ObjectId,
  driverId: ObjectId,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  currency: "INR",
  status: Enum,            // created | authorized | captured | held | released | refunded | failed
  breakdown: {
    wastePrice: Number,
    deliveryFee: Number,
    platformFee: Number,   // 5% of wastePrice
    tax: Number            // GST on platformFee
  },
  generatorPayout: Number,
  driverPayout: Number,
  platformRevenue: Number,
  releasedAt: Date,
  refundedAt: Date
}
```

---

## Analytics Collection

```javascript
{
  _id: ObjectId,
  city: String,
  date: Date,
  period: Enum,            // daily | weekly | monthly
  metrics: {
    totalWasteCollected: Number,  // kg
    totalWasteDiverted: Number,
    carbonSaved: Number,          // kg CO2e (0.5x waste)
    waterSaved: Number,           // liters (2.5x waste)
    farmersSupported: Number,
    generatorsActive: Number,
    driversActive: Number,
    ordersCompleted: Number,
    revenue: Number,
    avgOrderValue: Number
  },
  wasteByType: {
    vegetable: Number,
    fruit: Number,
    food: Number,
    garden: Number,
    dairy: Number,
    grain: Number,
    mixed: Number,
    other: Number
  }
}
```

**Indexes:** `{city:1, date:-1}`, `{period:1, date:-1}`, `{city:1, period:1, date:-1}`

---

## Scale Considerations

- **Geospatial indexes** on all location fields enable `$near` queries for nearby waste/drivers
- **Compound indexes** optimize the most common query patterns (e.g., `city + status + date`)
- **Sharding key**: `city` field supports multi-city horizontal scaling
- **TTL indexes**: Consider adding on expired listings for auto-cleanup
- **Read replicas**: Analytics queries should target read replicas in production
