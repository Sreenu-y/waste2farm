const Joi = require('joi');

/**
 * Reusable validation schemas
 */

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId');

const geoPoint = Joi.object({
  type: Joi.string().valid('Point').required(),
  coordinates: Joi.array().ordered(
    Joi.number().min(-180).max(180).required(), // longitude
    Joi.number().min(-90).max(90).required()    // latitude
  ).length(2).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('generator', 'buyer', 'driver', 'admin').required(),
  phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).required(),
  city: Joi.string().min(2).max(100).required(),
  location: geoPoint.optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const wasteListingSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  type: Joi.string().valid(
    'vegetable', 'fruit', 'food', 'garden', 'dairy', 'grain', 'mixed', 'other'
  ).required(),
  quantity: Joi.number().min(0.1).max(100000).required(),
  unit: Joi.string().valid('kg', 'tons', 'liters').default('kg'),
  price: Joi.number().min(0).required(),
  description: Joi.string().max(500).optional(),
  location: geoPoint.required(),
  pickupTime: Joi.date().iso().required(),
  images: Joi.array().items(Joi.string().uri()).max(5).optional(),
  city: Joi.string().required(),
});

const orderSchema = Joi.object({
  listingId: objectId.required(),
  quantity: Joi.number().min(0.1).optional(),
});

/**
 * Middleware: validate request body against a schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      return res.status(400).json({ success: false, error: messages });
    }
    req.body = value;
    next();
  };
};

module.exports = {
  objectId,
  geoPoint,
  registerSchema,
  loginSchema,
  wasteListingSchema,
  orderSchema,
  validate,
};
