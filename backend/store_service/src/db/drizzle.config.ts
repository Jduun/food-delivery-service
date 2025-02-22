import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import config from "../config";

export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DB_URL!,
  },
});
