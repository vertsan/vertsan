import { createFileRoute } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import SectionHeading from "#/components/ui/section-heading";
import { Skeleton } from "#/components/ui/skeleton";

export const Route = createFileRoute("/visitors")({
	component: RouteComponent,
});

type CountryRow = {
	countryCode: string;
	countryName: string;
	visitors: number;
	views: number;
	lastSeenAt: string;
};

function flagEmoji(code: string) {
	if (!/^[A-Z]{2}$/.test(code) || code === "XX") return "🌐";
	return String.fromCodePoint(
		...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
	);
}

function RouteComponent() {
	const [rows, setRows] = useState<CountryRow[] | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch("/api/visitor-countries")
			.then((res) => (res.ok ? res.json() : Promise.reject()))
			.then((data: { countries: CountryRow[] }) => setRows(data.countries))
			.catch(() => setError(true));
	}, []);

	const totalVisitors = rows?.reduce((sum, r) => sum + r.visitors, 0) ?? 0;
	const totalViews = rows?.reduce((sum, r) => sum + r.views, 0) ?? 0;

	return (
		<section className="min-h-screen py-16 md:py-24 bg-muted/30">
			<div className="max-w-4xl mx-auto w-full space-y-10 px-4 sm:px-6">
				<SectionHeading
					title="Visitors by Country"
					description="Where people are viewing this website from"
				/>

				<div className="grid gap-4 sm:grid-cols-3">
					{[
						{ label: "Countries", value: rows?.length ?? 0 },
						{ label: "Visitors", value: totalVisitors },
						{ label: "Page views", value: totalViews },
					].map((stat) => (
						<Card key={stat.label} className="border shadow-sm">
							<CardHeader className="pb-2">
								<CardDescription>{stat.label}</CardDescription>
								<CardTitle className="text-3xl tabular-nums">
									{rows ? (
										stat.value.toLocaleString()
									) : (
										<Skeleton className="h-8 w-16" />
									)}
								</CardTitle>
							</CardHeader>
						</Card>
					))}
				</div>

				<Card className="border shadow-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Globe2 className="size-5 text-primary" />
							Countries
						</CardTitle>
					</CardHeader>
					<CardContent>
						{error ? (
							<p className="text-sm text-muted-foreground">
								Couldn't load visitor countries right now.
							</p>
						) : !rows ? (
							<div className="space-y-3">
								{[...Array(5)].map((_, i) => (
									<Skeleton key={i} className="h-8 w-full" />
								))}
							</div>
						) : rows.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No visitors recorded yet.
							</p>
						) : (
							<ul className="space-y-4">
								{rows.map((row) => {
									const share = totalVisitors
										? (row.visitors / totalVisitors) * 100
										: 0;
									return (
										<li key={row.countryCode} className="space-y-1.5">
											<div className="flex items-center justify-between gap-3 text-sm">
												<span className="flex items-center gap-2 font-medium">
													<span className="text-xl leading-none" aria-hidden>
														{flagEmoji(row.countryCode)}
													</span>
													{row.countryName}
												</span>
												<span className="text-muted-foreground tabular-nums">
													{row.visitors.toLocaleString()} visitors ·{" "}
													{row.views.toLocaleString()} views
												</span>
											</div>
											<div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
												<div
													className="h-full rounded-full bg-primary"
													style={{ width: `${Math.max(share, 2)}%` }}
												/>
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
