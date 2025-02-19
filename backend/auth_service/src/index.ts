import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
import logger from "./logger";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import config from "./config";

const app: Application = express();
const PORT = config.AUTH_SERVICE_PORT;
app.use(express.json());
app.use("/auth", authRoutes);
const swaggerDocument = YAML.load("openapi.yaml");
app.use("/auth/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Swagger UI available at http://localhost:${PORT}/auth/docs`);
});
