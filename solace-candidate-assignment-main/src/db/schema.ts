import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  pgEnum,
} from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["ADMIN", "USER", "ADVOCATE"]);

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("payload").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP AT TIME ZONE 'UTC'`),
});

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP AT TIME ZONE 'UTC'`).notNull(),
  dateUpdated: timestamp("date_updated", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP AT TIME ZONE 'UTC'`).notNull(),
  numberOfLogins: integer("number_of_logins").default(0).notNull(),
  role: roleEnum("role").default("USER").notNull(),
});

export { advocates, users };
