const DriverTask = require('../models/DriverTask');

/**
 * POST /api/logistics/assign — Assign a driver to an order
 */
const assignDriver = async (req, res, next) => {
  try {
    const { driverId, orderId, pickupLocation, deliveryLocation, pickupAddress, deliveryAddress, estimatedDistance, estimatedDuration } = req.body;

    const activeTask = await DriverTask.findOne({ driverId, status: { $nin: ['completed', 'cancelled'] } });
    if (activeTask) {
      return res.status(400).json({ success: false, error: 'Driver already has an active task.' });
    }

    const task = await DriverTask.create({
      driverId,
      orderId,
      pickupLocation,
      deliveryLocation,
      pickupAddress,
      deliveryAddress,
      estimatedDistance,
      estimatedDuration,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/logistics/nearby-drivers — Find available drivers near a location
 */
const getNearbyDrivers = async (req, res, next) => {
  try {
    const { lng, lat, radius = 15 } = req.query;
    if (!lng || !lat) {
      return res.status(400).json({ success: false, error: 'lng and lat required.' });
    }

    // Find driver tasks where the driver's current location is nearby and not busy
    const busyDriverIds = await DriverTask.distinct('driverId', {
      status: { $nin: ['completed', 'cancelled'] },
    });

    // In production, you'd query the User collection for available drivers
    res.json({
      success: true,
      data: { busyDriverIds, message: 'Query User service for drivers not in busyDriverIds list' },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/logistics/task/:id/status — Update task status
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await DriverTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found.' });

    task.status = status;
    if (status === 'picked_up') task.actualPickupTime = new Date();
    if (status === 'delivered') task.actualDeliveryTime = new Date();

    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/logistics/task/:id/location — Update driver's live location
 */
const updateDriverLocation = async (req, res, next) => {
  try {
    const { coordinates } = req.body;
    const task = await DriverTask.findByIdAndUpdate(
      req.params.id,
      { currentLocation: { type: 'Point', coordinates } },
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, error: 'Task not found.' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/logistics/driver/:driverId/tasks — Get driver's tasks
 */
const getDriverTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { driverId: req.params.driverId };
    if (status) filter.status = status;

    const tasks = await DriverTask.find(filter).sort('-createdAt').populate('orderId');
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

module.exports = { assignDriver, getNearbyDrivers, updateTaskStatus, updateDriverLocation, getDriverTasks };
