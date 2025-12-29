---
description: Enforce Drizzle ORM best practices, Neon connection conventions, secure database migration, and UUIDv7 usage for primary keys.
alwaysApply: true
glob: "**/*.ts,**/*.tsx"
---

## 🔑 Primary Keys and UUIDv7 (Priority 1: Identity & Uniqueness)

1. **ID Standard:** All primary keys (`id`) in tables **MUST** use the **`uuid()`** data type. UUIDv7 provides time-ordered globally unique identifiers optimized for database indexing.

2. **UUIDv7 Generation:** Utilize the built-in PostgreSQL function for UUIDv7 generation using **`default: sql`uuid_generate_v7()``**. **FORBIDDEN:** Never generate IDs on the application side. Use a reusable helper for consistency:
   ```typescript
   // _custom-types.ts
   export const primaryUUID = (name: string) =>
     uuid(name).primaryKey().default(sql`uuid_generate_v7()`);

   // Usage in schema
   id: primaryUUID("id"),
   ```

3. **UUID Extension Requirement:** Ensure the `uuid-ossp` or equivalent extension is installed in PostgreSQL before using `uuid_generate_v7()`. Add this to your first migration if needed:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

4. **Machine IDs and Non-Primary UUIDs:** For additional UUID fields (e.g., `machineId`, `sessionId`), also use `uuid_generate_v7()` for consistency and temporal ordering benefits.

## 🎯 Schema Organization and Type Safety

5. **Schema Directory Structure:** Define all database schemas in a dedicated **`packages/db/src/schemas/`** directory. Organize by domain/feature for clarity:
   ```
   schemas/
   ├── _custom-types.ts    # Reusable helpers & custom types
   ├── index.ts            # Central export point
   ├── auth.ts             # Authentication tables
   ├── users.ts            # User-related tables
   └── posts.ts            # Content tables
   ```

6. **Schema Export Convention:** Use the `$` suffix for table definitions to distinguish them from type definitions:
   ```typescript
   export const users$ = pgTable("users", { ... });
   export type UserSelect = typeof users$.$inferSelect;
   export type UserInsert = typeof users$.$inferInsert;
   ```

7. **Type Inference (NO Manual Interfaces):** Always use Drizzle's built-in type inference utilities. **FORBIDDEN:** Never manually define TypeScript interfaces that mirror the schema:
   ```typescript
   // ✅ CORRECT - Use Drizzle's inference
   export type UserSelect = typeof users$.$inferSelect;
   export type UserInsert = typeof users$.$inferInsert;
   export type UserUpdate = Partial<Omit<UserInsert, "id" | "createdAt">>;

   // ❌ FORBIDDEN - Manual interface duplication
   interface User {
     id: string;
     email: string;
     // ... manual duplication
   }
   ```

8. **Central Schema Export:** Export all schemas from a central `index.ts` file and import the complete schema object in your database connection:
   ```typescript
   // schemas/index.ts
   export * from "./auth";
   export * from "./users";

   // db/index.ts
   import * as schema from "./schemas";
   export const db = drizzle(sql, { schema });
   ```

## 🔗 Relations and Foreign Keys

9. **Referential Integrity:** Always enforce foreign key constraints using **`references()`** with appropriate deletion behavior:
   ```typescript
   userId: uuid("user_id")
     .references(() => users$.id, { onDelete: "cascade" })
     .notNull(),
   ```

10. **Deletion Strategies:**
    - **`cascade`**: Delete dependent records (e.g., user sessions when user deleted)
    - **`set null`**: Preserve records but nullify reference (e.g., optional author reference)
    - **`restrict`** (default): Prevent deletion if dependents exist

11. **Relations Definition:** Define bidirectional relations using the `relations()` function with clear naming constants:
    ```typescript
    const USER_SESSION = "user_session";

    export const usersRelations$ = relations(users$, ({ many }) => ({
      sessions: many(sessions$, { relationName: USER_SESSION }),
    }));

    export const sessionsRelations$ = relations(sessions$, ({ one }) => ({
      user: one(users$, {
        fields: [sessions$.userId],
        references: [users$.id],
        relationName: USER_SESSION,
      }),
    }));
    ```

