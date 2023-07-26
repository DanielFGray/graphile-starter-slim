import type { GetLoadContextFunction } from "@remix-run/express";
import path from "path";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import { execute, hookArgs } from "grafast";
import express from "express";
import morgan from "morgan";
import postgraphile from "postgraphile";
import { getPreset } from "./server/graphile.config.ts";
import { Pool } from "pg";
import { makeApp } from "./server/app";

installGlobals();

const mode = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use("/build", express.static("public/build", { immutable: true, maxAge: "1y" }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "3h" }));

app.use(morgan(mode === "production" ? "common" : "dev"));

const rootPgPool = new Pool({ connectionString: process.env.DATABASE_URL });

// This pool runs as the unprivileged user, it's what PostGraphile uses.
const authPgPool = new Pool({ connectionString: process.env.AUTH_DATABASE_URL });

const pgl = postgraphile(getPreset({ authPgPool, rootPgPool }));

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

makeApp({ app }).then(app => {
  if (mode === "production") {
    app.all(
      "*",
      createRequestHandler({
        build: require(BUILD_DIR),
        mode,
        getLoadContext,
      }),
    );
  } else {
    app.all("*", (req, res, next) => {
      purgeRequireCache();
      return createRequestHandler({
        build: require(BUILD_DIR),
        mode,
        getLoadContext,
      })(req, res, next);
    });
  }
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
