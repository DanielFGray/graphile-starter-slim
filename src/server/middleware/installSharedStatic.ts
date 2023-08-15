import express, { type Express } from "express";

export async function installSharedStatic(app: Express) {
  app.use(express.static(`${__dirname}/../../public`));
}
