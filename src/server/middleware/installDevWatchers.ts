import path from "node:path";

export async function installDevWatchers(app: Express) {
  const vite = await import("vite");
  const viteDevServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: "custom",
    clearScreen: false,
    logLevel: process.env.NODE_ENV === "production" ? "error" : "info",
  });

  viteDevServer.watcher.on("all", (event, file, stats) => {
    // do some magic
    // if (file.endsWith('.graphql') codegen.generate();
    // if (file.endsWith('.sql') migrate.run();
    console.log(event, file.replace(process.cwd(), ""));
  });

  app.set("viteDevServer", viteDevServer);
  app.get("shutdownActions").push(() => viteDevServer.close());
}
