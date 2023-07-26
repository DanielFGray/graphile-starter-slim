var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_node_stream = require("node:stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 48,
          columnNumber: 7
        },
        this
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 97,
          columnNumber: 7
        },
        this
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  meta: () => meta
});

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-OVLVOEZD.css";

// app/root.tsx
var import_react2 = require("@remix-run/react");

// node_modules/remix-development-tools/dist/stylesheet.css
var stylesheet_default = "/build/_assets/stylesheet-Q4KQABJE.css";

// app/root.tsx
var import_remix_development_tools = require("remix-development-tools"), import_jsx_dev_runtime2 = require("react/jsx-dev-runtime"), meta = () => [
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { charSet: "utf-8" },
  { httpEquiv: "Content-Language", content: "en" }
], links = () => [
  // ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ...stylesheet_default ? [{ rel: "stylesheet", href: stylesheet_default }] : [],
  { rel: "stylesheet", href: tailwind_default }
], modeScript = `
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
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 68,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("script", { dangerouslySetInnerHTML: { __html: modeScript } }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 69,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 70,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 67,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { className: "bg-gray-300 text-gray-900 dark:bg-gray-900 dark:text-gray-100", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 73,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 75,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.LiveReload, {}, void 0, !1, {
          fileName: "app/root.tsx",
          lineNumber: 78,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_remix_development_tools.RemixDevTools, {}, void 0, !1, {
          fileName: "app/root.tsx",
          lineNumber: 79,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 77,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 66,
    columnNumber: 5
  }, this);
}
var ErrorBoundary = ({ error }) => (console.error({ error }), /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { lang: "en", children: [
  /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("title", { children: "Oh no!" }, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 92,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 93,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Links, {}, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 94,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 91,
    columnNumber: 7
  }, this),
  /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
      fileName: "app/root.tsx",
      lineNumber: 97,
      columnNumber: 9
    }, this),
    "an error occurred \u{1F641}",
    (error == null ? void 0 : error.message) || (error == null ? void 0 : error.toString())
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 96,
    columnNumber: 7
  }, this)
] }, void 0, !0, {
  fileName: "app/root.tsx",
  lineNumber: 90,
  columnNumber: 5
}, this));

// app/routes/settings.tsx
var settings_exports = {};
__export(settings_exports, {
  action: () => action,
  default: () => SettingsPage,
  loader: () => loader
});
var import_react6 = require("react");

// app/generated/index.ts
var import_graphql_tag = __toESM(require("graphql-tag")), EmailsForm_UserEmailFragmentDoc = import_graphql_tag.default`
  fragment EmailsForm_UserEmail on UserEmail {
    id
    email
    isVerified
    isPrimary
    createdAt
  }
`, PostFieldsFragmentDoc = import_graphql_tag.default`
  fragment PostFields on Post {
    id
    user {
      username
    }
    title
    body
    tags
    score
    comments {
      totalCount
    }
    createdAt
    updatedAt
  }
`, SharedLayout_UserFragmentDoc = import_graphql_tag.default`
  fragment SharedLayout_User on User {
    id
    name
    username
    avatarUrl
    role
    isVerified
  }
`, SharedLayout_QueryFragmentDoc = import_graphql_tag.default`
  fragment SharedLayout_Query on Query {
    currentUser {
      ...SharedLayout_User
    }
  }
  ${SharedLayout_UserFragmentDoc}
`, AddEmailDocument = import_graphql_tag.default`
  mutation AddEmail($email: String!) {
    createUserEmail(input: { userEmail: { email: $email } }) {
      user {
        id
        userEmails(first: 50) {
          nodes {
            id
            ...EmailsForm_UserEmail
          }
        }
      }
    }
  }
  ${EmailsForm_UserEmailFragmentDoc}
`, ChangePasswordDocument = import_graphql_tag.default`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(input: { oldPassword: $oldPassword, newPassword: $newPassword }) {
      success
    }
  }
`, ConfirmAccountDeletionDocument = import_graphql_tag.default`
  mutation ConfirmAccountDeletion($token: String!) {
    confirmAccountDeletion(input: { token: $token }) {
      success
    }
  }
`, CreatePostDocument = import_graphql_tag.default`
  mutation CreatePost($title: String!, $body: String!, $tags: [Tag]!) {
    createPost(input: { post: { title: $title, body: $body, tags: $tags } }) {
      post {
        id
        createdAt
      }
    }
  }
`, CurrentUserUpdatedDocument = import_graphql_tag.default`
  subscription CurrentUserUpdated {
    currentUserUpdated {
      event
      user {
        id
        username
        name
        avatarUrl
        role
        isVerified
      }
    }
  }
`, DeleteEmailDocument = import_graphql_tag.default`
  mutation DeleteEmail($emailId: UUID!) {
    deleteUserEmail(input: { id: $emailId }) {
      user {
        id
        userEmails(first: 50) {
          nodes {
            id
            ...EmailsForm_UserEmail
          }
        }
      }
    }
  }
  ${EmailsForm_UserEmailFragmentDoc}
`, ForgotPasswordDocument = import_graphql_tag.default`
  mutation ForgotPassword($email: String!) {
    forgotPassword(input: { email: $email }) {
      clientMutationId
    }
  }
`, LatestPostsDocument = import_graphql_tag.default`
  query LatestPosts {
    ...SharedLayout_Query
    posts(orderBy: CREATED_AT_DESC) {
      nodes {
        ...PostFields
      }
    }
  }
  ${SharedLayout_QueryFragmentDoc}
  ${PostFieldsFragmentDoc}
`, LoginDocument = import_graphql_tag.default`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      user {
        id
        username
        name
      }
    }
  }
`, LogoutDocument = import_graphql_tag.default`
  mutation Logout {
    logout {
      success
    }
  }
`, MakeEmailPrimaryDocument = import_graphql_tag.default`
  mutation MakeEmailPrimary($emailId: UUID!) {
    makeEmailPrimary(input: { emailId: $emailId }) {
      user {
        id
        userEmails(first: 50) {
          nodes {
            id
            isPrimary
          }
        }
      }
    }
  }
`, RegisterDocument = import_graphql_tag.default`
  mutation Register($username: String!, $password: String!, $email: String!, $name: String) {
    register(input: { username: $username, password: $password, email: $email, name: $name }) {
      user {
        id
        username
        name
      }
    }
  }
`, RequestAccountDeletionDocument = import_graphql_tag.default`
  mutation RequestAccountDeletion {
    requestAccountDeletion(input: {}) {
      success
    }
  }
`, ResendEmailVerificationDocument = import_graphql_tag.default`
  mutation ResendEmailVerification($emailId: UUID!) {
    resendEmailVerificationCode(input: { emailId: $emailId }) {
      success
    }
  }
`, ResetPasswordDocument = import_graphql_tag.default`
  mutation ResetPassword($userId: UUID!, $token: String!, $password: String!) {
    resetPassword(input: { userId: $userId, resetToken: $token, newPassword: $password }) {
      success
    }
  }
`, ProfileSettingsDocument = import_graphql_tag.default`
  query ProfileSettings {
    ...SharedLayout_Query
    currentUser {
      id
      isVerified
      hasPassword
      userEmails(first: 50) {
        nodes {
          id
          email
          isVerified
          isPrimary
          createdAt
        }
      }
      authentications: userAuthenticationsList(first: 50) {
        id
        service
        identifier
        createdAt
      }
    }
  }
  ${SharedLayout_QueryFragmentDoc}
