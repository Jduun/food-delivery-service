import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();
const app: Application = express();
const PORT = process.env.AUTH_SERVICE_PORT;

app.use(express.json());
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
