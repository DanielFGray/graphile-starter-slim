/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
import type { ExecutionResult } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

type GraphQLExecutor = <Result, Variables extends { [key: string]: unknown }>(
  query: TypedDocumentNode<Result, Variables>,
  variables?: Variables,
) => Promise<ExecutionResult<Result>>;

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    graphql: GraphQLExecutor;
  }
}
