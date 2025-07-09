import { config as dotenvConfig } from 'dotenv';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { advocates, users } from "../schema";
import { advocateData } from "./advocatesLarge";
import { userData } from "./users";

dotenvConfig();

const runSeed = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  console.log("🌱 Seeding database...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  try {
    await db.delete(advocates);
    console.log("✅ Cleared existing advocate data");

    await db.delete(users);
    console.log("✅ Cleared existing user data");

    const advocateRecords = await db.insert(advocates).values(advocateData).returning();
    console.log(`✅ Successfully seeded ${advocateRecords.length} advocates`);

    const userRecords = await db.insert(users).values(userData).returning();
    console.log(`✅ Successfully seeded ${userRecords.length} users`);

    await sql.end();
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
    await sql.end();
    process.exit(1);
  }
};

runSeed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }); 