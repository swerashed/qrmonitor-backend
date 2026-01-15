import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: path.join(process.cwd(), `.env.${env}`) });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    access_secret_expires_in: process.env.JWT_ACCESS_SECRET_EXPIRESIN,
    refresh_secret_expires_in: process.env.JWT_REFRESH_SECRET_EXPIRESIN,
    reset_pass_secret: process.env.RESET_PASSWORD_TOKEN,
    reset_pass_secret_expires_in: process.env.RESET_PASSWORD_TOKEN_EXPIRESIN
  },
  bcrypt: {
    salt_round: parseInt(process.env.SALT_ROUND || '12')
  },
  reset_pass_link: process.env.RESET_PASSWORD_LINK,
  emailSender: {
    email: process.env.SENDER_EMAIL,
    name: process.env.SENDER_NAME
  },
  adminEmail: process.env.ADMIN_EMAIL || 'core.rashed@gmail.com',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://qrmonitor.app',
    'https://staging.qrmonitor.app',
    'https://development.qrmonitor.app'
  ]
};