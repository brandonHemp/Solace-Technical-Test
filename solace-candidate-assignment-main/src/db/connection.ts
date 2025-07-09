import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Global connection pool to prevent memory leaks
let globalConnection: postgres.Sql | null = null;
let globalDb: ReturnType<typeof drizzle> | null = null;

export const getDbConnection = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  if (globalConnection && globalDb) {
    return globalDb;
  }

  globalConnection = postgres(process.env.DATABASE_URL, {
    max: 1, // Limit connections
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    transform: undefined,
    onnotice: undefined,
  });

  globalDb = drizzle(globalConnection);
  
  return globalDb;
};

export const closeDbConnection = async () => {
  if (globalConnection) {
    await globalConnection.end();
    globalConnection = null;
    globalDb = null;
  }
};

// Use this for API routes that need a connection
export const withDbConnection = async <T>(
  callback: (db: ReturnType<typeof drizzle>) => Promise<T>
): Promise<T> => {
  const db = getDbConnection();
  return await callback(db);
}; 