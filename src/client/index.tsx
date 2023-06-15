import React, { startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { type RouteObject } from "react-router";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (process.env.NODE_ENV !== 'production') {
  loadErrorMessages();
  loadDevMessages();
}

const container = document.getElementById("root");
if (!container) throw new Error("no root container found!");

const initialState = JSON.parse(document.getElementById("initialState")?.innerText ?? '{}');

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
    },
  }).restore(initialState),
});

const routes: RouteObject[] = [
  { path: "/", index: true, Component: React.lazy(() => import("./Home.jsx")) },
  { path: "/login", Component: React.lazy(() => import("./login.jsx")) },
  { path: "/register", Component: React.lazy(() => import("./register.jsx")) },
  { path: "/settings", Component: React.lazy(() => import("./settings.jsx")) },
];

const Init = (
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <HelmetProvider>
        <RouterProvider router={createBrowserRouter(routes)} />
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>
);

if (import.meta.hot || !container?.innerText) {
  startTransition(() => {
    const root = createRoot(container);
    root.render(Init);
  });
} else {
  startTransition(() => {
    hydrateRoot(container, Init);
  });
}
