const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
