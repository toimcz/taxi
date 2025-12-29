import { neon, neonConfig } from "@neondatabase/serverless";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";
import * as schema from "./schemas";

neonConfig.webSocketConstructor = ws;
const sql = neon(process.env.DATABASE_URL || "");

export type Database = NeonHttpDatabase<typeof schema>;

export const db = drizzle(sql, { schema });
