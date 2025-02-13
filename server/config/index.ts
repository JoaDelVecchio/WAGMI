import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.PORT ||
  !process.env.MONGO_URI ||
  !process.env.JWT_SECRET_KEY ||
  !process.env.CLIENT_ORIGIN_URL
) {
  console.error("Missing required arguments");
  process.exit(1);
}

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;
