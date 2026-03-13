const express = require('express');
const { createPaymentOrder, verifyPayment, releasePayment, refundPayment, getPaymentByOrder } = require('../controllers/payment.controller');
const { authenticate, authorize } = require('../../shared/auth');

const router = express.Router();

router.post('/create', authenticate, createPaymentOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/:id/release', authenticate, authorize('admin'), releasePayment);
router.post('/:id/refund', authenticate, authorize('admin'), refundPayment);
router.get('/order/:orderId', authenticate, getPaymentByOrder);

module.exports = router;
