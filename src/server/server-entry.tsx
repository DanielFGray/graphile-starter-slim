import React from "react";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider as StaticRouter,
} from "react-router-dom/server";
import { HelmetProvider, type FilledContext } from "react-helmet-async";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import type { Request, Response } from "express";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import { GraphileApolloLink } from "./GraphileApolloLink";
import { PostGraphileInstance } from "postgraphile";
import { execute, hookArgs } from "grafast";
import { DocumentNode } from "graphql";
import * as Home from "../client/Home"
import * as Login from "../client/login"
import * as Register from "../client/register"
import * as Settings from "../client/settings"

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
    init.body = req.body;
  }

  return new Request(url.href, init);
}

type RenderArgs = {
  url: string;
  req: Request;
  res: Response;
  pgl: PostGraphileInstance;
};

const routes = [
  { path: "/", index: true, Component: Home.default },
  { path: "/login", Component: Login.default },
  { path: "/register", Component: Register.default },
  { path: "/settings", Component: Settings.default },
];

const handler = createStaticHandler(routes);

export async function render({ req, res, pgl }: RenderArgs) {
  async function graphql(document, {
    variables: variableValues,
    operationName,
  }: {
    query: DocumentNode;
    variables?: { [variable: string]: unknown };
    operationName?: string;
  }) {
    const schema = await pgl.getSchema();
    const args = {
      schema,
      document,
      variableValues,
      operationName,
    };
    await hookArgs(args, pgl.getResolvedPreset(), {
      node: { req, res },
      expressv4: { req, res },
    });
    return await execute(args);
  }
  const routerCtx = await handler.query(createFetchRequest(req), { requestContext: { graphql } });
  const router = createStaticRouter(handler.dataRoutes, routerCtx);

  const apolloClient = new ApolloClient({
    mode: "ssr",
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

  const appHtml = await renderToStringWithData(Init);
  const appData = apolloClient.extract();
  const { helmet } = helmetCtx as FilledContext;

  return {
    appHtml,
    appData,
    helmet,
  };
}
