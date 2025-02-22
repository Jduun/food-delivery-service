import dotenv from "dotenv";

dotenv.config();

interface Config {
  STORE_SERVICE_PORT: number;
  STORE_DB_HOST: string;
  STORE_DB_PORT: number;
  STORE_DB_USERNAME: string;
  STORE_DB_PASSWORD: string;
  STORE_DB_NAME: string;
  JWT_SECRET: string;
  DB_URL: string;
}

const config: Config = {
  STORE_SERVICE_PORT: Number(process.env.STORE_SERVICE_PORT),
  STORE_DB_HOST: process.env.STORE_DB_HOST!,
  STORE_DB_PORT: 5432,
  STORE_DB_USERNAME: process.env.STORE_DB_USERNAME!,
  STORE_DB_PASSWORD: process.env.STORE_DB_PASSWORD!,
  STORE_DB_NAME: process.env.STORE_DB_NAME!,
  JWT_SECRET: process.env.JWT_SECRET!,
  DB_URL: "",
};
config.DB_URL = `postgresql://${config.STORE_DB_USERNAME}:${config.STORE_DB_PASSWORD}@${config.STORE_DB_HOST}:${config.STORE_DB_PORT}/${config.STORE_DB_NAME}`;

export default config;
