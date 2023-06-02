import fs from "node:fs/promises";
import path from "node:path";
import type { Express } from "express";

export async function installSSR(app: Express) {
  const vite = await import("vite");
  const viteDevServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: "custom",
    clearScreen: false,
  });
  app.use(viteDevServer.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = await fs.readFile(path.resolve("./src/client/index.html"), "utf-8");

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      template = await viteDevServer.transformIndexHtml(url, template);

      // 3. Load the server entry. ssrLoadModule automatically transforms
      //    ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = await viteDevServer.ssrLoadModule("/src/server/server-entry.tsx");

      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url);

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

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
