const Notification = require('../models/Notification');

const admin = require('firebase-admin');

try {
  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  } else {
    // Fallback for local dev if placed in root
    serviceAccount = require('../../../firebase-service-account.json');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🔥 Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK initialization failed:', error.message);
}

/**
 * POST /api/notifications/send — Send a notification
 */
const sendNotification = async (req, res, next) => {
  try {
    const { userId, type, title, body, data, fcmToken } = req.body;

    // Save to DB
    const notification = await Notification.create({ userId, type, title, body, data });

    // Send via Firebase FCM if token available
    if (fcmToken) {
      try {
        await admin.messaging().send({ 
          token: fcmToken, 
          notification: { title, body }, 
          data: data || {} 
        });
        notification.sentViaFCM = true;
        await notification.save();
        console.log(`📱 FCM sent to ${userId}`);
      } catch (fcmError) {
        console.error('FCM send failed:', fcmError.message);
      }
    }

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications — Get user's notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const filter = { userId: req.user.id };
    if (unreadOnly === 'true') filter.isRead = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: req.user.id, isRead: false }),
    ]);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/notifications/:id/read — Mark as read
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found.' });
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/notifications/read-all — Mark all as read
 */
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendNotification, getNotifications, markAsRead, markAllAsRead };
