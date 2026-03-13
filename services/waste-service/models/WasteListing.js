const mongoose = require('mongoose');

const wasteListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    generatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['vegetable', 'fruit', 'food', 'garden', 'dairy', 'grain', 'mixed', 'other'],
      required: true,
    },
    quantity: { type: Number, required: true, min: 0.1 },
    unit: { type: String, enum: ['kg', 'tons', 'liters'], default: 'kg' },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'expired'],
      default: 'available',
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String },
    city: { type: String, required: true, index: true },
    pickupTime: { type: Date, required: true },
    images: [{ type: String }],
    aiClassification: {
      category: String,
      confidence: Number,
      spoilageRisk: { type: String, enum: ['low', 'medium', 'high'] },
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Geospatial + compound indexes for scale
wasteListingSchema.index({ location: '2dsphere' });
wasteListingSchema.index({ status: 1, type: 1 });
wasteListingSchema.index({ city: 1, status: 1, createdAt: -1 });
wasteListingSchema.index({ generatorId: 1, createdAt: -1 });

module.exports = mongoose.model('WasteListing', wasteListingSchema);
