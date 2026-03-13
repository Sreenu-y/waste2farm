const express = require('express');
const { sendNotification, getNotifications, markAsRead, markAllAsRead } = require('../controllers/notification.controller');
const { authenticate, authorize } = require('../../shared/auth');

const router = express.Router();

router.post('/send', authenticate, authorize('admin'), sendNotification);
router.get('/', authenticate, getNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/read-all', authenticate, markAllAsRead);

module.exports = router;
