import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

const config = {
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: false,
};

export default config;
