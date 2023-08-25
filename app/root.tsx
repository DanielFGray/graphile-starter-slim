import { Suspense, lazy } from "react";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import tailwindcss from "~/tailwind.css";
import {
  type V2_MetaFunction,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

export const meta: V2_MetaFunction = () => [
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { charSet: "utf-8" },
  { httpEquiv: "Content-Language", content: "en" },
];
export const links: LinksFunction = () => {
  return [
    // ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    { rel: "stylesheet", href: tailwindcss },
  ];
};

const RemixDevTools =
  process.env.NODE_ENV === "development" ? lazy(() => import("remix-development-tools")) : null;
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-300 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && (
          <>
            <LiveReload />
            {RemixDevTools ? (
              <Suspense>
                <RemixDevTools />
              </Suspense>
            ) : null}
          </>
        )}
      </body>
    </html>
  );
}

export function ErrorBoundary(props: unknown) {
  const error = useRouteError();
  console.error(error, props);
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
  return <h1>Unknown Error</h1>;
}
