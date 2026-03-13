const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const routeConfig = require('./config/routes');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

// ─── Security ───
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use(morgan('short'));

// ─── Rate Limiting ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                  // 500 requests per window
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many login attempts.' },
});

// ─── Health Check ───
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    services: Object.keys(routeConfig).map((path) => ({
      path,
      target: routeConfig[path].target,
    })),
  });
});

// ─── Proxy Routes ───
Object.entries(routeConfig).forEach(([path, config]) => {
  const middlewares = [];

  // Apply stricter rate limiting to auth routes
  if (path === '/api/auth') {
    middlewares.push(authLimiter);
  }

  middlewares.push(
    createProxyMiddleware({
      target: config.target,
      changeOrigin: true,
      pathRewrite: config.pathRewrite,
      timeout: 30000,
      onError: (err, req, res) => {
        console.error(`🔴 Proxy error for ${path}:`, err.message);
        res.status(502).json({
          success: false,
          error: `Service unavailable: ${path}`,
        });
      },
      onProxyReq: (proxyReq, req) => {
        // Forward original IP for logging
        proxyReq.setHeader('X-Forwarded-For', req.ip);
        proxyReq.setHeader('X-Gateway-Timestamp', Date.now().toString());
      },
    })
  );

  app.use(path, ...middlewares);
  console.log(`🔗 ${path} → ${config.target}`);
});

// ─── 404 Handler ───
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found. Check /health for available services.',
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Proxying ${Object.keys(routeConfig).length} services\n`);
});

module.exports = app;
