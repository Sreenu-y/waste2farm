const express = require('express');
const {
  assignDriver, getNearbyDrivers, updateTaskStatus, updateDriverLocation, getDriverTasks,
} = require('../controllers/logistics.controller');
const { authenticate, authorize } = require('../../shared/auth');

const router = express.Router();

router.post('/assign', authenticate, authorize('admin'), assignDriver);
router.get('/nearby-drivers', authenticate, getNearbyDrivers);
router.patch('/task/:id/status', authenticate, authorize('driver', 'admin'), updateTaskStatus);
router.patch('/task/:id/location', authenticate, authorize('driver'), updateDriverLocation);
router.get('/driver/:driverId/tasks', authenticate, getDriverTasks);

module.exports = router;
