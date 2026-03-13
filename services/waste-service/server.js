const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('../shared/db');
const { errorHandler } = require('../shared/errors');
const wasteRoutes = require('./routes/waste.routes');

const app = express();
const PORT = process.env.WASTE_SERVICE_PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

app.use('/api/waste', wasteRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'waste-service' }));
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`♻️  Waste Service running on port ${PORT}`));
};

start();
module.exports = app;
