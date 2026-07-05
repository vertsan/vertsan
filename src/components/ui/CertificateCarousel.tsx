import { Award, Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

interface Certificate {
	title: string;
	issuer: string;
	date: string;
	summary: string;
	credentialUrl?: string;
	tags?: string[];
}

interface CertificateCarouselProps {
	certificates: Certificate[];
}

export default function CertificateCarousel({ certificates }: CertificateCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [touchStart, setTouchStart] = useState(0);

	if (certificates.length === 0) return null;

	const prev = () => setActiveIndex((i) => (i === 0 ? certificates.length - 1 : i - 1));
	const next = () => setActiveIndex((i) => (i === certificates.length - 1 ? 0 : i + 1));

	const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
	const onTouchEnd = (e: React.TouchEvent) => {
		const diff = touchStart - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
	};

	const cert = certificates[activeIndex];

	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="relative overflow-hidden rounded-2xl border bg-background/50 backdrop-blur-sm shadow-lg">
				<div
					className="flex transition-transform duration-500 ease-out"
					style={{ transform: `translateX(-${activeIndex * 100}%)` }}
					onTouchStart={onTouchStart}
					onTouchEnd={onTouchEnd}
				>
					{certificates.map((c, idx) => (
						<div key={idx} className="min-w-0 w-full shrink-0 px-6 py-8">
							<div className="flex items-start gap-4">
								<div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
									<Award className="size-6" />
								</div>
								<div className="space-y-3 flex-1 min-w-0">
									<div>
										<h4 className="text-lg font-semibold leading-snug">{c.title}</h4>
										<p className="text-sm text-muted-foreground">{c.issuer}</p>
									</div>
									<p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
										{c.summary}
									</p>
									<div className="flex items-center justify-between flex-wrap gap-2">
										<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
											<Calendar className="size-3" />
											<span>{c.date}</span>
										</div>
										{c.credentialUrl && (
											<Button variant="outline" size="sm" asChild>
												<a href={c.credentialUrl} target="_blank" rel="noreferrer" className="gap-1.5">
													View Certificate
													<ExternalLink className="size-3" />
												</a>
											</Button>
										)}
									</div>
									{c.tags && c.tags.length > 0 && (
										<div className="flex flex-wrap gap-1.5">
											{c.tags.map((tag) => (
												<Badge key={tag} variant="outline" className="text-xs">
													{tag}
												</Badge>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{certificates.length > 1 && (
					<>
						<button
							onClick={prev}
							className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background transition-colors"
							aria-label="Previous"
						>
							<ChevronLeft className="size-4" />
						</button>
						<button
							onClick={next}
							className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background transition-colors"
							aria-label="Next"
						>
							<ChevronRight className="size-4" />
						</button>

						<div className="flex justify-center gap-1.5 pb-4">
							{certificates.map((_, idx) => (
								<button
									key={idx}
									onClick={() => setActiveIndex(idx)}
									className={cn(
										"size-1.5 rounded-full transition-all duration-300",
										idx === activeIndex
											? "w-5 bg-primary"
											: "bg-muted-foreground/30 hover:bg-muted-foreground/50",
									)}
									aria-label={`Go to certificate ${idx + 1}`}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
