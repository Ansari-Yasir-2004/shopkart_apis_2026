module.exports = {
  apps: [
    {
      name: "gatewayservice",
      script: "./api_gateway/index.js",
      instances: 1,
      autorestart: true,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "development",
        PORT: 2000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 2000,
      },
      cwd: __dirname,
      node_args: "--require dotenv/config",
    },
    {
      name: "adminServices",
      script: "./adminServices/server.js",
      instances: 1, // single instance, can use "max" for all cores
      autorestart: true,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "development",
        PORT: 7010, // unique port
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 7010,
      },
      cwd: __dirname, // root-level working directory
      node_args: "--require dotenv/config", // load .env automatically
    },
    {
      name: "shopkartAppServices",
      script: "./shopkartAppServices/server.js",
      instances: 1,
      autorestart: true,
      exec_mode: "cluster",

      watch: false,
      ignore_watch: ["public/whatsapp-qr.png", "public/*", ".waba_auth"],

      max_memory_restart: "300M",
      env: {
        NODE_ENV: "development",
        PORT: 7020,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 7020,
      },
      cwd: __dirname,
      node_args: "--require dotenv/config",
    },
  ],
};
