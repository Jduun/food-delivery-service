import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
import logger from "./logger";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import config from "./config";
import cors from "cors";

const app: Application = express();
app.use(express.json());
const PORT = config.AUTH_SERVICE_PORT;

const allowedOrigins = ["http://localhost:5173", "http://localhost", `http://localhost:${PORT}`];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const servicePrefix = "/auth";
app.use(`${servicePrefix}`, authRoutes);
const swaggerDocument = YAML.load("openapi.yaml");
app.use(
  `${servicePrefix}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Swagger UI available at http://localhost:${PORT}/auth/docs`);
});
