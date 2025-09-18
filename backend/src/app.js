import express from "express";
import cors from "cors";
import { connectDB } from "./db/connection.js";
import { runMigrations } from "./db/migrations.js";
import { scoresRoutes } from "./routes/scores.js";
import { healthRoutes } from "./routes/health.js";

export async function createApp() {
  const db = await connectDB();
  await runMigrations(db);

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/scores", scoresRoutes(db));
  app.use("/health", healthRoutes());

  return app;
}
