const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    generatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    razorpayOrderId: { type: String, unique: true, sparse: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'held', 'released', 'refunded', 'failed'],
      default: 'created',
    },
    breakdown: {
      wastePrice: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
    },
    generatorPayout: { type: Number, default: 0 },
    driverPayout: { type: Number, default: 0 },
    platformRevenue: { type: Number, default: 0 },
    releasedAt: { type: Date },
    refundedAt: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ buyerId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
