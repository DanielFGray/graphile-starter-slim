// import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import tailwindcss from "~/tailwind.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  V2_MetaFunction,
} from "@remix-run/react";
import rdtStylesheet from "remix-development-tools/stylesheet.css";
import { RemixDevTools } from "remix-development-tools";

export const meta: V2_MetaFunction = () => [
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { charSet: "utf-8" },
  { httpEquiv: "Content-Language", content: "en" },
];
export const links: LinksFunction = () => {
  return [
    // ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    ...(rdtStylesheet ? [{ rel: "stylesheet", href: rdtStylesheet }] : []),
    { rel: "stylesheet", href: tailwindcss },
  ];
};

const modeScript = `
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  updateMode()
  darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)

  function updateMode() {
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
  }

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`;

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <Links />
      </head>
      <body className="bg-gray-300 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && (
          <>
            <LiveReload />
            <RemixDevTools />
          </>
        )}
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error({ error });
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Scripts />
        an error occurred 🙁
        {error?.message || error?.toString()}
      </body>
    </html>
  );
};
