import fs from "node:fs/promises";
import { type GetLoadContextFunction, createRequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import express from "express";
import morgan from "morgan";
import postgraphile from "postgraphile";
import { execute, hookArgs } from "grafast";
import { Pool } from "pg";
import chokidar from "chokidar";
import sourceMapSupport from "source-map-support";
import { getPreset } from "./server/graphile.config.ts";
import { makeApp } from "./server/app.ts";

sourceMapSupport.install();
installGlobals();

const mode = process.env.NODE_ENV;
const BUILD_PATH = "./build/index.js";
/** @type { import('@remix-run/node').ServerBuild | Promise<import('@remix-run/node').ServerBuild> } */
let build = import(BUILD_PATH);

const app = express();

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use("/build", express.static("public/build", { immutable: true, maxAge: "1y" }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "3h" }));

app.use(morgan(mode === "production" ? "common" : "dev"));

makeApp({ app }).then(app => {
  const pgl = app.get("pgl");
  const getLoadContext: GetLoadContextFunction = (req, res) => ({
    async graphql(document, variableValues) {
      const schema = await pgl.getSchema();
      const args = {
        schema,
        document,
        variableValues,
      };
      await hookArgs(args, pgl.getResolvedPreset(), {
        node: { req, res },
        expressv4: { req, res },
      });
      return await execute(args);
    },
  });

  app.all(
    "*",
    mode === "development"
      ? createDevRequestHandler()
      : createRequestHandler({
          build,
          getLoadContext,
          mode,
        }),
  );

  const port = process.env.PORT || 3000;

  app.listen(port, async () => {
    console.log(`Express server listening on port ${port}`);

    if (mode !== "production") {
      broadcastDevReady(await build);
    }
  });
  function createDevRequestHandler() {
    const watcher = chokidar.watch(BUILD_PATH, { ignoreInitial: true });

    watcher.on("all", async () => {
      // 1. purge require cache && load updated server build
      const stat = await fs.stat(BUILD_PATH);
      build = import(BUILD_PATH + "?t=" + stat.mtimeMs);
      // 2. tell dev server that this app server is now ready
      broadcastDevReady(await build);
    });

    return async (req, res, next) => {
      try {
        //
        return createRequestHandler({
          build: await build,
          getLoadContext,
          mode,
        })(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }
});
