const express = require('express');
const { createOrder, getOrders, getOrder, updateStatus, rateOrder } = require('../controllers/order.controller');
const { authenticate, authorize } = require('../../shared/auth');

const router = express.Router();

router.post('/', authenticate, authorize('buyer', 'admin'), createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);
router.patch('/:id/status', authenticate, authorize('driver', 'admin', 'generator'), updateStatus);
router.post('/:id/rate', authenticate, authorize('buyer'), rateOrder);

module.exports = router;
