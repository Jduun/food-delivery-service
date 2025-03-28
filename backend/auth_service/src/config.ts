import dotenv from "dotenv";

dotenv.config();

interface Config {
  AUTH_SERVICE_PORT: number;
  AUTH_DB_HOST: string;
  AUTH_DB_PORT: number;
  AUTH_DB_USERNAME: string;
  AUTH_DB_PASSWORD: string;
  AUTH_DB_NAME: string;
  JWT_SECRET: string;
  DB_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}

const config: Config = {
  AUTH_SERVICE_PORT: Number(process.env.AUTH_SERVICE_PORT),
  AUTH_DB_HOST: process.env.AUTH_DB_HOST!,
  AUTH_DB_PORT: 5432,
  AUTH_DB_USERNAME: process.env.AUTH_DB_USERNAME!,
  AUTH_DB_PASSWORD: process.env.AUTH_DB_PASSWORD!,
  AUTH_DB_NAME: process.env.AUTH_DB_NAME!,
  JWT_SECRET: process.env.JWT_SECRET!,
  DB_URL: "",
  REDIS_HOST: process.env.REDIS_HOST!,
  REDIS_PORT: Number(process.env.REDIS_PORT!),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
};

config.DB_URL = `postgresql://${config.AUTH_DB_USERNAME}:${config.AUTH_DB_PASSWORD}@${config.AUTH_DB_HOST}:${config.AUTH_DB_PORT}/${config.AUTH_DB_NAME}`;

export default config;
