import React from "react";
import { ErrorBoundary as DefaultErrorBoundary } from "react-error-boundary";
import { NavLink, NavLinkProps, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  SharedLayoutQuery,
  SharedLayout_QueryFragment,
  useCurrentUserUpdatedSubscription,
} from "../generated";
import { type QueryResult } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Button, clsx } from ".";
import { useLogout } from "../lib";

const appTitle = "pglslim";

const NavStyles: NavLinkProps["className"] = function NavStyles(route) {
  return clsx(
    route.isActive ? "font-bold decoration-primary-200" : "decoration-primary-400",
    "underline hover:decoration-primary-200 decoration-thick decoration-2",
  );
};

function Nav({ currentUser }: { currentUser: SharedLayoutQuery["currentUser"] }) {
  const logout = useLogout();
  return (
    <header>
      <nav className="border-b text-primary-100 bg-primary-800 border-primary-540 mb-4 tracking-tight">
        <ul className="flex flex-row justify-between gap-4 p-4">
          <div>
            <li>
              <NavLink to="/" className={NavStyles}>
                home
              </NavLink>
            </li>
          </div>
          <div className="flex flex-row gap-4">
            {currentUser ? (
              <>
                <div className="border-r border-primary-400 pr-4">
                  signed in as <span className="font-bold">{currentUser.username}</span>
                </div>
                <li>
                  <NavLink to="/settings" className={NavStyles}>
                    settings
                  </NavLink>
                </li>
                <li>
                  <a
                    href="/logout"
                    className={NavStyles?.({})}
                    onClick={() => {
                      void logout();
                    }}
                  >
                    sign out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/signup" className={NavStyles({isActive:true})}>
                      create an account
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signin" className={NavStyles}>
                    sign in
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
  children: children,
  title,
  forbidWhen: when = auth => auth.NEVER,
  query,
}: {
  query: Pick<
    QueryResult<SharedLayout_QueryFragment>,
    "data" | "loading" | "error" | "networkStatus" | "client" | "refetch"
  >;
  children: React.ReactNode;
  title?: string;
  forbidWhen?: (auth: typeof AuthRestrict) => AuthRestrict;
}) {
  const location = useLocation();

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
    return <Navigate to={`/signup?next=${encodeURIComponent(location.pathname)}`} replace={true} />;
  }

  return (
    <>
      {/*query.data?.currentUser ? <CurrentUserUpdatedSubscription /> : null*/}
      <Helmet
        htmlAttributes={{ lang: "en-US" }}
        defaultTitle={appTitle}
        titleTemplate={`${appTitle} | %s`}
      >
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Helmet>
      <Nav currentUser={query.data?.currentUser} />
      <ErrorBoundary>{children}</ErrorBoundary>
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
