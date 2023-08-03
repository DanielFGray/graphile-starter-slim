import { GraphQLError } from "graphql";
import { useNavigate } from "react-router-dom";
import { startTransition } from "react";

export async function useLogout() {
  const navigate = useNavigate();
  return function logout() {
    startTransition(() => {
      navigate("/");
    });
  };
}

export function ensureArray<T>(input: T | null | undefined | Array<T>): Array<T> {
  if (!input) return [];
  return Array.isArray(input) ? input : [input];
}

export function uniq<T>(input: Array<T>): Array<T> {
  return Array.from(new Set(input));
}

export function extractError(error: null): null;
export function extractError(error: Error): Error;
export function extractError(error: ApolloError): GraphQLError;
export function extractError(error: GraphQLError): GraphQLError;
export function extractError(
  error: null | Error | ApolloError | GraphQLError,
): null | Error | GraphQLError;
export function extractError(
  error: null | Error | ApolloError | GraphQLError,
): null | Error | GraphQLError {
  return (
    (error &&
      "graphQLErrors" in error &&
      error.graphQLErrors &&
      error.graphQLErrors.length &&
      error.graphQLErrors[0]) ||
    error
  );
}

export function getExceptionFromError(error: null | Error | ApolloError | GraphQLError):
  | (Error & {
      code?: string;
      fields?: string[];
      extensions?: { code?: string; fields?: string[] };
    })
  | null {
  // @ts-ignore
  const graphqlError: GraphQLError = extractError(error);
  const exception = graphqlError && graphqlError.extensions && graphqlError.extensions.exception;
  return (exception || graphqlError || error) as Error | null;
}

export function getCodeFromError(error: null | Error | ApolloError | GraphQLError): null | string {
  const err = getExceptionFromError(error);
  return err?.extensions?.code ?? err?.code ?? null;
}
