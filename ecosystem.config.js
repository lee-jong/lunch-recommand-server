module.exports = {
  apps: [
    {
      name: "my-app",
      script: "server.ts",
      watch: true,
      interpreter: "node",
      interpreter_args: "-r ts-node/register -r tsconfig-paths/register",
      env: {
        NODE_ENV: "local",
      },
      env_dev: {
        NODE_ENV: "develop",
        NODE_PATH: "./dist",
      },
      env_prod: {
        NODE_ENV: "prod",
        NODE_PATH: "./dist",
        MINIFY: "true",
      },
      ignore_watch: ["node_modules", "logs", "uploads"],
      watch_options: {
        followSymlinks: false,
        usePolling: true,
      },
      extensions: "ts",
    },
  ],
};