## 📊 Indexing Strategy (Performance Critical)

12. **Index All Foreign Keys:** Every foreign key column **MUST** have an explicit index for join performance:
    ```typescript
    (table) => [
      index("sessions_user_id_idx").on(table.userId),
    ]
    ```

13. **Index Frequently Queried Columns:** Add indexes for columns used in `WHERE`, `ORDER BY`, and `JOIN` clauses:
    ```typescript
    (table) => [
      index("users_email_idx").on(table.email),
      index("users_last_login_idx").on(table.lastLoginAt),
    ]
    ```

14. **Composite Indexes for Common Query Patterns:** Create multi-column indexes for frequently combined filters:
    ```typescript
    (table) => [
      // Single column indexes first
      index("quotes_user_id_idx").on(table.userId),
      index("quotes_created_at_idx").on(table.createdAt),

      // Then composite indexes for common patterns
      index("quotes_user_created_idx").on(table.userId, table.createdAt),
    ]
    ```

15. **Unique Constraints as Indexes:** For unique columns that are also searched, use `.unique()` which automatically creates an index:
    ```typescript
    email: text("email").notNull().unique(), // Auto-indexed
    ```

## 🛠️ Custom Types and Reusable Helpers

16. **Custom Type Definition:** Create custom column types for domain-specific data with validation and transformation logic in **`_custom-types.ts`**:
    ```typescript
    export const phone = customType<{ data: string }>({
      dataType() { return "varchar(20)"; },
      toDriver(value) {
        // Validation and normalization
        return normalizedValue;
      },
      fromDriver(value) {
        return value as string;
      },
    });
    ```

17. **Common Column Patterns:** Define reusable column sets for consistency:
    ```typescript
    export const defaultColumns = {
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    } as const;

    // Usage
    export const posts$ = pgTable("posts", {
      id: primaryUUID("id"),
      title: text("title").notNull(),
      ...defaultColumns,
    });
    ```

18. **Enum Definitions:** Use `pgEnum` for fixed value sets with TypeScript type integration:
    ```typescript
    export const roles = pgEnum(
      "roles",
      Object.values(Role) as [string, ...string[]],
    );

    // Usage
    roles: roles("roles")
      .array()
      .$type<Role[]>()
      .default([Role.USER])
      .notNull(),
    ```

## 🚀 Neon Database Connection

19. **Neon HTTP Driver:** Use the `@neondatabase/serverless` package with the HTTP driver for optimal performance:
    ```typescript
    import { neon, neonConfig } from "@neondatabase/serverless";
    import { drizzle } from "drizzle-orm/neon-http";
    import ws from "ws";
    import * as schema from "./schemas";

    neonConfig.webSocketConstructor = ws;

    const sql = neon(process.env.DATABASE_URL || "");
    export const db = drizzle(sql, { schema });
    ```

20. **Edge Runtime Configuration:** For Cloudflare Workers or Vercel Edge, enable query over fetch:
    ```typescript
    neonConfig.poolQueryViaFetch = true; // For edge environments only
    ```

21. **Database Singleton Pattern:** Export a single database instance and reuse it throughout the application. **FORBIDDEN:** Do not create new connections per request:
    ```typescript
    // packages/db/src/index.ts
    export const db = drizzle(sql, { schema });
    export type Database = typeof db;

    // services/users.service.ts
    import { db, type Database } from "@taxi/db";
    ```

22. **Environment Variables:** Store the Neon connection string securely as **`DATABASE_URL`** environment variable. Never commit connection strings to version control.

## 🔄 Migrations and Schema Evolution

23. **Migration Generation (Drizzle Kit):** Always use Drizzle Kit CLI to generate migrations after schema changes:
    ```bash
    bun run db:generate  # Generates migration from schema
    ```

24. **Migration Review:** Always review generated migration files before applying. Check for:
    - Proper index creation
    - Data migration needs (for schema changes)
    - Correct constraint definitions

