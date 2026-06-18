import { ArrowUpRight, Award, Calendar, ExternalLink } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { useLiveContent } from "#/lib/useLiveContent";

function CertificatesShimmer() {
	return (
		<section className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30">
			<div className="max-w-5xl mx-auto space-y-12">
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-44 mx-auto" />
					<Skeleton className="h-5 w-64 mx-auto" />
				</div>
				<div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(3)].map((_, i) => (
						<Card key={i} className="border shadow-sm">
							<CardHeader>
								<div className="flex items-start gap-3">
									<Skeleton className="size-10 rounded-lg shrink-0" />
									<div className="space-y-2 flex-1">
										<Skeleton className="h-5 w-40" />
										<Skeleton className="h-4 w-28" />
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-4/5" />
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-12" />
								</div>
								<div className="flex gap-1.5 pt-1">
									<Skeleton className="h-5 w-14 rounded-full" />
									<Skeleton className="h-5 w-18 rounded-full" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

export default function CertificatesSection() {
	const { items: certs, loading } = useLiveContent<Record<string, unknown>>("certificates");
	const location = useLocation();
	const showBreadcrumb = location.pathname === "/certificates" || location.pathname === "/certificates/";
	const isHome = location.pathname === "/";
	const MAX_HOME = 6;

	if (loading && certs.length === 0) return <CertificatesShimmer />;

	const sortedCerts = [...certs].sort((a, b) => {
		return (
			new Date((b as Record<string, unknown>).date as string).getTime() -
			new Date((a as Record<string, unknown>).date as string).getTime()
		);
	});

	const displayed = isHome ? sortedCerts.slice(0, MAX_HOME) : sortedCerts;

	return (
		<section
			id="certificates"
			className="py-16 md:py-24 px-4 sm:px-6 bg-muted/30 scroll-mt-20"
		>
			<div className="max-w-5xl mx-auto space-y-12">
				{showBreadcrumb && (
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Certificates</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				)}
				<div className="text-center space-y-4">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
						Certificates
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
						Professional certifications and achievements
					</p>
				</div>

				<div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{displayed.map((cert) => (
						<Card
							key={(cert as Record<string, any>).title as string}
							className="group border shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/15 transition-all duration-300 gap-4 md:gap-6 py-4 md:py-6"
						>
							<CardHeader className="px-4 md:px-6">
								<div className="flex items-start gap-3">
									<div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
										<Award className="size-5" />
									</div>
									<div className="space-y-1">
										<CardTitle className="text-base leading-snug group-hover:text-primary transition-colors duration-300">
											{(cert as Record<string, any>).title as string}
										</CardTitle>
										<CardDescription>
											{(cert as Record<string, any>).issuer as string}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-3 px-4 md:px-6">
								<p className="text-sm text-muted-foreground leading-relaxed">
									{(cert as Record<string, any>).summary as string}
								</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
										<Calendar className="size-3" />
										<span>{(cert as Record<string, any>).date as string}</span>
									</div>
									{(cert as Record<string, any>).credentialUrl && (
										<a
											href={
												(cert as Record<string, any>).credentialUrl as string
											}
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
										>
											Verify
											<ExternalLink className="size-3" />
										</a>
									)}
								</div>
								<div className="flex flex-wrap gap-1.5 pt-1">
									{((cert as Record<string, any>).tags as string[])?.map(
										(tag: string) => (
											<Badge
												key={tag}
												variant="outline"
												className="text-xs transition-colors duration-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
											>
												{tag}
											</Badge>
										),
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{isHome && (
					<div className="text-center">
						<Button variant="outline" asChild>
							<Link to="/certificates" className="gap-2">
								See all certificates
								<ArrowUpRight className="size-3.5" />
							</Link>
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