`, SharedLayoutDocument = import_graphql_tag.default`
  query SharedLayout {
    ...SharedLayout_Query
  }
  ${SharedLayout_QueryFragmentDoc}
`, UnlinkUserAuthenticationDocument = import_graphql_tag.default`
  mutation UnlinkUserAuthentication($id: UUID!) {
    deleteUserAuthentication(input: { id: $id }) {
      user {
        id
        userAuthenticationsList(first: 50) {
          id
          identifier
          service
          createdAt
        }
      }
    }
  }
`, UpdateUserDocument = import_graphql_tag.default`
  mutation UpdateUser($id: UUID!, $patch: UserPatch!) {
    updateUser(input: { id: $id, patch: $patch }) {
      clientMutationId
      user {
        id
        name
        username
      }
    }
  }
`, VerifyEmailDocument = import_graphql_tag.default`
  mutation VerifyEmail($id: UUID!, $token: String!) {
    verifyEmail(input: { userEmailId: $id, token: $token }) {
      success
      query {
        ...SharedLayout_Query
      }
    }
  }
  ${SharedLayout_QueryFragmentDoc}
`;

// app/components/index.tsx
var import_react5 = __toESM(require("react"));

// app/lib/index.tsx
var import_react_router_dom = require("react-router-dom"), import_react3 = require("react");
async function useLogout() {
  let navigate = (0, import_react_router_dom.useNavigate)();
  return function() {
    (0, import_react3.startTransition)(() => {
      navigate("/");
    });
  };
}
function ensureArray(input) {
  return input ? Array.isArray(input) ? input : [input] : [];
}

// app/components/Layout.tsx
var import_react4 = require("@remix-run/react"), import_react_error_boundary = require("react-error-boundary"), import_jsx_dev_runtime3 = require("react/jsx-dev-runtime"), NavStyles = function(route) {
  return clsx(
    route.isActive ? "font-bold decoration-primary-200" : "decoration-primary-400",
    "underline hover:decoration-primary-200 decoration-thick decoration-2"
  );
};
function Nav({ currentUser }) {
  let logout = useLogout(), navigate = (0, import_react4.useNavigate)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("header", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("nav", { className: "border-b border-primary-500 text-primary-100 bg-primary-800 border-primary-540 mb-4 tracking-tight", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("ul", { className: "flex flex-row justify-between gap-4 p-4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react4.NavLink, { to: "/", className: NavStyles, children: "home" }, void 0, !1, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 24,
      columnNumber: 15
    }, this) }, void 0, !1, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 23,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 22,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "flex flex-row gap-4", children: currentUser ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "border-r border-primary-400 pr-4", children: [
        "signed in as ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("span", { className: "font-bold", children: currentUser.username }, void 0, !1, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 33,
          columnNumber: 32
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 32,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react4.NavLink, { to: "/settings", className: NavStyles, children: "settings" }, void 0, !1, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 36,
        columnNumber: 19
      }, this) }, void 0, !1, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 35,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
        "a",
        {
          href: "/logout",
          className: NavStyles == null ? void 0 : NavStyles({}),
          onClick: () => {
            logout();
          },
          children: "sign out"
        },
        void 0,
        !1,
        {
          fileName: "app/components/Layout.tsx",
          lineNumber: 41,
          columnNumber: 19
        },
        this
      ) }, void 0, !1, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 40,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 31,
      columnNumber: 15
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react4.NavLink, { to: "/signup", className: NavStyles({ isActive: !0 }), children: "create an account" }, void 0, !1, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 55,
        columnNumber: 19
      }, this) }, void 0, !1, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 54,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react4.NavLink, { to: "/signin", className: NavStyles, children: "sign in" }, void 0, !1, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 60,
        columnNumber: 19
      }, this) }, void 0, !1, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 59,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 53,
      columnNumber: 15
    }, this) }, void 0, !1, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 29,
      columnNumber: 11
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/Layout.tsx",
    lineNumber: 21,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/components/Layout.tsx",
    lineNumber: 20,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/components/Layout.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, this);
}
var AuthRestrict = /* @__PURE__ */ ((AuthRestrict3) => (AuthRestrict3[AuthRestrict3.NEVER = 0] = "NEVER", AuthRestrict3[AuthRestrict3.LOGGED_OUT = 1] = "LOGGED_OUT", AuthRestrict3[AuthRestrict3.LOGGED_IN = 2] = "LOGGED_IN", AuthRestrict3[AuthRestrict3.NOT_MOD = 4] = "NOT_MOD", AuthRestrict3[AuthRestrict3.NOT_ADMIN = 8] = "NOT_ADMIN", AuthRestrict3))(AuthRestrict || {});
function Layout({
  children,
  forbidWhen: when = (auth) => auth.NEVER
}) {
  let location = (0, import_react4.useLocation)(), navigate = (0, import_react4.useNavigate)(), data = (0, import_react4.useLoaderData)();
  if (!(data && "currentUser" in data))
    throw new Error("missing user data!");
  let currentUser = data.currentUser, forbidWhen2 = when(AuthRestrict), forbidsLoggedOut = forbidWhen2 & 1 /* LOGGED_OUT */, forbidsLoggedIn = forbidWhen2 & 2 /* LOGGED_IN */, forbidsNotMod = forbidWhen2 & 4 /* NOT_MOD */, forbidsNotAdmin = forbidWhen2 & 8 /* NOT_ADMIN */;
  return currentUser && (forbidsLoggedIn || forbidsNotAdmin && currentUser.role !== "ADMIN") ? (navigate("/", { replace: !0 }), null) : currentUser == null && forbidsLoggedOut ? (navigate(`/signup?next=${encodeURIComponent(location.pathname)}`, { replace: !0 }), null) : /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Nav, { currentUser }, void 0, !1, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 109,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(ErrorBoundary2, { children }, void 0, !1, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 110,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/Layout.tsx",
    lineNumber: 108,
    columnNumber: 5
  }, this);
}
function ErrorBoundary2({ children }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
    import_react_error_boundary.ErrorBoundary,
    {
      fallbackRender: ({ error, resetErrorBoundary }) => /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "error", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("span", { children: "uh oh, there was an error :(" }, void 0, !1, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 120,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("pre", { children: JSON.stringify(error, null, 2) }, void 0, !1, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 121,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Button, { onClick: resetErrorBoundary, children: "reset" }, void 0, !1, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 122,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 119,
        columnNumber: 9
      }, this),
      children
    },
    void 0,
    !1,
    {
      fileName: "app/components/Layout.tsx",
      lineNumber: 117,
      columnNumber: 5
    },
    this
  );
}

// app/components/index.tsx
var import_jsx_dev_runtime4 = require("react/jsx-dev-runtime");
function Card({
  children,
  className,
  as: As = "div",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
    As,
    {
      className: clsx(
        "bg-gray-100 dark:bg-gray-700 p-4 shadow-md dark:text-primary-50",
        className
      ),
      ...props,
      children
    },
    void 0,
    !1,
    {
      fileName: "app/components/index.tsx",
      lineNumber: 19,
      columnNumber: 5
    },
    this
  );
}
function Container({
  children,
  className,
  as: As = "div",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(As, { className: clsx("flex flex-col gap-4", className), ...props, children }, void 0, !1, {
    fileName: "app/components/index.tsx",
    lineNumber: 42,
    columnNumber: 5
  }, this);
}
function Danger({
  children,
  as: As = "span",
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(As, { className: clsx("text-red-700", className), ...props, children }, void 0, !1, {
    fileName: "app/components/index.tsx",
    lineNumber: 59,
    columnNumber: 5
  }, this);
}
function Button({
  className,
  variant = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
    "button",
    {
      ...props,
      className: clsx(
        variant === "primary" ? "bg-primary-600 text-primary-100 hover:bg-primary-500" : variant === "danger" ? "bg-red-100 text-red-900 border border-red-300 hover:bg-red-200" : "bg-primary-200 text-primary-900 hover:bg-primary-100",
        `
          border-0
          focus:outline-primary-700
          focus:ring-1
          focus:ring-primary-700
          focus:translate-x-0
          font-semibold
          hover:-translate-y-px
          hover:shadow-lg
          p-2
          rounded
          shadow-sm
        `.replace(/\s+/g, " "),
        className
      ),
      children
    },
    void 0,
    !1,
    {
      fileName: "app/components/index.tsx",
      lineNumber: 72,
      columnNumber: 5
    },
    this
  );
}
function Input({
  className,
  ...props
}) {
  let commonClasses = `
    bg-primary-50
    border-0
    dark:bg-primary-600
    dark:placeholder:text-primary-400
    dark:text-primary-100
    focus:ring-2
    focus:ring-inset
    focus:ring-primary-400
    focus:shadow-none
    outline
    outline-1
    outline-primary-300
    hover:outline-primary-400
    dark:outline-primary-500
    dark:hover:outline-primary-400
    rounded
    shadow-md
    text-sm
    w-full
  `.replace(/\s+/g, " ");
  return props.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("textarea", { ...props, className: clsx("form-textarea", commonClasses, className), children: props.value }, void 0, !1, {
    fileName: "app/components/index.tsx",
    lineNumber: 130,
    columnNumber: 5
  }, this) : (
    /* @ts-expect-error polymorphism is a pain to type properly */
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("input", { ...props, className: clsx("form-input block", commonClasses, className) }, void 0, !1, {
      fileName: "app/components/index.tsx",
      lineNumber: 135,
      columnNumber: 5
    }, this)
  );
}
function Legend({
  className = "",
  as: As = "legend",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
    As,
    {
      className: clsx(
        "p-2 -rotate-1 -skew-y-1 shadow-md italic font-medium",
        // !/\btext-/.test(className) &&
        "text-primary-800",
        // !/\bbg-/.test(className) &&
        "bg-primary-100",
        className
      ),
      ...props,
      children: props.children
    },
    void 0,
    !1,
    {
      fileName: "app/components/index.tsx",
      lineNumber: 147,
      columnNumber: 5
    },
    this
  );
}
var formCtx = import_react5.default.createContext(void 0);
function FormErrors(props) {
  if (!props.errors)
    return null;
  let errs = ensureArray(props.errors);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Container, { children: errs.map((err) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Danger, { as: "div", children: typeof err == "string" ? err : err.message }, err, !1, {
    fileName: "app/components/index.tsx",
    lineNumber: 241,
    columnNumber: 9
  }, this)) }, void 0, !1, {
    fileName: "app/components/index.tsx",
    lineNumber: 239,
    columnNumber: 5
  }, this);
}
function FormRow({
  label,
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("label", { className: clsx("flex flex-col sm:flex-row sm:items-center", className), children: [
    label && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "sm:w-5/12", children: label }, void 0, !1, {
      fileName: "app/components/index.tsx",
      lineNumber: 260,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: clsx(label && "sm:w-7/12"), children }, void 0, !1, {
      fileName: "app/components/index.tsx",
      lineNumber: 261,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/index.tsx",
    lineNumber: 259,
    columnNumber: 5
  }, this);
}
function clsx(...args) {
  let classes = [];
  for (let arg of args)
    if (arg) {
      if (typeof arg == "string" || typeof arg == "number")
        classes.push(arg.toString());
      else if (Array.isArray(arg) && arg.length) {
        let inner = clsx(...arg);
        inner && classes.push(inner);
      } else if (typeof arg == "object")
        for (let key in arg)
          ({}).hasOwnProperty.call(arg, key) && arg[key] && classes.push(key);
    }
  return classes.join(" ");
}
var SocialLoginServices = ["GitHub"];
function SocialLogin({
  label,
  redirectTo
}) {
  return SocialLoginServices.length < 1 ? null : /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "text-center", children: SocialLoginServices.map((service) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Button, { variant: "primary", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
    "a",
    {
      href: `/auth/${service.toLowerCase()}${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
      children: typeof label == "function" ? label(service) : `${label} with ${service}`
    },
    void 0,
    !1,
    {
      fileName: "app/components/index.tsx",
      lineNumber: 315,
      columnNumber: 11
    },
    this
  ) }, service, !1, {
    fileName: "app/components/index.tsx",
    lineNumber: 314,
    columnNumber: 9
  }, this)) }, void 0, !1, {
    fileName: "app/components/index.tsx",
    lineNumber: 312,
    columnNumber: 5
  }, this);
}

