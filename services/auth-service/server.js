const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('../shared/db');
const { errorHandler } = require('../shared/errors');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));

// Error handler
app.use(errorHandler);

// Start
const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🔐 Auth Service running on port ${PORT}`));
};

start();

module.exports = app;
