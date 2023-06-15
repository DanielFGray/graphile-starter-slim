import fs from "node:fs/promises";
import path from "node:path";
import type { Express } from "express";
import { template as makeTemplate } from "lodash";
import { type ViteDevServer } from "vite";

const isDev = process.env.NODE_ENV !== "production";

export async function installSSR(app: Express) {
  let rawTemplate = await fs.readFile(path.resolve("./src/client/index.html"), "utf-8");
  let template = makeTemplate(rawTemplate);
  let render: Function;
  let viteDevServer: ViteDevServer;
  if (isDev) {
    const vite = await import("vite");
    viteDevServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "custom",
      clearScreen: false,
    });
    app.use(viteDevServer.middlewares);
  } else {
    render = (await import("./dist/server/entry-server.js")).render;
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pgl = app.get("pgl");

    try {
      if (isDev && viteDevServer) {
        // 1. Read index.html
        rawTemplate = await fs.readFile(path.resolve("./src/client/index.html"), "utf-8");
        // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
        //    and also applies HTML transforms from Vite plugins, e.g. global
        //    preambles from @vitejs/plugin-react

        template = makeTemplate(await viteDevServer.transformIndexHtml(url, rawTemplate));
        // 3. Load the server entry. ssrLoadModule automatically transforms
        //    ESM source code to be usable in Node.js! There is no bundling
        //    required, and provides efficient invalidation similar to HMR.
        ({ render } = await viteDevServer.ssrLoadModule("/src/server/server-entry.tsx"));
      }

      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const { appHtml, appData, helmet } = await render({ req, res, pgl });
      // appData.CSRF_TOKEN = req.csrfToken();

      // 5. Inject the app-rendered HTML into the template.
      const html = template({
        ssrOutlet: appHtml,
        ssrData: JSON.stringify(appData, null, isDev ? 2 : undefined),
        meta: [
          helmet.title.toString(),
          helmet.priority.toString(),
          helmet.meta.toString(),
          helmet.link.toString(),
          helmet.script.toString(),
        ].join(""),
      });

      // 6. Send the rendered HTML back.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      viteDevServer.ssrFixStacktrace(e);
      next(e);
    }
  });
}
