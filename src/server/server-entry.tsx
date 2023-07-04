import React from "react";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider as StaticRouter,
} from "react-router-dom/server";
// import * as ReactDOMServer from "react-dom/server";
import { HelmetProvider, type FilledContext } from "react-helmet-async";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import type { Request, Response } from "express";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import { GraphileApolloLink } from "./GraphileApolloLink";
import { PostGraphileInstance } from "postgraphile";
import { execute, hookArgs } from "grafast";
import { RouteObject, LoaderFunction, ActionFunction } from "react-router-dom";
import makeTemplate from "lodash/template";
import { routes } from "../routes";
import type { ExecuteGraphql } from "../types";

const isDev = process.env.NODE_ENV !== "production";

function createFetchRequest(req: Request) {
  const origin = `${req.protocol}://${req.get("host")}`;
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req;
    init.duplex = "half";
  }

  return new Request(url.href, init);
}

type RenderArgs = {
  template: string;
  req: Request;
  res: Response;
  pgl: PostGraphileInstance;
};

const serverRoutes = Promise.all(
  routes.map(async r => {
    const Component = await r.Component();
    const route: RouteObject = { ...r, ...Component, Component: Component.default };
    console.log(...Object.entries(route));
    return route;
  }),
);

export async function render({ req, res, pgl, template }: RenderArgs) {
  const graphql: ExecuteGraphql = async (document, { variables } = {}) => {
    const schema = await pgl.getSchema();
    const args = {
      schema,
      document,
      variableValues: variables,
    };
    await hookArgs(args, pgl.getResolvedPreset(), {
      node: { req, res },
      expressv4: { req, res },
    });
    return await execute(args);
  };
  const handler = createStaticHandler(await serverRoutes);
  const routerCtx = await handler.query(createFetchRequest(req), { requestContext: { graphql } });
  const router = createStaticRouter(handler.dataRoutes, routerCtx);
  const apolloClient = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new GraphileApolloLink({ req, res, pgl }),
  });

  const helmetCtx = {};

  const Init = (
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <HelmetProvider context={helmetCtx}>
          <StaticRouter location={req.originalUrl} router={router} context={routerCtx} />
        </HelmetProvider>
      </ApolloProvider>
    </React.StrictMode>
  );

  const html: string = await renderToStringWithData(Init);
  const data = apolloClient.extract();

  res.format({
    json() {
      res.json(data);
    },
    html() {
      const { helmet } = helmetCtx as FilledContext;
      const meta = [
        helmet?.title.toString(),
        helmet?.priority.toString(),
        helmet?.meta.toString(),
        // helmet?.link.toString(),
        // helmet?.script.toString(),
      ].join("\n");
      res
        .status(200)
        .set("Content-Type", "text/html")
        .end(
          makeTemplate(template)({
            ssrOutlet: html,
            ssrData: JSON.stringify(data, null, isDev ? 2 : undefined),
            meta,
          }),
        );
    },
  });
}
