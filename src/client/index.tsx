import React, { Suspense, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { routes } from "../routes";
// import type { ExecuteGraphql } from "../types";

const container = document.getElementById("root");
if (!container) throw new Error("no root container found!");

const initialState = JSON.parse(document.getElementById("initialState")?.innerText ?? "{}");

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: message: ${message}, location: ${JSON.stringify(
              locations,
            )}, path: ${JSON.stringify(path)}`,
          ),
        );
      if (networkError) console.error(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: "/graphql",
      credentials: "same-origin",
      headers: {
        "CSRF-Token": initialState.CSRF_TOKEN,
      },
    }),
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        queryType: true,
      },
      posts: {
        fields: {
          nodes: {
            merge(existing = [], incoming: any[]) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }).restore(initialState),
});

const clientRoutes = routes.map(r => ({ ...r, Component: React.lazy(r.Component) }));

const Init = (
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <HelmetProvider>
        <Suspense>
          <RouterProvider router={createBrowserRouter(clientRoutes)} />
        </Suspense>
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>
);

if (import.meta.hot || !container?.innerText) {
  const root = createRoot(container);
  startTransition(() => {
    root.render(Init);
  });
} else {
  startTransition(() => {
    hydrateRoot(container, Init);
  });
}
