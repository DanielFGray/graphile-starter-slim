import { type ActionArgs, type LoaderArgs, redirect } from "@remix-run/node";
import { type GraphQLExecutor } from "remix.env";
import { type SharedLayout_UserFragment } from "~/generated";

type Middleware<A = unknown, R = unknown> = (
  ...args: Array<A>
) => (args: LoaderArgs, next: () => Promise<void>) => Promise<R>;

export const loaders =
  (...fns: Array<ReturnType<Middleware>>) =>
  (ctx: ActionArgs, next: () => Promise<void>) => {
    let index = -1;
    const locals = {};
    function dispatch(i): Promise<any> {
      if (i <= index) return Promise.reject("next() called more than once in middleware");
      index = i;
      const fn = i === fns.length ? next : fns[i];
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(Object.assign(ctx, { locals }), dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };

export const fromGraphQL: Middleware<Parameters<GraphQLExecutor>> =
  (document, variables) => async ctx => {
    const response = await ctx.context.graphql(document, variables);
    if (response.errors) {
      if (response.errors[1]) throw Error(response.errors);
      throw response.errors[0];
    }
    ctx.locals.currentUser = response.data.currentUser;
    return response.data;
  };

enum AuthRestrict {
  NEVER = 0,
  LOGGED_OUT = 1 << 0,
  LOGGED_IN = 1 << 1,
  NOT_MOD = 1 << 2,
  NOT_ADMIN = 1 << 3,
}

export const forbidWhen: Middleware<(auth: typeof AuthRestrict) => AuthRestrict> =
  when => async (ctx, next) => {
    await next();
    const forbidWhen = when(AuthRestrict);
    const forbidsLoggedOut = forbidWhen & AuthRestrict.LOGGED_OUT;
    const forbidsLoggedIn = forbidWhen & AuthRestrict.LOGGED_IN;
    const forbidsNotMod = forbidWhen & AuthRestrict.NOT_MOD;
    const forbidsNotAdmin = forbidWhen & AuthRestrict.NOT_ADMIN;
    if (!(ctx.locals && "currentUser" in ctx.locals)) {
      throw new Error("cannot auth without currentUser data in request");
    }
    const currentUser = ctx.locals.currentUser as null | SharedLayout_UserFragment;
    if (currentUser && (forbidsLoggedIn || (forbidsNotAdmin && currentUser.role !== "ADMIN"))) {
      if (!forbidsLoggedIn) console.info("auth check failed against user", currentUser.username);
      throw redirect("/");
    } else if (currentUser == null && forbidsLoggedOut) {
      const location = new URL(ctx.request.url);
      throw redirect(`/signup?redirectTo=${encodeURIComponent(location.pathname)}`);
    }
  };
