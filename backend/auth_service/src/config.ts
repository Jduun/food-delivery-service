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
}

const config: Config = {
  AUTH_SERVICE_PORT: Number(process.env.AUTH_SERVICE_PORT),
  AUTH_DB_HOST: process.env.AUTH_DB_HOST!,
  AUTH_DB_PORT: Number(process.env.AUTH_DB_PORT)!,
  AUTH_DB_USERNAME: process.env.AUTH_DB_USERNAME!,
  AUTH_DB_PASSWORD: process.env.AUTH_DB_PASSWORD!,
  AUTH_DB_NAME: process.env.AUTH_DB_NAME!,
  JWT_SECRET: process.env.JWT_SECRET!,
  DB_URL: "",
};
config.DB_URL = `postgresql://${config.AUTH_DB_USERNAME}:${config.AUTH_DB_PASSWORD}@${config.AUTH_DB_HOST}:${config.AUTH_DB_PORT}/${config.AUTH_DB_NAME}`;

export default config;
