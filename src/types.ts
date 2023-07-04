import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router-dom";
import type { ExecutionResult } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

export type ExecuteGraphql = <Result, Variables extends { [key: string]: unknown }>(
  document: TypedDocumentNode<Result, Variables>,
  args?: { variables?: Variables },
) => Promise<ExecutionResult<Result>>;

export type ActionArgs = Omit<ActionFunctionArgs, "context"> & {
  context: { graphql: ExecuteGraphql };
};

export type LoaderArgs = Omit<LoaderFunctionArgs, "context"> & {
  context: { graphql: ExecuteGraphql };
};
