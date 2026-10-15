const path = require('path');

module.exports = {
  apps: [
    {
      name: 'pbl-crackers-backend',
      cwd: path.resolve(__dirname, 'server'),
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '600M',
      env: {
        NODE_ENV: 'production',
        PORT: 5019,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5019,
      },
      error_file: path.resolve(__dirname, 'server/logs/pm2-error.log'),
      out_file: path.resolve(__dirname, 'server/logs/pm2-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
