import React from "react";
import { SharedLayoutQuery, type SharedLayout_UserFragment } from "~/generated";
import { Button, clsx } from "~/components";
import { useLogout } from "../lib";
import {
  NavLink,
  type NavLinkProps,
  useNavigate,
  useLocation,
  useLoaderData,
  Link,
} from "@remix-run/react";
import { ErrorBoundary as DefaultErrorBoundary } from "react-error-boundary";

const NavStyles: NavLinkProps["className"] = function NavStyles(route) {
  return clsx(
    route.isActive ? "font-bold decoration-primary-200" : "decoration-primary-400",
    "decoration-thick underline decoration-2 hover:decoration-primary-200",
  );
};

function Nav({ currentUser }: { currentUser: null | SharedLayout_UserFragment }) {
  const logout = useLogout();
  const navigate = useNavigate();
  return (
    <header>
      <nav className="border-primary-540 mb-4 border-b border-primary-500 bg-primary-800 font-medium tracking-tight text-primary-100">
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
                  {"signed in as "}
                  <Link to={`/user/${currentUser.username}`} className={clsx('font-bold', NavStyles?.({}))}>
                    {currentUser.username}
                  </Link>
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
                  <NavLink to="/signup" className={NavStyles({ isActive: true })}>
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

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData();
  if (!(data && "currentUser" in data)) throw new Error("missing user data!");
  const currentUser = data.currentUser as null | SharedLayout_UserFragment;

  return (
    <>
      <Nav currentUser={currentUser} />
      <ErrorBoundary>
        <main>{children}</main>
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
