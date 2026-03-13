const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('../shared/db');
const { errorHandler } = require('../shared/errors');
const orderRoutes = require('./routes/order.routes');

const app = express();
const PORT = process.env.ORDER_SERVICE_PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

app.use('/api/orders', orderRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'order-service' }));
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`📦 Order Service running on port ${PORT}`));
};

start();
module.exports = app;
