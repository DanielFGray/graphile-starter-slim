import React from "react";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider, type FilledContext } from "react-helmet-async";
import { App } from "../client/App";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import type { Request, Response } from "express";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import "../client/index.css";
import { GraphileApolloLink } from "./GraphileApolloLink";
import { PostGraphileInstance } from "postgraphile";

export async function render({
  url,
  req,
  res,
  pgl,
}: {
  url: string;
  req: Request;
  res: Response;
  pgl: PostGraphileInstance;
}) {
  const helmetCtx = {};

  const apolloClient = new ApolloClient({
    mode: "ssr",
    cache: new InMemoryCache(),
    link: new GraphileApolloLink({ req, res, pgl }),
  });
  const Init = (
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <HelmetProvider context={helmetCtx}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
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
