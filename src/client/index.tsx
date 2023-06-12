import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { App } from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("no root container found!");

let initialState: any = {};
const initStateEl = document.getElementById("initialState");
if (initStateEl) initialState = JSON.parse(initStateEl.innerText);
const CSRF_TOKEN = initialState.CSRF_TOKEN;

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
        "CSRF-Token": CSRF_TOKEN,
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

const Init = (
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>
);

if (import.meta.hot || !container?.innerText) {
  const root = createRoot(container);
  root.render(Init);
} else {
  hydrateRoot(container, Init);
}
