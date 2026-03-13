const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['generator', 'buyer', 'driver', 'admin', 'super_admin'],
      required: true,
    },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    avatar: { type: String, default: null },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    isActive: { type: Boolean, default: true },
    fcmToken: { type: String, default: null },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for scale
userSchema.index({ role: 1 });
userSchema.index({ city: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ createdAt: -1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
