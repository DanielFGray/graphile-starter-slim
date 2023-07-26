import React from "react";
import { SharedLayoutQuery, SharedLayout_UserFragment } from "~/generated";
import { Button, clsx } from "~/components";
import { useLogout } from "../lib";
import { NavLink, NavLinkProps, useNavigate, useLocation, useLoaderData } from "@remix-run/react";
import { ErrorBoundary as DefaultErrorBoundary } from "react-error-boundary";

const NavStyles: NavLinkProps["className"] = function NavStyles(route) {
  return clsx(
    route.isActive ? "font-bold decoration-primary-200" : "decoration-primary-400",
    "underline hover:decoration-primary-200 decoration-thick decoration-2",
  );
};

function Nav({ currentUser }: { currentUser: SharedLayoutQuery["currentUser"] }) {
  const logout = useLogout();
  const navigate = useNavigate();
  return (
    <header>
      <nav className="border-b border-primary-500 text-primary-100 bg-primary-800 border-primary-540 mb-4 tracking-tight">
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

enum AuthRestrict {
  NEVER = 0,
  LOGGED_OUT = 1 << 0,
  LOGGED_IN = 1 << 1,
  NOT_MOD = 1 << 2,
  NOT_ADMIN = 1 << 3,
}

export function Layout({
  children: children,
  forbidWhen: when = auth => auth.NEVER,
}: {
  children: React.ReactNode;
  forbidWhen?: (auth: typeof AuthRestrict) => AuthRestrict;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const data = useLoaderData();
  if (!(data && "currentUser" in data)) throw new Error("missing user data!");
  const currentUser = data.currentUser as null | SharedLayout_UserFragment;

  const forbidWhen = when(AuthRestrict);
  const forbidsLoggedOut = forbidWhen & AuthRestrict.LOGGED_OUT;
  const forbidsLoggedIn = forbidWhen & AuthRestrict.LOGGED_IN;
  const forbidsNotMod = forbidWhen & AuthRestrict.NOT_MOD;
  const forbidsNotAdmin = forbidWhen & AuthRestrict.NOT_ADMIN;
  if (currentUser && (forbidsLoggedIn || (forbidsNotAdmin && currentUser.role !== "ADMIN"))) {
    navigate("/", { replace: true });
    return null;
  } else if (currentUser == null && forbidsLoggedOut) {
    navigate(`/signup?next=${encodeURIComponent(location.pathname)}`, { replace: true });
    return null;
  }

  return (
    <>
      <Nav currentUser={currentUser} />
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
