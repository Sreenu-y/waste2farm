/**
 * Socket.io real-time tracking module
 * Handles driver location broadcasts and order status updates
 */
const setupTracking = (io) => {
  const driverLocations = new Map(); // In production, use Redis

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Driver joins their own room
    socket.on('driver:join', (driverId) => {
      socket.join(`driver:${driverId}`);
      console.log(`🚛 Driver ${driverId} joined tracking`);
    });

    // Buyer/Generator subscribes to an order's updates
    socket.on('order:subscribe', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`👁️  Subscribed to order ${orderId}`);
    });

    // Driver sends location update
    socket.on('driver:location', (data) => {
      const { driverId, orderId, coordinates, heading, speed } = data;
      
      const locationData = {
        driverId,
        coordinates,
        heading: heading || 0,
        speed: speed || 0,
        timestamp: Date.now(),
      };

      driverLocations.set(driverId, locationData);

      // Broadcast to everyone watching this order
      if (orderId) {
        io.to(`order:${orderId}`).emit('tracking:location', locationData);
      }
    });

    // Order status change broadcast
    socket.on('order:status', (data) => {
      const { orderId, status, eta } = data;
      io.to(`order:${orderId}`).emit('tracking:status', { orderId, status, eta, timestamp: Date.now() });
    });

    // ETA update
    socket.on('driver:eta', (data) => {
      const { orderId, etaMinutes } = data;
      io.to(`order:${orderId}`).emit('tracking:eta', { orderId, etaMinutes, timestamp: Date.now() });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupTracking };
