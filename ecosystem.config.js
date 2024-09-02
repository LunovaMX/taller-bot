module.exports = {
    apps: [
      {
        name: 'my-app',
        script: './src/app.ts',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  };
  