import { Express } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import { getWebsocketMiddlewares } from "../app";
import { installPassportStrategy } from "./installPassportStrategy";

interface DbSession {
  session_id: string;
}

export async function installPassport(app: Express) {
  passport.serializeUser((sessionObject: DbSession, done) => {
    done(null, sessionObject.session_id);
  });

  passport.deserializeUser((session_id: string, done) => {
    done(null, { session_id });
  });

  const passportInitializeMiddleware = passport.initialize();
  app.use(passportInitializeMiddleware);
  getWebsocketMiddlewares(app).push(passportInitializeMiddleware);

  const passportSessionMiddleware = passport.session();
  app.use(passportSessionMiddleware);
  getWebsocketMiddlewares(app).push(passportSessionMiddleware);

  app.get("/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  if (process.env.GITHUB_KEY) {
    await installPassportStrategy(app, {
      service: "github",
      strategy: GitHubStrategy,
      strategyConfig: {
        clientID: process.env.GITHUB_KEY,
        clientSecret: process.env.GITHUB_SECRET,
        scope: ["user:email"],
      },
      tokenNames: ["token", "tokenSecret"],
      authenticateConfig: {},
      getUserInformation({ profile }) {
        return {
          id: profile.id,
          displayName: profile?.displayName ?? profile.username,
          username: profile.username,
          avatarUrl: profile?.photos?.[0]?.value,
          email: profile.email || profile?.emails?.[0]?.value,
        }
      },
    });
  }
}
