import fs from "node:fs/promises";
import path from "node:path";
import type { Express } from "express";
import type { render } from "../server-entry";

const isDev = process.env.NODE_ENV !== "production";

async function getTemplateFile() {
  return await fs.readFile(path.resolve("./src/client/index.html"), "utf-8");
}

export async function installSSR(app: Express) {
  let template = await getTemplateFile();
  const viteDevServer = app.get("viteDevServer");
  if (isDev) {
    app.use(viteDevServer.middlewares);
  } else {
    app.locals.render = await import("../server-entry.js");
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pgl = app.get("pgl");

    try {
      if (isDev) {
        template = await viteDevServer.transformIndexHtml(url, await getTemplateFile());
        const { render } = await viteDevServer.ssrLoadModule("/src/server/server-entry.tsx");
        app.locals.render = render;
      }

      await (app.locals.render as typeof render)({ req, res, pgl, template });
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      viteDevServer?.ssrFixStacktrace?.(e);
      next(e);
    }
  });
}
