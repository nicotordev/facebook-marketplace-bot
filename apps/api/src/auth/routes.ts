import { Hono } from "hono";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db, usersTable } from "../db";
import { eq } from "drizzle-orm";
import { jwtAuth, type AuthUser } from "./middleware";

const auth = new Hono<{ Variables: { user: AuthUser } }>();

auth.post("/register", async (c) => {
  const body = await c.req.json<{
    username: string;
    password: string;
    name?: string;
    email?: string;
    age?: number;
  }>();
  const { username, password, name, email, age } = body;

  if (!username?.trim() || !password) {
    return c.json({ error: "username y password son obligatorios" }, 400);
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username.trim()))
    .limit(1);
  if (existing.length > 0) {
    return c.json({ error: "El usuario ya existe" }, 409);
  }

  const hash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({
      username: username.trim(),
      password: hash,
      name: name ?? null,
      email: email ?? null,
      age: age ?? null,
    })
    .returning({ id: usersTable.id, username: usersTable.username, name: usersTable.name, email: usersTable.email, age: usersTable.age });

  if (!user) return c.json({ error: "Error al crear usuario" }, 500);

  const secret = process.env["JWT_SECRET"]!;
  const token = jwt.sign({ sub: user.id }, secret, { expiresIn: "7d" });

  return c.json(
    {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        age: user.age,
      },
    },
    201
  );
});

auth.post("/login", async (c) => {
  const body = await c.req.json<{ username: string; password: string }>();
  const { username, password } = body;

  if (!username?.trim() || !password) {
    return c.json({ error: "username y password son obligatorios" }, 400);
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username.trim()))
    .limit(1);
  if (!user) {
    return c.json({ error: "Usuario o contraseña incorrectos" }, 401);
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return c.json({ error: "Usuario o contraseña incorrectos" }, 401);
  }

  const secret = process.env["JWT_SECRET"]!;
  const token = jwt.sign({ sub: user.id }, secret, { expiresIn: "7d" });

  return c.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      age: user.age,
    },
  });
});

auth.get("/me", jwtAuth, (c) => {
  return c.json(c.get("user"));
});

export { auth };
