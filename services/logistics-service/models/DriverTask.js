const mongoose = require('mongoose');

const driverTaskSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
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
    status: {
      type: String,
      enum: ['pending', 'accepted', 'en_route_pickup', 'at_pickup', 'picked_up', 'en_route_delivery', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    estimatedDistance: { type: Number }, // km
    estimatedDuration: { type: Number }, // minutes
    actualPickupTime: { type: Date },
    actualDeliveryTime: { type: Date },
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

driverTaskSchema.index({ driverId: 1, status: 1 });
driverTaskSchema.index({ orderId: 1 });
driverTaskSchema.index({ pickupLocation: '2dsphere' });
driverTaskSchema.index({ currentLocation: '2dsphere' });
driverTaskSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('DriverTask', driverTaskSchema);
