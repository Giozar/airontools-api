export default () => ({
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailPort: parseInt(process.env.EMAIL_PORT),
  emailHost: process.env.EMAIL_HOST,
  email: process.env.EMAIL,
});
