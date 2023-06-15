import React from "react";
import { ErrorBoundary as DefaultErrorBoundary, FallbackProps } from "react-error-boundary";
import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  SharedLayoutQuery,
  useCurrentUserUpdatedSubscription,
  useLogoutMutation,
  useSharedLayoutQuery,
} from "../generated";
import { useApolloClient } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Button, clsx } from ".";

function Nav({
  loggedIn,
  logout,
}: {
  loggedIn: boolean;
  logout: (ev: React.MouseEvent) => void;
}): JSX.Element {
  return (
    <header>
      <nav className="border-b bg-gray-100 border-gray-300 mb-2 tracking-tight">
        <ul className="flex flex-row justify-between gap-4 p-4">
          <div>
            <li>
              <NavLink to="/" className={({ isActive }) => clsx(isActive && "font-bold")}>
                home
              </NavLink>
            </li>
          </div>
          <div className="flex flex-row gap-4">
            {loggedIn ? (
              <>
                <li>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => clsx(isActive && "font-bold")}
                  >
                    settings
                  </NavLink>
                </li>
                <li>
                  <a href="/logout" onClick={logout}>
                    sign out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) => clsx(isActive && "font-bold")}
                  >
                    register
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" className={({ isActive }) => clsx(isActive && "font-bold")}>
                    log in
                  </NavLink>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}

enum AuthRestrict {
  NEVER = 0,
  LOGGED_OUT = 1 << 0,
  LOGGED_IN = 1 << 1,
  NOT_ADMIN = 1 << 2,
}

function CurrentUserUpdatedSubscription() {
  /*
   * This will set up a GraphQL subscription monitoring for changes to the
   * current user. Interestingly we don't need to actually _do_ anything - no
   * rendering or similar - because the payload of this mutation will
   * automatically update Apollo's cache which will cause the data to be
   * re-rendered wherever appropriate.
   */
  useCurrentUserUpdatedSubscription();
  return null;
}

export function Layout({
  children,
  title,
  forbidWhen: when = auth => auth.NEVER,
}: {
  children:
    | React.ReactNode
    | ((p: {
        currentUser: SharedLayoutQuery["currentUser"];
        logout: () => Promise<void>;
      }) => React.ReactNode);
  title?: string;
  forbidWhen?: (auth: typeof AuthRestrict) => AuthRestrict;
}) {
  const query = useSharedLayoutQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const [handleLogout] = useLogoutMutation();
  const apolloClient = useApolloClient();

  const forbidWhen = when(AuthRestrict);
  const forbidsLoggedOut = forbidWhen & AuthRestrict.LOGGED_OUT;
  const forbidsLoggedIn = forbidWhen & AuthRestrict.LOGGED_IN;
  const forbidsNotAdmin = forbidWhen & AuthRestrict.NOT_ADMIN;
  if (
    query.data?.currentUser &&
    (forbidsLoggedIn || (forbidsNotAdmin && query.data?.currentUser.role !== "ADMIN"))
  ) {
    return null;
  } else if (
    query.data?.currentUser === null &&
    !query.loading &&
    !query.error &&
    forbidsLoggedOut
  ) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace={true} />;
  }

  async function logout() {
    try {
      await handleLogout();
      await apolloClient.resetStore();
      navigate("/");
    } catch (err) {
      console.error(err);
      // navigate("/logout");
    }
  }

  return (
    <>
      {query.data && query.data.currentUser ? <CurrentUserUpdatedSubscription /> : null}
      {title && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}
      <Nav loggedIn={Boolean(query.data?.currentUser)} logout={handleLogout} />
      <ErrorBoundary>
        {typeof children === "function"
          ? children({ currentUser: query.data?.currentUser, logout })
          : children}
      </ErrorBoundary>
    </>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <DefaultErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="error">
          <span>uh oh, there was an error :(</span>
          <pre>{JSON.stringify(error, null, 2)}</pre>
          <Button onClick={resetErrorBoundary}>reset</Button>
        </div>
      )}
    >
      {children}
    </DefaultErrorBoundary>
  );
}