// app/routes/settings.tsx
var import_node2 = require("@remix-run/node"), import_react7 = require("@remix-run/react"), import_jsx_dev_runtime5 = require("react/jsx-dev-runtime");
async function loader({ context: { graphql } }) {
  let { data } = await graphql(ProfileSettingsDocument, {});
  if ((data == null ? void 0 : data.currentUser) == null)
    throw (0, import_node2.redirect)("/signin?redirectTo=/settings");
  return (0, import_node2.json)(data);
}
function SettingsPage() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Layout, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Container, { className: "max-w-4xl mx-auto mb-4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(UserProfile, {}, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 29,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(PasswordSettings, {}, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 30,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(EmailSettings, {}, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 31,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(LinkedAccounts, {}, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 32,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(DeleteAccount, {}, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 33,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 28,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 27,
    columnNumber: 5
  }, this);
}
function UserProfile() {
  var _a, _b, _c;
  let data = (0, import_react7.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(import_react7.Form, { method: "POST", action: "/settings", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("input", { type: "hidden", name: "id", value: (_a = data == null ? void 0 : data.currentUser) == null ? void 0 : _a.id }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 44,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Card, { as: "fieldset", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Legend, { children: "profile settings" }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Container, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormRow, { label: "username:", children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
          Input,
          {
            type: "text",
            name: "username",
            defaultValue: (_b = data == null ? void 0 : data.currentUser) == null ? void 0 : _b.username,
            placeholder: "username [required]",
            required: !0
          },
          void 0,
          !1,
          {
            fileName: "app/routes/settings.tsx",
            lineNumber: 49,
            columnNumber: 13
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 48,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormRow, { label: "name:", children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
          Input,
          {
            type: "text",
            name: "name",
            defaultValue: ((_c = data == null ? void 0 : data.currentUser) == null ? void 0 : _c.name) ?? void 0,
            placeholder: "name"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/settings.tsx",
            lineNumber: 58,
            columnNumber: 13
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 57,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { type: "submit", name: "type", value: "updateProfile", children: "update" }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 66,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 65,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormErrors, {}, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 71,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 43,
    columnNumber: 5
  }, this);
}
function PasswordSettings() {
  var _a, _b;
  let data = (0, import_react7.useLoaderData)(), response = (0, import_react7.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(import_react7.Form, { method: "POST", action: "/settings", children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Card, { as: "fieldset", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Legend, { children: "password settings" }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 84,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Container, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
        FormRow,
        {
          label: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", { children: "old password:" }, void 0, !1, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 87,
            columnNumber: 20
          }, this),
          className: (_a = data == null ? void 0 : data.currentUser) != null && _a.hasPassword ? "" : "hidden",
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
            Input,
            {
              type: "password",
              name: "oldPassword",
              required: ((_b = data == null ? void 0 : data.currentUser) == null ? void 0 : _b.hasPassword) ?? !1,
              minLength: 6
            },
            void 0,
            !1,
            {
              fileName: "app/routes/settings.tsx",
              lineNumber: 90,
              columnNumber: 13
            },
            this
          )
        },
        void 0,
        !1,
        {
          fileName: "app/routes/settings.tsx",
          lineNumber: 86,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormRow, { label: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", { children: "new password:" }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 97,
        columnNumber: 27
      }, this), children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Input, { type: "password", name: "newPassword", required: !0, minLength: 6 }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 98,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormRow, { label: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", { children: "confirm password:" }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 100,
        columnNumber: 27
      }, this), children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Input, { type: "password", name: "confirmPassword", required: !0, minLength: 6 }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 101,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { type: "submit", name: "type", value: "changePassword", children: "change password" }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 104,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 103,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 85,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormErrors, { errors: response == null ? void 0 : response.errors }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 109,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 83,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 82,
    columnNumber: 5
  }, this);
}
function EmailSettings() {
  var _a;
  let data = (0, import_react7.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Card, { as: "fieldset", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Legend, { children: "email settings" }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 119,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Container, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Container, { children: (_a = data == null ? void 0 : data.currentUser) == null ? void 0 : _a.userEmails.nodes.map((email) => {
          var _a2;
          return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
            Email,
            {
              email,
              hasOtherEmails: ((_a2 = data == null ? void 0 : data.currentUser) == null ? void 0 : _a2.userEmails.nodes.length) > 1
            },
            email.id,
            !1,
            {
              fileName: "app/routes/settings.tsx",
              lineNumber: 124,
              columnNumber: 15
            },
            this
          );
        }) }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 122,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
          FormErrors,
          {
            errors: data != null && data.currentUser && (data != null && data.currentUser.isVerified) ? null : "You do not have any verified email addresses, this will make account recovery impossible and may limit your available functionality within this application. Please complete email verification."
          },
          void 0,
          !1,
          {
            fileName: "app/routes/settings.tsx",
            lineNumber: 131,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 121,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(AddEmailForm, {}, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 139,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 120,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 118,
    columnNumber: 5
  }, this);
}
function Email({
  email,
  hasOtherEmails
}) {
  let canDelete = !email.isPrimary && hasOtherEmails;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("li", { className: "flex flex-row justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: [
      `\u2709\uFE0F ${email.email} `,
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "flex flex-row gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
          "span",
          {
            title: email.isVerified ? "Verified" : "Pending verification (please check your inbox / spam folder",
            children: email.isVerified ? "\u2705 " : /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Danger, { as: "small", children: "(unverified)" }, void 0, !1, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 165,
              columnNumber: 40
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/settings.tsx",
            lineNumber: 158,
            columnNumber: 11
          },
          this
        ),
        "Added ",
        new Date(Date.parse(email.createdAt)).toLocaleString()
      ] }, void 0, !0, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 157,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 155,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(import_react7.Form, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("input", { type: "hidden", name: "emailId", value: email.id }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 171,
        columnNumber: 9
      }, this),
      email.isPrimary && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("span", { children: "Primary" }, "primary_indicator", !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 172,
        columnNumber: 29
      }, this),
      canDelete && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
        Button,
        {
          type: "submit",
          name: "deleteEmail",
          onClick: () => deleteEmail({ variables: { emailId: email.id } }),
          children: "Delete"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/settings.tsx",
          lineNumber: 174,
          columnNumber: 11
        },
        this
      ),
      !email.isVerified && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
        Button,
        {
          variant: "primary",
          onClick: () => resendEmailVerification({ variables: { emailId: email.id } }),
          children: "Resend verification"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/settings.tsx",
          lineNumber: 183,
          columnNumber: 11
        },
        this
      ),
      email.isVerified && !email.isPrimary && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { onClick: () => makeEmailPrimary({ variables: { emailId: email.id } }), children: "Make primary" }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 191,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 170,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 154,
    columnNumber: 5
  }, this);
}
function AddEmailForm() {
  let [showForm, setShowForm] = (0, import_react6.useState)(!1);
  return showForm ? /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
    import_react7.Form,
    {
      onSubmit: async ({ values }) => {
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormRow, { label: "new email:", children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Input, { type: "email", name: "email", required: !0 }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 219,
          columnNumber: 9
        }, this) }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 218,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { type: "submit", children: "Add email" }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 222,
          columnNumber: 9
        }, this) }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 221,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormErrors, {}, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 224,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/routes/settings.tsx",
      lineNumber: 213,
      columnNumber: 5
    },
    this
  ) : /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { type: "submit", onClick: () => setShowForm(!0), children: "Add email" }, void 0, !1, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 206,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 205,
    columnNumber: 7
  }, this);
}
function UnlinkAccountButton({ id }) {
  let [modalOpen, setModalOpen] = (0, import_react6.useState)(!1), [errors, setErrors] = (0, import_react6.useState)();
  async function handleUnlink() {
    setModalOpen(!1);
    try {
      await doUnlink({ variables: { id } });
    } catch (e) {
      setErrors(e);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: [
    modalOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("b", { children: "Are you sure?" }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 247,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("p", { children: "If you unlink this account you won't be able to log in with it any more; please make sure your email is valid." }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 248,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { variant: "primary", onClick: () => setModalOpen(!1), children: "Cancel" }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 253,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { variant: "danger", onClick: handleUnlink, children: "Unlink" }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 256,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 252,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 246,
      columnNumber: 9
    }, this) : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { onClick: () => setModalOpen(!0), children: "Unlink" }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 262,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormErrors, { errors }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 263,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 244,
    columnNumber: 5
  }, this);
}
function LinkedAccounts() {
  var _a;
  let data = (0, import_react7.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Card, { as: "fieldset", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Legend, { children: "manage linked accounts" }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 272,
      columnNumber: 7
    }, this),
    (_a = data == null ? void 0 : data.currentUser) == null ? void 0 : _a.authentications.map((auth) => /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("strong", { children: auth.service }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 275,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: [
        "Added ",
        new Date(Date.parse(auth.createdAt)).toLocaleString()
      ] }, void 0, !0, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 276,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(UnlinkAccountButton, { id: auth.id }, "unlink", !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 277,
        columnNumber: 11
      }, this)
    ] }, auth.id, !0, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 274,
      columnNumber: 9
    }, this)),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(SocialLogin, { redirectTo: "/settings", label: (service) => `Link ${service} account` }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 280,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 271,
    columnNumber: 5
  }, this);
}
function DeleteAccount() {
  let [errors, setErrors] = (0, import_react6.useState)(null), [deleting, setDeleting] = (0, import_react6.useState)(!1), [deleted, setDeleted] = (0, import_react6.useState)(!1), [itIsDone, setItIsDone] = (0, import_react6.useState)(!1), [doingIt, setDoingIt] = (0, import_react6.useState)(!1), navigate = (0, import_react7.useNavigate)(), [params] = (0, import_react7.useSearchParams)(), logout = useLogout(), token = params.get("delete_token");
  function doIt() {
    setErrors(null), setDoingIt(!0), (async () => {
      try {
        let result = await requestAccountDeletion();
        result || setErrors("Result expected");
        let { data, errors: errors2 } = result;
        (!data || !data.requestAccountDeletion || !data.requestAccountDeletion.success) && (console.dir(errors2), setErrors("Requesting deletion failed")), setItIsDone(!0);
      } catch (e) {
        setErrors(e instanceof Error ? e.message : e);
      }
      setDoingIt(!1);
    })();
  }
  function confirmDeletion() {
    deleting || !token || (setErrors(null), setDeleting(!0), (async () => {
      try {
        setDeleted(!0), logout();
      } catch (e) {
        setErrors(e);
      }
      setDeleting(!1);
    })());
  }
  return deleted ? (navigate("/"), null) : /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Card, { as: "fieldset", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Legend, { className: "bg-red-700 text-red-100", children: "danger zone" }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 342,
      columnNumber: 7
    }, this),
    token ? /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("p", { children: [
        "This is it. ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("b", { children: "Press this button and your account will be deleted." }, void 0, !1, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 346,
          columnNumber: 25
        }, this),
        " We're sorry to see you go, please don't hesitate to reach out and let us know why you no longer want your account."
      ] }, void 0, !0, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 345,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("p", { className: "text-right", children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(
        Button,
        {
          variant: "danger",
          className: "font-bold",
          onClick: confirmDeletion,
          disabled: deleting,
          children: "PERMANENTLY DELETE MY ACCOUNT"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/settings.tsx",
          lineNumber: 351,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 350,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 344,
      columnNumber: 9
    }, this) : itIsDone ? /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: "You've been sent an email with a confirmation link in it, you must click it to confirm that you are the account holder so that you may continue deleting your account." }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 362,
      columnNumber: 9
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("p", { className: "text-right", children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Button, { variant: "danger", onClick: doIt, disabled: doingIt, children: "I want to delete my account" }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 368,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 367,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(FormErrors, { errors }, void 0, !1, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 373,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 341,
    columnNumber: 5
  }, this);
}
async function action({ request, context: { graphql } }) {
  let { type, ...formdata } = Object.fromEntries(await request.formData());
  console.log("changing settings:", { type, ...formdata });
  try {
    switch (type) {
      case "updateProfile": {
        console.log("updating profile");
        let { id, ...patch } = formdata, result = await graphql(UpdateUserDocument, { id, patch });
        return console.log(result), result;
      }
      case "changePassword": {
        let result = await graphql(ChangePasswordDocument, formdata);
        return console.log(result), result;
      }
    }
  } catch (e) {
    if (console.log("error changing password:", e), "message" in e)
      return (0, import_node2.json)({ error: e.message });
  }
  return (0, import_node2.json)("unknown error");
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  action: () => action2,
  default: () => Index,
  loader: () => loader2
});
var import_react8 = require("react"), import_node3 = require("@remix-run/node"), import_react9 = require("@remix-run/react");

