// import * as Home from "../client/Home";
// import * as Login from "../client/login";
// import * as Register from "../client/register";
// import * as Settings from "../client/settings";

export const makeRoutes = ({ graphql } = {}) => [
  { path: "/", index: true, Component: () => import("./client/Home") },
  { path: "/signin", Component: () => import("./client/signin") },
  { path: "/forgot", Component: () => import("./client/forgot") },
  { path: "/verify", Component: () => import("./client/verify") },
  { path: "/signup", Component: () => import("./client/signup") },
  { path: "/settings/*", Component: () => import("./client/settings") },
];
