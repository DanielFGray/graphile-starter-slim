import type { Express } from "express";
import morgan from "morgan";

const isDev = process.env.NODE_ENV === "development";

export async function installLogging(app: Express) {
  app.use(morgan(isDev ? "dev" : "combined"));
}
