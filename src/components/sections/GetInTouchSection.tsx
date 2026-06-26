import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from "lucide-react";
import Strands from "#/components/react-bits/Strands/Strands";
import { Button } from "#/components/ui/button";

export default function GetInTouchSection() {
	return (
		<section className="relative overflow-hidden py-24 md:py-32 bg-background">
			<div className="max-w-6xl mx-auto px-4 sm:px-6">
				<div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
					<div className="relative aspect-[4/3] md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden bg-muted/20 border">
						<Strands
							colors={["#F97316", "#7C3AED", "#06B6D4"]}
							count={6}
							speed={0.5}
							amplitude={1}
							waviness={1.5}
							thickness={0.8}
							glow={2.8}
							taper={3}
							spread={1.2}
							intensity={0.7}
							saturation={1.8}
							opacity={0.9}
							scale={1.3}
							glass
							refraction={0.8}
							dispersion={0.6}
							glassSize={0.5}
						/>
					</div>

					<div className="space-y-8">
						<div className="space-y-4">
							<p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
								Contact
							</p>

							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
								Get in <span className="text-primary">Touch</span>
							</h2>

							<p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
								Have a project in mind or just want to say hello? I'd love to
								hear from you.
							</p>
						</div>

						<div className="space-y-4">
							<Button size="lg" className="gap-2 w-full sm:w-auto" asChild>
								<a href="mailto:hello@vertsan.com">
									<Mail className="size-5" />
									Send a Message
									<ArrowUpRight className="size-4" />
								</a>
							</Button>
						</div>

						<div className="space-y-3">
							<div className="flex items-center gap-2 text-muted-foreground text-sm">
								<MapPin className="size-4 shrink-0" />
								<span>Cambodia</span>
							</div>

							<div className="flex items-center gap-5 pt-2">
								{[
									{ href: "https://github.com/vertsan", label: "GitHub", icon: Github },
									{ href: "https://linkedin.com/in/vertsan", label: "LinkedIn", icon: Linkedin },
									{ href: "mailto:hello@vertsan.com", label: "Email", icon: Mail },
								].map(({ href, label, icon: Icon }) => (
									<a
										key={label}
										href={href}
										target="_blank"
										rel="noreferrer"
										className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-200"
										aria-label={label}
									>
										<Icon className="size-5" />
									</a>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
