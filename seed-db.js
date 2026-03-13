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
    if (key && value) acc[key.trim()] = value.join('=').trim();
    return acc;
  }, {});

console.log('🌱 Starting database seed...');

const child = spawn('node', ['scripts/seed.js'], {
  cwd: __dirname,
  env: { ...process.env, ...envConfig },
  stdio: 'inherit'
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Seed successful!');
  } else {
    console.error(`❌ Seed failed with code ${code}`);
  }
});