25. **Migration Naming:** Use descriptive migration names when possible, but rely on Drizzle Kit's auto-generated names for consistency.

26. **Migration Application:** Use `drizzle-kit push` for development and `drizzle-kit migrate` for production:
    ```json
    // package.json
    {
      "scripts": {
        "db:push": "drizzle-kit push",        // Dev: direct schema push
        "db:studio": "drizzle-kit studio",     // UI for database
        "db:generate": "drizzle-kit generate", // Generate migration files
        "db:migrate": "drizzle-kit migrate"    // Apply migrations
      }
    }
    ```

27. **Migration Isolation:** Store migrations in **`packages/db/src/migrations/`** separate from schema definitions. **FORBIDDEN:** Never manually edit generated SQL migration files.

28. **Schema as Single Source of Truth:** The TypeScript schema files are the source of truth. Migrations are generated artifacts. Always modify the schema files, never the migrations directly.

## ⚡ Query Optimization and Performance

29. **Prepared Statements for Hot Paths:** Create prepared statements for frequently executed queries in a dedicated `*.prepare.ts` file:
    ```typescript
    // users.prepare.ts
    export const findUserById = db
      .select()
      .from(users$)
      .where(eq(users$.id, sql.placeholder("id")))
      .prepare("findUserById");

    // Usage
    const [user] = await findUserById.execute({ id: userId });
    ```

30. **Query Builder vs Query API:** Choose the appropriate API based on complexity:
    ```typescript
    // Simple queries: Use db.query (Relational Query API)
    const user = await db.query.users$.findFirst({
      where: eq(users$.email, email),
      with: { sessions: true },
    });

    // Complex queries: Use query builder
    const users = await db
      .select()
      .from(users$)
      .leftJoin(sessions$, eq(users$.id, sessions$.userId))
      .where(and(eq(users$.active, true), gt(sessions$.expiresAt, new Date())));
    ```

31. **Single Record Queries:** For fetching a single record, use `.findFirst()` or `.limit(1)`:
    ```typescript
    // ✅ CORRECT
    const user = await db.query.users$.findFirst({
      where: eq(users$.id, id),
    });

    // ✅ ALSO CORRECT
    const [user] = await db.select().from(users$).where(eq(users$.id, id)).limit(1);

    // ❌ AVOID - Fetches all records
    const users = await db.select().from(users$).where(eq(users$.id, id));
    const user = users[0];
    ```

32. **Batch Operations:** Use batch inserts for multiple records:
    ```typescript
    await db.insert(users$).values([user1, user2, user3]);
    ```

33. **Transactions:** Use transactions for operations that must succeed or fail atomically:
    ```typescript
    await db.transaction(async (tx) => {
      await tx.insert(users$).values(newUser);
      await tx.insert(identities$).values(newIdentity);
    });
    ```

## 📝 Code Style and Documentation

34. **Schema Documentation:** Add JSDoc comments to schema files explaining the purpose and relationships:
    ```typescript
    /**
     * Users table schema.
     * Stores core user account information and authentication state.
     */
    export const users$ = pgTable("users", { ... });
    ```

35. **Column Naming Convention:** Use snake_case for database column names, camelCase in TypeScript:
    ```typescript
    firstName: text("first_name").notNull(), // DB: first_name, TS: firstName
    ```

36. **Explicit NOT NULL:** Always explicitly define `.notNull()` or allow null with proper typing:
    ```typescript
    // Required field
    email: text("email").notNull(),

    // Optional field
    phone: text("phone"), // Allows null
    ```

37. **Default Values:** Set default values at the database level when appropriate:
    ```typescript
    emailVerified: boolean("email_verified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    ```

## 🧪 Testing and Development

38. **Database Studio:** Use Drizzle Studio for visual database exploration during development:
    ```bash
    bun run db:studio
    ```

39. **Schema Push in Development:** Use `db:push` for rapid iteration in development (skips migrations):
    ```bash
    bun run db:push  # Directly syncs schema to database
    ```

40. **Separate Test Database:** Always use a separate database instance for testing. Never test against production data.
