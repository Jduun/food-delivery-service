import express, { Application } from "express";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import logger from "./logger";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import config from "./config";
import cors from "cors";

const app: Application = express();
app.use(express.json());
const PORT = config.STORE_SERVICE_PORT;

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

const servicePrefix = "/store";
app.use(`${servicePrefix}/products`, productRoutes);
app.use(`${servicePrefix}/orders`, orderRoutes);

const swaggerDocument = YAML.load("openapi.yaml");
app.use("/store/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Swagger UI available at http://localhost:${PORT}/store/docs`);
});
