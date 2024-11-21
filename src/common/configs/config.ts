const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const CONFIG_VARS = {
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",
  PORT: process.env.PORT || 3000,
  DATABASE_URL:
    (process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL
      : process.env.DATABASE_URL_TEST) || "mongodb://localhost:27017/mydatabase",
  DATABASE_URL_TEST: process.env.DATABASE_URL_TEST
};
