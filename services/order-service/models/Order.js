const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'WasteListing', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    generatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'driver_assigned', 'picked_up', 'in_transit', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    price: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    pickupLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    deliveryLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    pickupAddress: { type: String },
    deliveryAddress: { type: String },
    estimatedDistance: { type: Number }, // km
    estimatedDuration: { type: Number }, // minutes
    paymentId: { type: String, default: null },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'released', 'refunded'],
      default: 'pending',
    },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, maxlength: 500 },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

// Indexes for scale
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ generatorId: 1, createdAt: -1 });
orderSchema.index({ driverId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ pickupLocation: '2dsphere' });
orderSchema.index({ deliveryLocation: '2dsphere' });

module.exports = mongoose.model('Order', orderSchema);
