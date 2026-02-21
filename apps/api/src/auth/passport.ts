import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, type StrategyOptions } from "passport-jwt";
import { db, usersTable } from "../db";
import { eq } from "drizzle-orm";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env["JWT_SECRET"]!,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, payload.sub as number));
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

/** Request-like object for Passport (usa request.headers['authorization']) */
export function createMockReq(headers: { authorization?: string }) {
  return { headers: { authorization: headers.authorization ?? null } };
}

/** Autentica con JWT vía Passport y devuelve el user o null. Para usar en middleware Hono. */
export function authenticateJwt(
  authHeader: string | undefined
): Promise<{ id: number; username: string; name: string | null; email: string | null; age: number | null } | null> {
  return new Promise((resolve) => {
    const req = createMockReq({ authorization: authHeader ?? undefined });
    const res = {} as any;
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error | null, user: typeof usersTable.$inferSelect | false) => {
        if (err) return resolve(null);
        if (!user) return resolve(null);
        resolve({
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          age: user.age,
        });
      }
    )(req, res, () => resolve(null));
  });
}
