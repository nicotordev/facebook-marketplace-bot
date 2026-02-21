import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle(process.env["DB_FILE_NAME"] ?? ":memory:");

export { db };
export * from "./schema";
