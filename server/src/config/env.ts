import dotenv from "dotenv";
dotenv.config();

function required(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback;
  if (val === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: required("MONGO_URI", "mongodb://127.0.0.1:27017/remon_academy"),
  jwtSecret: required("JWT_SECRET", "dev_only_insecure_secret_change_me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "remon_token",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || "admin@remonacademy.com",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!",
};