// app/routes/post.tsx
var post_exports = {};
__export(post_exports, {
  Post: () => Post
});
var import_s_ago = __toESM(require("s-ago")), import_jsx_dev_runtime6 = require("react/jsx-dev-runtime");
function Post(post) {
  var _a;
  if (!post)
    return null;
  let createdAt = new Date(post.createdAt);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Card, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("h2", { className: "text-3xl font-bold", children: post.title }, void 0, !1, {
      fileName: "app/routes/post.tsx",
      lineNumber: 10,
      columnNumber: 7
    }, this),
    post.body ? /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "prose max-h-[80vh] overflow-auto", children: post.body.split(`

`).map((p, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { children: p }, i, !1, {
      fileName: "app/routes/post.tsx",
      lineNumber: 14,
      columnNumber: 13
    }, this)) }, void 0, !1, {
      fileName: "app/routes/post.tsx",
      lineNumber: 12,
      columnNumber: 9
    }, this) : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("ul", { className: "flex flex-row gap-2 items-baseline", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: "text-primary-100 bg-primary-700 p-1", children: [
        "by ",
        (_a = post.user) == null ? void 0 : _a.username
      ] }, void 0, !0, {
        fileName: "app/routes/post.tsx",
        lineNumber: 19,
        columnNumber: 9
      }, this),
      post.tags.map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("li", { className: "text-primary-100 bg-primary-700 p-1", children: [
        "#",
        t
      ] }, t, !0, {
        fileName: "app/routes/post.tsx",
        lineNumber: 21,
        columnNumber: 11
      }, this)),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: "bg-gray-50", children: (0, import_s_ago.default)(createdAt) }, void 0, !1, {
        fileName: "app/routes/post.tsx",
        lineNumber: 25,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/post.tsx",
      lineNumber: 18,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/post.tsx",
    lineNumber: 9,
    columnNumber: 5
  }, this);
}

