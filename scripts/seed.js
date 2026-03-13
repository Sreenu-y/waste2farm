/**
 * Database Seed Script for Waste2Farm
 * Populates MongoDB with realistic test data
 * 
 * Usage: node scripts/seed.js
 * 
 * Requires: MONGO_URI environment variable or defaults to localhost
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/waste2farm';

// ─── Schemas (inline to avoid path issues) ───
const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, enum: ['generator', 'buyer', 'driver', 'admin', 'super_admin'] },
  phone: String, city: String,
  location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  isActive: { type: Boolean, default: true }, rating: { type: Number, default: 5 },
  totalOrders: { type: Number, default: 0 },
}, { timestamps: true });
userSchema.index({ location: '2dsphere' });

const wasteListingSchema = new mongoose.Schema({
  generatorId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ['vegetable', 'fruit', 'food', 'garden', 'dairy', 'grain', 'mixed', 'other'] },
  quantity: Number, unit: { type: String, default: 'kg' }, price: Number,
  description: String, status: { type: String, default: 'available' },
  location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  city: String, pickupTime: Date, images: [String], views: { type: Number, default: 0 },
}, { timestamps: true });
wasteListingSchema.index({ location: '2dsphere' });

const orderSchema = new mongoose.Schema({
  listingId: mongoose.Schema.Types.ObjectId, buyerId: mongoose.Schema.Types.ObjectId,
  generatorId: mongoose.Schema.Types.ObjectId, driverId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: 'pending' },
  quantity: Number, unit: { type: String, default: 'kg' },
  price: Number, deliveryFee: { type: Number, default: 0 }, totalAmount: Number,
  pickupLocation: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  deliveryLocation: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  paymentStatus: { type: String, default: 'pending' },
  statusHistory: [{ status: String, timestamp: Date }],
}, { timestamps: true });
orderSchema.index({ pickupLocation: '2dsphere' });
orderSchema.index({ deliveryLocation: '2dsphere' });

const analyticsSchema = new mongoose.Schema({
  city: String, date: Date, period: { type: String, default: 'daily' },
  metrics: {
    totalWasteCollected: Number, totalWasteDiverted: Number,
    carbonSaved: Number, waterSaved: Number,
    farmersSupported: Number, ordersCompleted: Number, revenue: Number,
  },
  wasteByType: { vegetable: Number, fruit: Number, food: Number, garden: Number, dairy: Number, grain: Number, mixed: Number, other: Number },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const WasteListing = mongoose.model('WasteListing', wasteListingSchema);
const Order = mongoose.model('Order', orderSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

// ─── Seed Data ───
const CITIES = [
  { name: 'Hyderabad', coords: [78.4867, 17.3850] },
  { name: 'Bangalore', coords: [77.5946, 12.9716] },
  { name: 'Mumbai', coords: [72.8777, 19.0760] },
  { name: 'Delhi', coords: [77.1025, 28.7041] },
  { name: 'Chennai', coords: [80.2707, 13.0827] },
];

const WASTE_TYPES = ['vegetable', 'fruit', 'food', 'garden', 'dairy', 'grain', 'mixed'];

const bcryptHash = '$2a$12$LJ/QQsI3R2Y7Yb.b7w0.IeVhPFfWfcA4hKXVvRV9YzKlvuFJrN.S'; // password: test123

function randomCoords(base) {
  return [base[0] + (Math.random() - 0.5) * 0.1, base[1] + (Math.random() - 0.5) * 0.1];
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), WasteListing.deleteMany(), Order.deleteMany(), Analytics.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    // ─── Create Users ───
    const users = [];
    const roles = ['generator', 'buyer', 'driver'];
    const generatorNames = ['Hotel Grand', 'Green Market', 'Fresh Fruits Co', 'Garden Cafe', 'Royal Kitchen', 'Veggie Hub', 'Dairy Fresh', 'Grain Works', 'Farm to Table', 'Metro Restaurant'];
    const buyerNames = ['Lakshmi Farms', 'BioPower Plant', 'Organic Farms', 'Green Compost', 'Vermi Farm', 'Bio Fertilizers', 'Rural Dairy', 'AgriTech Co', 'Soil Solutions', 'EcoFarm'];
    const driverNames = ['Raju K.', 'Vijay S.', 'Amit L.', 'Suresh M.', 'Ganesh P.', 'Kumar R.', 'Prasad T.', 'Ramesh V.', 'Naveen D.', 'Kiran B.'];

    for (let i = 0; i < 5; i++) {
      const city = CITIES[i];
      for (let j = 0; j < 10; j++) {
        const roleIdx = j % 3;
        const role = roles[roleIdx];
        const names = role === 'generator' ? generatorNames : role === 'buyer' ? buyerNames : driverNames;
        users.push({
          name: names[j % 10],
          email: `${role}${i * 10 + j}@waste2farm.test`,
          password: bcryptHash,
          role,
          phone: `+91${9000000000 + i * 100 + j}`,
          city: city.name,
          location: { type: 'Point', coordinates: randomCoords(city.coords) },
          rating: 4 + Math.random(),
          totalOrders: Math.floor(Math.random() * 100),
        });
      }
    }

    // Add admin
    users.push({
      name: 'Super Admin', email: 'admin@waste2farm.in', password: bcryptHash,
      role: 'super_admin', phone: '+919999999999', city: 'Hyderabad',
      location: { type: 'Point', coordinates: [78.4867, 17.3850] },
    });

    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // ─── Create Waste Listings ───
    const generators = createdUsers.filter((u) => u.role === 'generator');
    const listings = [];

    for (const gen of generators) {
      const numListings = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < numListings; i++) {
        const wasteType = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)];
        listings.push({
          generatorId: gen._id,
          type: wasteType,
          quantity: 10 + Math.floor(Math.random() * 200),
          price: 50 + Math.floor(Math.random() * 500),
          description: `Fresh ${wasteType} waste from ${gen.name}`,
          status: Math.random() > 0.3 ? 'available' : 'sold',
          location: gen.location,
          city: gen.city,
          pickupTime: new Date(Date.now() + Math.random() * 86400000 * 3),
          views: Math.floor(Math.random() * 50),
        });
      }
    }

    const createdListings = await WasteListing.insertMany(listings);
    console.log(`♻️  Created ${createdListings.length} waste listings`);

    // ─── Create Orders ───
    const buyers = createdUsers.filter((u) => u.role === 'buyer');
    const drivers = createdUsers.filter((u) => u.role === 'driver');
    const availableListings = createdListings.filter((l) => l.status === 'available');
    const orders = [];
    const statuses = ['pending', 'confirmed', 'picked_up', 'delivered', 'completed'];

    for (let i = 0; i < Math.min(30, availableListings.length); i++) {
      const listing = availableListings[i];
      const buyer = buyers[i % buyers.length];
      const driver = drivers[i % drivers.length];
      const gen = generators.find((g) => g._id.equals(listing.generatorId));
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const deliveryFee = 50 + Math.floor(Math.random() * 150);

      orders.push({
        listingId: listing._id,
        buyerId: buyer._id,
        generatorId: listing.generatorId,
        driverId: driver._id,
        status,
        quantity: listing.quantity,
        price: listing.price,
        deliveryFee,
        totalAmount: listing.price + deliveryFee,
        pickupLocation: gen?.location || listing.location,
        deliveryLocation: buyer.location,
        paymentStatus: status === 'completed' ? 'released' : 'pending',
        statusHistory: [{ status, timestamp: new Date() }],
      });
    }

    const createdOrders = await Order.insertMany(orders);
    console.log(`📦 Created ${createdOrders.length} orders`);

    // ─── Create Analytics ───
    const analyticsRecords = [];
    for (const city of CITIES) {
      for (let m = 0; m < 6; m++) {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - m));
        date.setDate(1);

        const wasteCollected = 1000 * (m + 1) + Math.random() * 2000;
        analyticsRecords.push({
          city: city.name,
          date,
          period: 'monthly',
          metrics: {
            totalWasteCollected: Math.round(wasteCollected),
            totalWasteDiverted: Math.round(wasteCollected * 0.95),
            carbonSaved: Math.round(wasteCollected * 0.5),
            waterSaved: Math.round(wasteCollected * 2.5),
            farmersSupported: 50 + m * 30 + Math.floor(Math.random() * 50),
            ordersCompleted: 100 + m * 80 + Math.floor(Math.random() * 100),
            revenue: Math.round(wasteCollected * 3),
          },
          wasteByType: {
            vegetable: Math.round(wasteCollected * 0.35),
            fruit: Math.round(wasteCollected * 0.2),
            food: Math.round(wasteCollected * 0.25),
            garden: Math.round(wasteCollected * 0.1),
            dairy: Math.round(wasteCollected * 0.05),
            grain: Math.round(wasteCollected * 0.03),
            mixed: Math.round(wasteCollected * 0.02),
          },
        });
      }
    }

    await Analytics.insertMany(analyticsRecords);
    console.log(`📊 Created ${analyticsRecords.length} analytics records`);

    console.log('\n✅ Seed complete!');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Listings: ${createdListings.length}`);
    console.log(`   Orders: ${createdOrders.length}`);
    console.log(`   Analytics: ${analyticsRecords.length}`);
    console.log(`\n   Admin login: admin@waste2farm.in / test123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
