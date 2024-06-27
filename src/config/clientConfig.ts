export default () => ({
  client: {
    port: parseInt(process.env.CLIENT_PORT, 10) || 4000,
  },
});
