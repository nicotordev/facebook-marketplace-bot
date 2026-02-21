import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

/**
 * Define los tipos para las variables de entorno
 * En Bun, se acceden vía `process.env` o `import.meta.env`
 */
type Bindings = {
  PORT: string;
  NODE_ENV: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middlewares estándar
app.use('*', logger());
app.use('*', cors());

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
app.get('/health', (c) => c.text('OK', 200));

/**
 * Exportación nativa para Bun
 * Bun detecta este export default y levanta el servidor automáticamente
 */
export default {
  port: process.env["PORT"] ?? 3001,
  fetch: app.fetch,
};
