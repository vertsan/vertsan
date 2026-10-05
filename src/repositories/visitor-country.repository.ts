import { desc, sql } from "drizzle-orm";
import { type DbInstance, getDb } from "#/db/index";
import { visitorCountries } from "#/db/schema";

let tableReady: Promise<void> | null = null;

// Migrations for this project are applied manually (drizzle-kit push), so make
// sure the table exists before the first write instead of failing at runtime.
function ensureTable(dbInstance: DbInstance) {
	if (!tableReady) {
		tableReady = dbInstance
			.execute(sql`
				CREATE TABLE IF NOT EXISTS visitor_countries (
					id serial PRIMARY KEY,
					country_code text NOT NULL,
					country_name text NOT NULL,
					visitors integer NOT NULL DEFAULT 0,
					views integer NOT NULL DEFAULT 0,
					last_seen_at timestamp NOT NULL DEFAULT now()
				)
			`)
			.then(() =>
				dbInstance.execute(sql`
					CREATE UNIQUE INDEX IF NOT EXISTS visitor_country_code_idx
					ON visitor_countries (country_code)
				`),
			)
			.then(() => undefined)
			.catch((err) => {
				tableReady = null;
				throw err;
			});
	}
	return tableReady;
}

export function createVisitorCountryRepository(
	dbInstance: DbInstance = getDb(),
) {
	async function record(
		countryCode: string,
		countryName: string,
		{ newVisitor, view }: { newVisitor: boolean; view: boolean },
	) {
		if (!newVisitor && !view) return;
		await ensureTable(dbInstance);
		const visitors = newVisitor ? 1 : 0;
		const views = view ? 1 : 0;
		await dbInstance
			.insert(visitorCountries)
			.values({ countryCode, countryName, visitors, views })
			.onConflictDoUpdate({
				target: visitorCountries.countryCode,
				set: {
					countryName,
					visitors: sql`${visitorCountries.visitors} + ${visitors}`,
					views: sql`${visitorCountries.views} + ${views}`,
					lastSeenAt: new Date(),
				},
			});
	}

	async function findAll() {
		await ensureTable(dbInstance);
		return dbInstance
			.select({
				countryCode: visitorCountries.countryCode,
				countryName: visitorCountries.countryName,
				visitors: visitorCountries.visitors,
				views: visitorCountries.views,
				lastSeenAt: visitorCountries.lastSeenAt,
			})
			.from(visitorCountries)
			.orderBy(desc(visitorCountries.visitors), desc(visitorCountries.views));
	}

	return { record, findAll };
}
