const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('../shared/db');
const { errorHandler } = require('../shared/errors');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3007;

app.use(helmet());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

app.use('/api/notifications', notificationRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🔔 Notification Service running on port ${PORT}`));
};

start();
module.exports = app;
