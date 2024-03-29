/* eslint-disable no-console */
import { createServer, type IncomingMessage } from "node:http";
import { Duplex } from "node:stream";
import fs from "node:fs/promises";
import chalk from "chalk";
import { getShutdownActions, getUpgradeHandlers, makeApp } from "./app";

const isDev = process.env.NODE_ENV !== "production";

async function main() {
  // Create our HTTP server
  const httpServer = createServer();

  // Make our application (loading all the middleware, etc)
  const app = await makeApp({ httpServer });

  // Add our application to our HTTP server
  httpServer.addListener("request", app);

  const upgradeHandlers = getUpgradeHandlers(app);
  async function handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
    if (isDev && httpServer.listeners("upgrade").length > 1) {
      console.error(httpServer.listeners("upgrade").map(f => f.toString()));
      throw new Error(`ERROR: more than one upgrade listener!`);
    }
    try {
      for (const upgradeHandler of upgradeHandlers) {
        if (await upgradeHandler.check(req, socket, head)) {
          upgradeHandler.upgrade(req, socket, head);
          return;
        }
      }
      // No handler matched:
      socket.destroy();
    } catch (e) {
      console.error(`Error occurred whilst trying to handle 'upgrade' event:`, e);
      socket.destroy();
    }
  }

  if (upgradeHandlers.length > 0) {
    if (isDev && httpServer.listeners("upgrade").length > 0) {
      throw new Error(`ERROR: we already have an upgrade listener!`);
    }
    httpServer.addListener("upgrade", handleUpgrade);
  }

  const packageJson = JSON.parse(await fs.readFile("./package.json", "utf8"));

  // And finally, we open the listen port
  const port = Number(process.env.PORT) || 3000;
  httpServer.listen(port, () => {
    const address = httpServer.address();
    const actualPort: string =
      typeof address === "string"
        ? address
        : address && address.port
        ? String(address.port)
        : String(port);
    console.log();
    console.log(
      chalk.green(`${chalk.bold(packageJson.name)} listening on port ${chalk.bold(actualPort)}`),
    );
    console.log();
    console.log(`  Site:     ${chalk.bold.underline(`http://localhost:${actualPort}`)}`);
    console.log(`  GraphiQL: ${chalk.bold.underline(`http://localhost:${actualPort}/graphiql`)}`);
    console.log();
  });

  // Nodemon SIGUSR2 handling
  const shutdownActions = getShutdownActions(app);
  shutdownActions.push(() => {
    httpServer.removeListener("request", app);
    httpServer.removeListener("upgrade", handleUpgrade);
    httpServer.close();
  });
}

main().catch(e => {
  console.error("Fatal error occurred starting server!");
  console.error(e);
  process.exit(101);
});
