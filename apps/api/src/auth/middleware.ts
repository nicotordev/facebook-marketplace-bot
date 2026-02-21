import type { Context, Next } from "hono";
import { authenticateJwt } from "./passport";

export type AuthUser = {
  id: number;
  username: string;
  name: string | null;
  email: string | null;
  age: number | null;
};

export async function jwtAuth(c: Context<{ Variables: { user: AuthUser } }>, next: Next) {
  const authHeader = c.req.header("Authorization");
  const user = await authenticateJwt(authHeader ?? undefined);
  if (!user) {
    return c.json({ error: "No autorizado" }, 401);
  }
  c.set("user", user);
  await next();
}
