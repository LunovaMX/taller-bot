module.exports = {
    apps: [
      {
        name: 'my-app',
        script: './dist/app.js',  // Apunta al archivo JavaScript compilado
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