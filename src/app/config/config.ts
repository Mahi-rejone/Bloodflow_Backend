import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
export const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  DB: process.env.DB,
  origin: process.env.ORIGIN,
  salt_rounds: process.env.SALTROUNDS,
  access_secret: process.env.ACCESS_SECRET,
  access_expires: process.env.ACCESS_EXPIRES,
  refresh_secret: process.env.REFRESH_SECRET,
  refresh_expires: process.env.REFRESH_EXPIRES,
};