// app/routes/_index.tsx
var import_jsx_dev_runtime7 = require("react/jsx-dev-runtime");
async function loader2({ context: { graphql } }) {
  let { data } = await graphql(LatestPostsDocument);
  return (0, import_node3.json)(data);
}
function Index() {
  var _a;
  let [showForm, setShowForm] = (0, import_react8.useState)(!1), data = (0, import_react9.useLoaderData)(), actionData = (0, import_react9.useActionData)(), navigation = (0, import_react9.useNavigation)();
  return console.log(navigation), /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Layout, { children: [
    data != null && data.currentUser && showForm ? /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(import_react9.Form, { method: "post", className: "max-w-2xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Card, { as: "fieldset", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Legend, { children: "new post" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 25,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Container, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Input, { placeholder: "title", type: "text", name: "title", required: !0 }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 27,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Input, { placeholder: "body", type: "textarea", name: "body", required: !0 }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 28,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "flex flex-row gap-4 [&>*]:grow", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Button, { variant: "primary", type: "submit", children: "send" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 30,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Button, { type: "reset", children: "cancel" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 33,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 29,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 26,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(FormErrors, {}, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 36,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 24,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 23,
      columnNumber: 9
    }, this) : data != null && data.currentUser ? /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
      Button,
      {
        variant: "primary",
        className: "text-2xl font-bold px-4",
        disabled: navigation.state !== "idle",
        onClick: () => setShowForm(!0),
        children: "create post"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 41,
        columnNumber: 11
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 40,
      columnNumber: 9
    }, this) : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "flex flex-row flex-wrap gap-4 shrink-0", children: (_a = data == null ? void 0 : data.posts) == null ? void 0 : _a.nodes.map((post) => /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Post, { ...post }, post.id, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 53,
      columnNumber: 11
    }, this)) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 51,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 21,
    columnNumber: 5
  }, this);
}
async function action2({ request, context: { graphql } }) {
  let variables = Object.fromEntries(await request.formData());
  variables.tags = ["test"];
  try {
    let { data, errors } = await graphql(CreatePostDocument, variables);
    if (errors)
      throw errors[0];
    return (0, import_node3.json)(data);
  } catch (err) {
    throw console.error(err), err;
  }
}

