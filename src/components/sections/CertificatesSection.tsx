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

export default function CertificatesSection() {
	const sortedCerts = [...allCertificates].sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return (
		<section id="certificates" className="py-24 px-6">
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
							key={cert.title}
							className="border shadow-sm hover:shadow-md transition-shadow"
						>
							<CardHeader>
								<div className="flex items-start gap-3">
									<div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
										<Award className="size-5" />
									</div>
									<div className="space-y-1">
										<CardTitle className="text-base leading-snug">
											{cert.title}
										</CardTitle>
										<CardDescription>{cert.issuer}</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								<p className="text-sm text-muted-foreground leading-relaxed">
									{cert.summary}
								</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
										<Calendar className="size-3" />
										<span>{cert.date}</span>
									</div>
									{cert.credentialUrl && (
										<a
											href={cert.credentialUrl}
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
									{cert.tags.map((tag) => (
										<Badge key={tag} variant="outline" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
