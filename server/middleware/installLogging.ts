import { Express } from "express";
import morgan from "morgan";

const isDev = process.env.NODE_ENV === "development";

export async function installLogging(app: Express) {
  if (isDev) {
    // app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }
}
