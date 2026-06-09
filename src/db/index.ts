import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

function getConnectionString(): string {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error(
			"DATABASE_URL environment variable is not set. " +
				"Create a .env file with DATABASE_URL pointing to your PostgreSQL database.",
		);
	}
	return connectionString;
}

export function getDb() {
	if (!_db) {
		const pool = new pg.Pool({ connectionString: getConnectionString() });
		_db = drizzle(pool, { schema });
	}
	return _db;
}

export type DbInstance = ReturnType<typeof getDb>;
