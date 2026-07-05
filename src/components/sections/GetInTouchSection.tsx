import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Strands from "#/components/Strands";
import { Button } from "#/components/ui/button";

export default function GetInTouchSection() {
	return (
		<section className="relative overflow-hidden py-24 md:py-32 bg-background">
			<div className="max-w-6xl mx-auto px-4 sm:px-6">
				<div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="relative h-[300px] sm:h-[400px] md:h-[550px] rounded-2xl overflow-hidden bg-muted/20 border order-2 md:order-1"
					>
						<Strands
							colors={["#F97316", "#7C3AED", "#06B6D4"]}
							count={3}
							speed={0.5}
							amplitude={1}
							waviness={1}
							thickness={0.7}
							glow={2.6}
							taper={3}
							spread={1}
							intensity={0.6}
							saturation={2}
							opacity={1}
							scale={1.5}
							glass={false}
							refraction={1}
							dispersion={1}
							glassSize={1}
							hueShift={0}
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
						className="space-y-8 order-1 md:order-2"
					>
						<div className="space-y-4">
							<p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
								Contact
							</p>

							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
								Get in <span className="text-primary">Touch</span>
							</h2>

							<p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
								Have a project in mind or just want to say hello? I'd love to hear from you.
							</p>
						</div>

						<div className="space-y-4">
							<Button size="lg" className="gap-2 w-full sm:w-auto group" asChild>
								<a href="mailto:hello@vertsan.com">
									<Mail className="size-5" />
									Send a Message
									<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</a>
							</Button>
						</div>

						<div className="space-y-4">
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPin className="size-4 shrink-0" />
								<span className="text-sm">Cambodia</span>
							</div>

							<div className="flex items-center gap-4">
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
										className="inline-flex items-center justify-center size-10 rounded-full border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
										aria-label={label}
									>
										<Icon className="size-4" />
									</a>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
