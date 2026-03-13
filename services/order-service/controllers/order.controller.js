const Order = require('../models/Order');

/**
 * POST /api/orders — Create a new order
 */
const createOrder = async (req, res, next) => {
  try {
    const { listingId, quantity, pickupLocation, deliveryLocation, pickupAddress, deliveryAddress, price, deliveryFee } = req.body;
    const totalAmount = price + (deliveryFee || 0);

    const order = await Order.create({
      listingId,
      buyerId: req.user.id,
      generatorId: req.body.generatorId,
      quantity,
      unit: req.body.unit || 'kg',
      price,
      deliveryFee: deliveryFee || 0,
      totalAmount,
      pickupLocation,
      deliveryLocation,
      pickupAddress,
      deliveryAddress,
      statusHistory: [{ status: 'pending', note: 'Order created' }],
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders — Get orders for current user (by role)
 */
const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { role, id } = req.user;

    const filter = {};
    if (role === 'buyer') filter.buyerId = id;
    else if (role === 'generator') filter.generatorId = id;
    else if (role === 'driver') filter.driverId = id;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .populate('buyerId', 'name phone')
        .populate('generatorId', 'name phone')
        .populate('driverId', 'name phone'),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id — Get single order
 */
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'name phone city')
      .populate('generatorId', 'name phone city')
      .populate('driverId', 'name phone')
      .populate('listingId');

    if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/orders/:id/status — Update order status (state machine)
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['driver_assigned', 'cancelled'],
      driver_assigned: ['picked_up', 'cancelled'],
      picked_up: ['in_transit'],
      in_transit: ['delivered'],
      delivered: ['completed'],
    };

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot transition from "${order.status}" to "${status}".`,
      });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date(), note: note || '' });

    if (status === 'driver_assigned' && req.body.driverId) {
      order.driverId = req.body.driverId;
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/orders/:id/rate — Rate a completed order
 */
const rateOrder = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, buyerId: req.user.id, status: 'completed' },
      { rating, review },
      { new: true }
    );
    if (!order) return res.status(400).json({ success: false, error: 'Cannot rate this order.' });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrder, updateStatus, rateOrder };
