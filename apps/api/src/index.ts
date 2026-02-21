import "dotenv/config";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { auth, jwtAuth } from "./auth";
import "./auth/passport";

/**
 * Define los tipos para las variables de entorno
 * En Bun, se acceden vía `process.env` o `import.meta.env`
 */
type Bindings = {
  PORT: string;
  NODE_ENV: string;
};

type AuthVariables = {
  user: {
    id: number;
    username: string;
    name: string | null;
    email: string | null;
    age: number | null;
  };
};

const app = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>();

// Middlewares estándar
app.use("*", logger());
app.use("*", cors());

// API v1 group
const apiV1 = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>();

// Ruta base
apiV1.get("/", (c) => {
  return c.json({
    status: "online",
    runtime: "Bun",
    version: Bun.version,
    timestamp: new Date().toISOString(),
  });
});

// Ejemplo de endpoint para salud del sistema
apiV1.get("/health", (c) => c.text("OK", 200));

// Auth (registro, login, /me con JWT)
apiV1.route("/auth", auth);

// Mount the v1 api under /api/v1
app.route("/api/v1", apiV1);

/**
 * Exportación nativa para Bun
 * Bun detecta este export default y levanta el servidor automáticamente
 */
export default {
  port: process.env["PORT"] ?? 3001,
  fetch: app.fetch,
};
