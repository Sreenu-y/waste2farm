const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load .env file from root
const envPath = path.join(__dirname, '.env');
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .filter(line => line && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    acc[key.trim()] = value.join('=').trim();
    return acc;
  }, {});

const services = [
  { name: 'api-gateway', dir: 'services/api-gateway' },
  { name: 'auth-service', dir: 'services/auth-service' },
  { name: 'waste-service', dir: 'services/waste-service' },
  { name: 'order-service', dir: 'services/order-service' },
  { name: 'logistics-service', dir: 'services/logistics-service' },
  { name: 'payment-service', dir: 'services/payment-service' },
  { name: 'analytics-service', dir: 'services/analytics-service' },
  { name: 'notification-service', dir: 'services/notification-service' }
];

services.forEach(service => {
  const fullPath = path.join(__dirname, service.dir);
  console.log(`🚀 Starting ${service.name}...`);
  
  const child = spawn('node', ['server.js'], {
    cwd: fullPath,
    env: { ...process.env, ...envConfig },
    stdio: 'inherit'
  });

  child.on('error', (err) => {
    console.error(`❌ Failed to start ${service.name}:`, err);
  });
});
