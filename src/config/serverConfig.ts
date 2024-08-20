export default () => ({
  server_port: parseInt(process.env.SERVER_PORT, 10) || 4000,
});
