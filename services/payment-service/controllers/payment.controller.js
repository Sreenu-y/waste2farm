const crypto = require('crypto');
const Payment = require('../models/Payment');

// In production, initialize Razorpay with real keys:
// const Razorpay = require('razorpay');
// const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

/**
 * POST /api/payments/create — Create a Razorpay payment order
 */
const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId, amount, generatorId, driverId, breakdown } = req.body;

    const platformFee = Math.round(amount * 0.05); // 5% platform fee
    const deliveryFee = breakdown?.deliveryFee || 0;
    const tax = Math.round(amount * 0.18 * 0.05); // GST on platform fee
    const totalAmount = amount + platformFee + tax;

    // In production, call Razorpay API:
    // const razorpayOrder = await razorpay.orders.create({ amount: totalAmount * 100, currency: 'INR', receipt: orderId });
    const mockRazorpayOrderId = `order_${crypto.randomBytes(12).toString('hex')}`;

    const payment = await Payment.create({
      orderId,
      buyerId: req.user.id,
      generatorId,
      driverId,
      razorpayOrderId: mockRazorpayOrderId,
      amount: totalAmount,
      breakdown: {
        wastePrice: amount,
        deliveryFee,
        platformFee,
        tax,
      },
      generatorPayout: amount - platformFee,
      driverPayout: deliveryFee,
      platformRevenue: platformFee + tax,
    });

    res.status(201).json({
      success: true,
      data: {
        payment,
        razorpayOrderId: mockRazorpayOrderId,
        amount: totalAmount * 100, // Razorpay expects paise
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/verify — Verify Razorpay payment signature
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // In production, verify signature:
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock_secret')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // For development, skip signature check
    const isValid = process.env.NODE_ENV === 'production'
      ? expectedSignature === razorpaySignature
      : true;

    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Payment verification failed.' });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, razorpaySignature, status: 'held' },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found.' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/:id/release — Release held payment to generator (after delivery)
 */
const releasePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'released', releasedAt: new Date() },
      { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found.' });
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/:id/refund — Refund payment
 */
const refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'refunded', refundedAt: new Date() },
      { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found.' });
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payments/order/:orderId — Get payment for an order
 */
const getPaymentByOrder = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found.' });
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPaymentOrder, verifyPayment, releasePayment, refundPayment, getPaymentByOrder };
