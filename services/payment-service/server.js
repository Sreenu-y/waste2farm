const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('../shared/db');
const { errorHandler } = require('../shared/errors');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
const PORT = process.env.PAYMENT_SERVICE_PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

app.use('/api/payments', paymentRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'payment-service' }));
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`💳 Payment Service running on port ${PORT}`));
};

start();
module.exports = app;
