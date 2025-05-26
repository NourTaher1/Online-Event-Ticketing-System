import dotenv from "dotenv";
dotenv.config();

const secrets = {
  MONGODB_URI: process.env.db_url,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

export default secrets;
