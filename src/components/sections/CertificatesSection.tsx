import { allCertificates } from "content-collections";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { useLiveContent } from "#/lib/useLiveContent";

export default function CertificatesSection() {
	const { items: certs } = useLiveContent("certificates", allCertificates);

	const sortedCerts = [...certs].sort((a, b) => {
		return (
			new Date((b as Record<string, unknown>).date as string).getTime() -
			new Date((a as Record<string, unknown>).date as string).getTime()
		);
	});

	return (
		<section
			id="certificates"
			className="py-24 px-6 bg-muted/30 scroll-mt-20"
		>
			<div className="max-w-5xl mx-auto space-y-12">
				<div className="text-center space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
						Certificates
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Professional certifications and achievements
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{sortedCerts.map((cert) => (
						<Card
							key={(cert as Record<string, any>).title as string}
							className="group border shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/15 transition-all duration-300"
						>
							<CardHeader>
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
							<CardContent className="space-y-3">
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
			</div>
		</section>
	);
}
