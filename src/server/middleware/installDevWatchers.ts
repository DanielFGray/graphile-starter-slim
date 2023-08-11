export async function installDevWatchers(app: Express) {
  const vite = await import("vite");
  const viteDevServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: "custom",
    clearScreen: false,
  });

  viteDevServer.watcher.on("all", (event, file, stats) => {
    // do some magic
    // codegen.generate();
    // migrate.watch();
  });

  app.set("viteDevServer", viteDevServer);
  app.get("shutdownActions").push(() => viteDevServer.close());
}
