import { GraphQLError } from "graphql";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, startTransition } from "react";
import { redirect } from "@remix-run/node";
import { SharedLayout_UserFragment } from "~/generated";

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

enum AuthRestrict {
  NEVER = 0,
  LOGGED_OUT = 1 << 0,
  LOGGED_IN = 1 << 1,
  NOT_MOD = 1 << 2,
  NOT_ADMIN = 1 << 3,
}

export function forbidWhen(
  when: (auth: typeof AuthRestrict) => AuthRestrict,
  currentUser: undefined | null | SharedLayout_UserFragment,
  request: Request
) {
  const forbidWhen = when(AuthRestrict);
  const forbidsLoggedOut = forbidWhen & AuthRestrict.LOGGED_OUT;
  const forbidsLoggedIn = forbidWhen & AuthRestrict.LOGGED_IN;
  const forbidsNotMod = forbidWhen & AuthRestrict.NOT_MOD;
  const forbidsNotAdmin = forbidWhen & AuthRestrict.NOT_ADMIN;
  if (currentUser && (forbidsLoggedIn || (forbidsNotAdmin && currentUser.role !== "ADMIN"))) {
    throw redirect('/')
  } else if (currentUser == null && forbidsLoggedOut) {
    const location = new URL(request.url)
    throw redirect(`/signup?redirectTo=${encodeURIComponent(location.pathname)}`);
  }
}

export function usePointerInteractions() {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isPointerReleased, setIsPointerReleased] = useState(true);

  useEffect(() => {
    const handlePointerUp = () => {
      setIsPointerDown(false);
      setIsPointerReleased(true);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    const handlePointerDown = () => {
      setIsPointerDown(true);
      setIsPointerReleased(false);
      document.addEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return { isPointerDown, isPointerReleased };
}
