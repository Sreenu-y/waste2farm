const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    date: { type: Date, required: true },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    metrics: {
      totalWasteCollected: { type: Number, default: 0 },   // kg
      totalWasteDiverted: { type: Number, default: 0 },     // kg
      carbonSaved: { type: Number, default: 0 },            // kg CO2e
      waterSaved: { type: Number, default: 0 },             // liters
      farmersSupported: { type: Number, default: 0 },
      generatorsActive: { type: Number, default: 0 },
      driversActive: { type: Number, default: 0 },
      ordersCompleted: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },                // INR
      avgOrderValue: { type: Number, default: 0 },
    },
    wasteByType: {
      vegetable: { type: Number, default: 0 },
      fruit: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      garden: { type: Number, default: 0 },
      dairy: { type: Number, default: 0 },
      grain: { type: Number, default: 0 },
      mixed: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

analyticsSchema.index({ city: 1, date: -1 });
analyticsSchema.index({ period: 1, date: -1 });
analyticsSchema.index({ city: 1, period: 1, date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
