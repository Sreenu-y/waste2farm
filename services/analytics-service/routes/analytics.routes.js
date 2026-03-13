const express = require('express');
const { getDashboard, getCityBreakdown, getWasteTypeDistribution, recordAnalytics } = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../../shared/auth');

const router = express.Router();

router.get('/dashboard', authenticate, getDashboard);
router.get('/cities', authenticate, authorize('admin', 'super_admin'), getCityBreakdown);
router.get('/waste-types', authenticate, getWasteTypeDistribution);
router.post('/record', authenticate, authorize('admin'), recordAnalytics);

module.exports = router;
