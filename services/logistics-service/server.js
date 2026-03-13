const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('../shared/db');
const { errorHandler } = require('../shared/errors');
const logisticsRoutes = require('./routes/logistics.routes');
const { setupTracking } = require('./socket/tracking');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const PORT = process.env.LOGISTICS_SERVICE_PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

app.use('/api/logistics', logisticsRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'logistics-service' }));
app.use(errorHandler);

// Setup Socket.io tracking
setupTracking(io);

const start = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`🚛 Logistics Service running on port ${PORT}`));
};

start();
module.exports = { app, io };
