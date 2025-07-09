DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('ADMIN', 'USER', 'ADVOCATE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"date_updated" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"number_of_logins" integer DEFAULT 0 NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "advocates" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;