// app/routes/forgot.tsx
var forgot_exports = {};
__export(forgot_exports, {
  action: () => action3,
  default: () => ForgotPassword,
  loader: () => loader3
});
var import_react10 = require("@remix-run/react"), import_jsx_dev_runtime8 = require("react/jsx-dev-runtime");
async function loader3({ context: { graphql } }) {
  let { data } = await graphql(SharedLayoutDocument);
  return data;
}
function ForgotPassword() {
  let actionData = (0, import_react10.useActionData)(), navigation = (0, import_react10.useNavigation)();
  return actionData && console.log(actionData), /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Layout, { forbidWhen: (auth) => auth.LOGGED_IN, children: navigation.state !== "idle" ? /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Card, { children: "We've sent a link to your email. Please check your email and click the link and follow the instructions. If you don't receive the link, please ensure you entered the email address correctly, and check in your spam folder just in case." }, void 0, !1, {
    fileName: "app/routes/forgot.tsx",
    lineNumber: 18,
    columnNumber: 9
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(import_react10.Form, { method: "post", className: "mx-auto md:max-w-4xl p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Card, { as: "fieldset", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Legend, { children: "forgot password" }, void 0, !1, {
      fileName: "app/routes/forgot.tsx",
      lineNumber: 26,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Container, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(FormRow, { label: "email:", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Input, { name: "email", type: "email", required: !0 }, void 0, !1, {
        fileName: "app/routes/forgot.tsx",
        lineNumber: 29,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/forgot.tsx",
        lineNumber: 28,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Button, { type: "submit", children: "Reset Password" }, void 0, !1, {
        fileName: "app/routes/forgot.tsx",
        lineNumber: 32,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/forgot.tsx",
        lineNumber: 31,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(FormErrors, {}, void 0, !1, {
        fileName: "app/routes/forgot.tsx",
        lineNumber: 34,
        columnNumber: 15
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/forgot.tsx",
      lineNumber: 27,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/forgot.tsx",
    lineNumber: 25,
    columnNumber: 11
  }, this) }, void 0, !1, {
    fileName: "app/routes/forgot.tsx",
    lineNumber: 24,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/forgot.tsx",
    lineNumber: 16,
    columnNumber: 5
  }, this);
}
async function action3({ request, context: { graphql } }) {
  let values = Object.fromEntries(await request.formData());
  console.log("received reset request for", values);
  let { data } = await graphql(ForgotPasswordDocument, values);
  return console.log(data), data;
}

// app/routes/signin.tsx
var signin_exports = {};
__export(signin_exports, {
  action: () => action4,
  default: () => Login,
  loader: () => loader4
});
var import_react11 = require("@remix-run/react");
var import_node4 = require("@remix-run/node"), import_jsx_dev_runtime9 = require("react/jsx-dev-runtime");
async function loader4({ context: { graphql } }) {
  let { data } = await graphql(SharedLayoutDocument);
  return (0, import_node4.json)(data);
}
function Login() {
  let [params] = (0, import_react11.useSearchParams)(), redirectTo = params.get("redirectTo") ?? void 0;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Layout, { forbidWhen: (auth) => auth.LOGGED_IN, children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(import_react11.Form, { method: "post", className: "mx-auto max-w-4xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Card, { as: "fieldset", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Legend, { children: "log in" }, void 0, !1, {
      fileName: "app/routes/signin.tsx",
      lineNumber: 29,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "pb-4 border-b border-primary-300", children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(SocialLogin, { label: "log in", redirectTo }, void 0, !1, {
      fileName: "app/routes/signin.tsx",
      lineNumber: 31,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/routes/signin.tsx",
      lineNumber: 30,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Container, { className: "mt-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(FormRow, { label: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { children: "username:" }, void 0, !1, {
        fileName: "app/routes/signin.tsx",
        lineNumber: 34,
        columnNumber: 29
      }, this), children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Input, { type: "text", name: "username", placeholder: "or email", required: !0 }, void 0, !1, {
        fileName: "app/routes/signin.tsx",
        lineNumber: 35,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/routes/signin.tsx",
        lineNumber: 34,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(FormRow, { label: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { children: "password:" }, void 0, !1, {
        fileName: "app/routes/signin.tsx",
        lineNumber: 37,
        columnNumber: 29
      }, this), children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Input, { type: "password", name: "password", placeholder: "********", required: !0 }, void 0, !1, {
        fileName: "app/routes/signin.tsx",
        lineNumber: 38,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/routes/signin.tsx",
        lineNumber: 37,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Button, { variant: "primary", type: "submit", children: "log in" }, void 0, !1, {
          fileName: "app/routes/signin.tsx",
          lineNumber: 41,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(FormErrors, {}, void 0, !1, {
          fileName: "app/routes/signin.tsx",
          lineNumber: 44,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(import_react11.Link, { to: "/forgot", children: "forgot your password?" }, void 0, !1, {
          fileName: "app/routes/signin.tsx",
          lineNumber: 45,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/signin.tsx",
        lineNumber: 40,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/signin.tsx",
      lineNumber: 33,
      columnNumber: 11
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/signin.tsx",
    lineNumber: 28,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/signin.tsx",
    lineNumber: 27,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/signin.tsx",
    lineNumber: 26,
    columnNumber: 5
  }, this);
}
async function action4({ request, context: { graphql } }) {
  var _a;
  let variables = Object.fromEntries(await request.formData()), searchParams = new URL(request.url).searchParams, params = Object.fromEntries(searchParams);
  if (!("username" in variables))
    throw new Error("missing username");
  if (!("password" in variables))
    throw new Error("missing password");
  console.log({ params, searchParams });
  let { data, errors } = await graphql(LoginDocument, variables);
  if (errors)
    throw errors;
  if (!((_a = data == null ? void 0 : data.login) != null && _a.user.id))
    throw new Error("error in login?");
  return (0, import_node4.redirect)(params.redirectTo || "/");
}

// app/routes/signup.tsx
var signup_exports = {};
__export(signup_exports, {
  action: () => action5,
  default: () => SignUp,
  loader: () => loader5
});
var import_react12 = require("@remix-run/react");

// app/middleware/index.ts
var import_node5 = require("@remix-run/node"), tap = (f) => (x) => (f(x), x), log = tap(console.log), loaders = (...fns) => (ctx, next) => {
  let index = -1, locals = {};
  function dispatch(i) {
    if (i <= index)
      return Promise.reject("next() called more than once in middleware");
    index = i;
    let fn = i === fns.length ? next : fns[i];
    if (!fn)
      return Promise.resolve();
    try {
      return Promise.resolve(fn(Object.assign(ctx, { locals }), dispatch.bind(null, i + 1)));
    } catch (err) {
      return Promise.reject(err);
    }
  }
  return dispatch(0);
}, fromGraphQL = (document, variables) => async (ctx) => {
  console.log("fetching:", document.loc.source.body);
  let response = await ctx.context.graphql(document, variables);
  if (console.log(response), response.errors)
    throw response.errors[1] ? Error(response.errors) : response.errors[0];
  return ctx.locals.currentUser = response.data.currentUser, response.data;
}, AuthRestrict2 = /* @__PURE__ */ ((AuthRestrict3) => (AuthRestrict3[AuthRestrict3.NEVER = 0] = "NEVER", AuthRestrict3[AuthRestrict3.LOGGED_OUT = 1] = "LOGGED_OUT", AuthRestrict3[AuthRestrict3.LOGGED_IN = 2] = "LOGGED_IN", AuthRestrict3[AuthRestrict3.NOT_MOD = 4] = "NOT_MOD", AuthRestrict3[AuthRestrict3.NOT_ADMIN = 8] = "NOT_ADMIN", AuthRestrict3))(AuthRestrict2 || {}), forbidWhen = (when) => async (ctx, next) => {
  let forbidWhen2 = when(AuthRestrict2), forbidsLoggedOut = forbidWhen2 & 1 /* LOGGED_OUT */, forbidsLoggedIn = forbidWhen2 & 2 /* LOGGED_IN */, forbidsNotMod = forbidWhen2 & 4 /* NOT_MOD */, forbidsNotAdmin = forbidWhen2 & 8 /* NOT_ADMIN */;
  if (await next(), !(ctx.locals && "currentUser" in ctx.locals))
    throw new Error("cannot auth without currentUser data in request");
  let currentUser = ctx.locals.currentUser, currentLocation = new URL(ctx.request.url).pathname;
  if (currentUser && (forbidsLoggedIn || forbidsNotAdmin && currentUser.role !== "ADMIN"))
    throw forbidsLoggedIn || console.info("auth check failed against user", currentUser.username), (0, import_node5.redirect)("/");
  if (currentUser == null && forbidsLoggedOut)
    throw (0, import_node5.redirect)(`/signup?next=${encodeURIComponent(currentLocation)}`);
};

// app/routes/signup.tsx
var import_node6 = require("@remix-run/node"), import_jsx_dev_runtime10 = require("react/jsx-dev-runtime"), loader5 = loaders(
  fromGraphQL(SharedLayoutDocument, {}),
  forbidWhen((auth) => auth.LOGGED_IN)
);
function SignUp() {
  let data = (0, import_react12.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Layout, { user: data == null ? void 0 : data.currentUser, children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_react12.Form, { method: "post", className: "mx-auto max-w-4xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Card, { as: "fieldset", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Legend, { children: "sign up" }, void 0, !1, {
      fileName: "app/routes/signup.tsx",
      lineNumber: 29,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "pb-4 border-b border-primary-300", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(SocialLogin, { label: "sign up" }, void 0, !1, {
      fileName: "app/routes/signup.tsx",
      lineNumber: 31,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/routes/signup.tsx",
      lineNumber: 30,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Container, { className: "mt-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        FormRow,
        {
          label: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_jsx_dev_runtime10.Fragment, { children: [
            "email",
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Danger, { as: "small", children: "*" }, void 0, !1, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 37,
              columnNumber: 24
            }, this),
            ":"
          ] }, void 0, !0, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 36,
            columnNumber: 17
          }, this),
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Input, { type: "email", name: "email", autoCapitalize: "false", required: !0 }, void 0, !1, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 41,
            columnNumber: 15
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/signup.tsx",
          lineNumber: 34,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        FormRow,
        {
          label: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_jsx_dev_runtime10.Fragment, { children: [
            "username",
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Danger, { as: "small", children: "*" }, void 0, !1, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 46,
              columnNumber: 27
            }, this),
            ":"
          ] }, void 0, !0, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 45,
            columnNumber: 17
          }, this),
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
            Input,
            {
              type: "text",
              name: "username",
              autoCapitalize: "false",
              autoComplete: "false",
              required: !0
            },
            void 0,
            !1,
            {
              fileName: "app/routes/signup.tsx",
              lineNumber: 50,
              columnNumber: 15
            },
            this
          )
        },
        void 0,
        !1,
        {
          fileName: "app/routes/signup.tsx",
          lineNumber: 43,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        FormRow,
        {
          label: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_jsx_dev_runtime10.Fragment, { children: [
            "password",
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Danger, { as: "small", children: "*" }, void 0, !1, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 61,
              columnNumber: 27
            }, this),
            ":"
          ] }, void 0, !0, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 60,
            columnNumber: 17
          }, this),
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Input, { type: "password", name: "password", required: !0, minLength: 6 }, void 0, !1, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 65,
            columnNumber: 15
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/signup.tsx",
          lineNumber: 58,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
        FormRow,
        {
          label: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_jsx_dev_runtime10.Fragment, { children: [
            "confirm password",
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Danger, { as: "small", children: "*" }, void 0, !1, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 70,
              columnNumber: 35
            }, this),
            ":"
          ] }, void 0, !0, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 69,
            columnNumber: 17
          }, this),
          children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Input, { type: "password", name: "confirmPassword", required: !0, minLength: 6 }, void 0, !1, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 74,
            columnNumber: 15
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/signup.tsx",
          lineNumber: 67,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(FormRow, { label: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("span", { children: "your name:" }, void 0, !1, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 76,
        columnNumber: 29
      }, this), children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Input, { type: "text", name: "name" }, void 0, !1, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 77,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 76,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Button, { type: "submit", children: "register" }, void 0, !1, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 80,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(FormErrors, {}, void 0, !1, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 81,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 79,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/signup.tsx",
      lineNumber: 33,
      columnNumber: 11
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/signup.tsx",
    lineNumber: 28,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/signup.tsx",
    lineNumber: 27,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/signup.tsx",
    lineNumber: 26,
    columnNumber: 5
  }, this);
}
var action5 = async ({ request, context: { graphql } }) => {
  var _a, _b;
  let formdata = Object.fromEntries(await request.formData()), params = Object.fromEntries(new URL(request.url).searchParams), response = await graphql(RegisterDocument, formdata);
  if (console.log(response), !((_b = (_a = response.data) == null ? void 0 : _a.register) != null && _b.user.id))
    return (0, import_node6.json)(response);
  throw (0, import_node6.redirect)(params.redirectTo || "/");
};

// app/routes/verify.tsx
var verify_exports = {};
__export(verify_exports, {
  default: () => Verify,
  loader: () => loader6
});
var import_node7 = require("@remix-run/node"), import_react13 = require("@remix-run/react"), import_jsx_dev_runtime11 = require("react/jsx-dev-runtime");
async function loader6({ request, context: { graphql } }) {
  var _a, _b, _c, _d;
  let searchParams = Object.fromEntries(new URL(request.url).searchParams), result = await graphql(VerifyEmailDocument, searchParams);
  return console.log(result), (0, import_node7.json)({
    ...(_b = (_a = result.data) == null ? void 0 : _a.verifyEmail) == null ? void 0 : _b.query,
    message: (_d = (_c = result.data) == null ? void 0 : _c.verifyEmail) != null && _d.success ? "Thank you for verifying your email address. You may now close this window." : "Incorrect token, please check and try again"
  });
}
function Verify() {
  let { message } = (0, import_react13.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(Layout, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(Card, { className: "m-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(Container, { className: "p-4 items-center", children: message }, void 0, !1, {
    fileName: "app/routes/verify.tsx",
    lineNumber: 24,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/verify.tsx",
    lineNumber: 23,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/verify.tsx",
    lineNumber: 22,
    columnNumber: 5
  }, this);
}

// app/routes/reset.tsx
var reset_exports = {};
__export(reset_exports, {
  action: () => action6,
  default: () => ResetPage,
  loader: () => loader7
});
var import_react14 = require("react"), import_node8 = require("@remix-run/node"), import_react15 = require("@remix-run/react");
var import_jsx_dev_runtime12 = require("react/jsx-dev-runtime");
async function loader7({ context: { graphql } }) {
  let { data } = await graphql(SharedLayoutDocument);
  return data;
}
function ResetPage() {
  let [params] = (0, import_react15.useSearchParams)(), actionData = (0, import_react15.useActionData)(), [errors, setErrors] = (0, import_react14.useState)(null), userId = params.get("userId"), token = params.get("token");
  return /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Layout, { forbidWhen: (auth) => auth.NEVER, children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "mx-auto max-w-4xl", children: [
    actionData && "message" in actionData ? /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Card, { className: "bg-red-100 mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(FormErrors, { errors: actionData.message }, void 0, !1, {
      fileName: "app/routes/reset.tsx",
      lineNumber: 25,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/routes/reset.tsx",
      lineNumber: 24,
      columnNumber: 11
    }, this) : null,
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
      import_react15.Form,
      {
        method: "post",
        onSubmit: (ev) => {
          let values = Object.fromEntries(new FormData(ev.currentTarget));
          if (values.password !== values.confirmPassword)
            return setErrors("passwords must match"), ev.preventDefault();
          setErrors(null);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Card, { as: "fieldset", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Legend, { children: "Reset password:" }, void 0, !1, {
              fileName: "app/routes/reset.tsx",
              lineNumber: 40,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Container, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(FormRow, { label: "Choose a new passphrase:", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Input, { name: "password", type: "password", required: !0, autoComplete: "new-password" }, void 0, !1, {
                fileName: "app/routes/reset.tsx",
                lineNumber: 43,
                columnNumber: 17
              }, this) }, void 0, !1, {
                fileName: "app/routes/reset.tsx",
                lineNumber: 42,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(FormRow, { label: "Confirm passphrase", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(
                Input,
                {
                  name: "confirmPassword",
                  type: "password",
                  required: !0,
                  autoComplete: "new-password"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/reset.tsx",
                  lineNumber: 46,
                  columnNumber: 17
                },
                this
              ) }, void 0, !1, {
                fileName: "app/routes/reset.tsx",
                lineNumber: 45,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(FormErrors, { errors }, void 0, !1, {
                fileName: "app/routes/reset.tsx",
                lineNumber: 53,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Button, { variant: "primary", children: "Reset passphrase" }, void 0, !1, {
                fileName: "app/routes/reset.tsx",
                lineNumber: 54,
                columnNumber: 15
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/reset.tsx",
              lineNumber: 41,
              columnNumber: 13
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/reset.tsx",
            lineNumber: 39,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Input, { name: "token", type: "hidden", value: token }, void 0, !1, {
            fileName: "app/routes/reset.tsx",
            lineNumber: 57,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Input, { name: "userId", type: "hidden", value: userId }, void 0, !1, {
            fileName: "app/routes/reset.tsx",
            lineNumber: 58,
            columnNumber: 11
          }, this)
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/routes/reset.tsx",
        lineNumber: 28,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/routes/reset.tsx",
    lineNumber: 22,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/reset.tsx",
    lineNumber: 21,
    columnNumber: 5
  }, this);
}
async function action6({ request, context: { graphql } }) {
  var _a, _b;
  let values = Object.fromEntries(await request.formData()), result = await graphql(ResetPasswordDocument, values);
  return result.errors ? (console.log(result.errors), (0, import_node8.json)({ message: "An error occurred" })) : (_b = (_a = result.data) == null ? void 0 : _a.resetPassword) != null && _b.success ? (0, import_node8.json)({ message: "Your password was reset; you can go and log in now" }) : (0, import_node8.json)({ message: "Incorrect token, please check and try again" });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-FSYIO2ZK.js", imports: ["/build/_shared/chunk-ZWGWGGVF.js", "/build/_shared/chunk-GIAAE3CH.js", "/build/_shared/chunk-XU7DNSPJ.js", "/build/_shared/chunk-3ORMOPIX.js", "/build/_shared/chunk-QWDH2ZI7.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-BOXFZXVX.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-STEEVD3P.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-ZEKG4MR5.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-FRWDQBRX.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/forgot": { id: "routes/forgot", parentId: "root", path: "forgot", index: void 0, caseSensitive: void 0, module: "/build/routes/forgot-YZSRDMTT.js", imports: ["/build/_shared/chunk-FRWDQBRX.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/post": { id: "routes/post", parentId: "root", path: "post", index: void 0, caseSensitive: void 0, module: "/build/routes/post-IZ3XBZG5.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/reset": { id: "routes/reset", parentId: "root", path: "reset", index: void 0, caseSensitive: void 0, module: "/build/routes/reset-OS2OHGQM.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-FRWDQBRX.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/settings": { id: "routes/settings", parentId: "root", path: "settings", index: void 0, caseSensitive: void 0, module: "/build/routes/settings-67Y6STLL.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-FRWDQBRX.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/signin": { id: "routes/signin", parentId: "root", path: "signin", index: void 0, caseSensitive: void 0, module: "/build/routes/signin-NSHBLDBO.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-FRWDQBRX.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-6QLPT3GO.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-FRWDQBRX.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/verify": { id: "routes/verify", parentId: "root", path: "verify", index: void 0, caseSensitive: void 0, module: "/build/routes/verify-OGKI35GE.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-FRWDQBRX.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, version: "d3e24f30", hmr: { runtime: "/build/_shared/chunk-QWDH2ZI7.js", timestamp: 1690402270480 }, url: "/build/manifest-D3E24F30.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { v2_dev: !0, unstable_postcss: !1, unstable_tailwind: !1, v2_errorBoundary: !0, v2_headers: !0, v2_meta: !0, v2_normalizeFormMethod: !0, v2_routeConvention: !0 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/settings": {
    id: "routes/settings",
    parentId: "root",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: settings_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/forgot": {
    id: "routes/forgot",
    parentId: "root",
    path: "forgot",
    index: void 0,
    caseSensitive: void 0,
    module: forgot_exports
  },
  "routes/signin": {
    id: "routes/signin",
    parentId: "root",
    path: "signin",
    index: void 0,
    caseSensitive: void 0,
    module: signin_exports
  },
  "routes/signup": {
    id: "routes/signup",
    parentId: "root",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: signup_exports
  },
  "routes/verify": {
    id: "routes/verify",
    parentId: "root",
    path: "verify",
    index: void 0,
    caseSensitive: void 0,
    module: verify_exports
  },
  "routes/reset": {
    id: "routes/reset",
    parentId: "root",
    path: "reset",
    index: void 0,
    caseSensitive: void 0,
    module: reset_exports
  },
  "routes/post": {
    id: "routes/post",
    parentId: "root",
    path: "post",
    index: void 0,
    caseSensitive: void 0,
    module: post_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
