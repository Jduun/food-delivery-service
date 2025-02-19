import "dotenv/config";
import config from "../config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(config.DB_URL);
