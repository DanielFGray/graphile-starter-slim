import { Express, static as staticMiddleware } from "express";

export async function installSharedStatic(app: Express) {
  app.use(staticMiddleware(`${__dirname}/../../public`));
}
