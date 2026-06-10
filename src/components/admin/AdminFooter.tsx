import { ArrowLeft, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

const year = new Date().getFullYear();

export default function AdminFooter() {
	return (
		<footer className="border-t border-border bg-card">
			<div className="flex items-center justify-between px-6 py-3">
				<p className="text-xs text-muted-foreground">
					&copy; {year} VertSan CMS. All rights reserved.
				</p>
				<div className="flex items-center gap-4">
					<Button variant="link" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground h-auto p-0">
						<Link to="/">
							<ArrowLeft className="size-3" />
							Back to Site
						</Link>
					</Button>
					<p className="text-xs text-muted-foreground/60 flex items-center gap-1">
						Built with <Heart className="size-3 text-red-500 fill-red-500" /> using TanStack Start
					</p>
				</div>
			</div>
		</footer>
	);
}
