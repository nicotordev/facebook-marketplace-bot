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

type AuthVariables = { user: { id: number; username: string; name: string | null; email: string | null; age: number | null } };

const app = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>();

// Middlewares estándar
app.use('*', logger());
app.use('*', cors());
// Middleware de autenticación
app.use("*", jwtAuth);
// Ruta base
app.get('/', (c) => {
  return c.json({
    status: 'online',
    runtime: 'Bun',
    version: Bun.version,
    timestamp: new Date().toISOString()
  });
});

// Ejemplo de endpoint para salud del sistema
app.get("/health", (c) => c.text("OK", 200));

// Auth (registro, login, /me con JWT)
app.route("/auth", auth);
/**
 * Exportación nativa para Bun
 * Bun detecta este export default y levanta el servidor automáticamente
 */
export default {
  port: process.env["PORT"] ?? 3001,
  fetch: app.fetch,
};
