/**
 * Service routing configuration for the API Gateway.
 * Each key maps a URL prefix to the target microservice.
 */
module.exports = {
  '/api/auth': {
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    pathRewrite: { '^/api/auth': '/api/auth' },
  },
  '/api/waste': {
    target: process.env.WASTE_SERVICE_URL || 'http://waste-service:3002',
    pathRewrite: { '^/api/waste': '/api/waste' },
  },
  '/api/orders': {
    target: process.env.ORDER_SERVICE_URL || 'http://order-service:3003',
    pathRewrite: { '^/api/orders': '/api/orders' },
  },
  '/api/logistics': {
    target: process.env.LOGISTICS_SERVICE_URL || 'http://logistics-service:3004',
    pathRewrite: { '^/api/logistics': '/api/logistics' },
  },
  '/api/payments': {
    target: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005',
    pathRewrite: { '^/api/payments': '/api/payments' },
  },
  '/api/analytics': {
    target: process.env.ANALYTICS_SERVICE_URL || 'http://analytics-service:3006',
    pathRewrite: { '^/api/analytics': '/api/analytics' },
  },
  '/api/notifications': {
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3007',
    pathRewrite: { '^/api/notifications': '/api/notifications' },
  },
};
