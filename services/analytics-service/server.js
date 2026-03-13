const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('../shared/db');
const { errorHandler } = require('../shared/errors');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
const PORT = process.env.ANALYTICS_SERVICE_PORT || 3006;

app.use(helmet());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'analytics-service' }));
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`📊 Analytics Service running on port ${PORT}`));
};

start();
module.exports = app;
