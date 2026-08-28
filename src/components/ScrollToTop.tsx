import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "#/lib/utils";

export default function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 480);
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<button
			type="button"
			onClick={scrollTop}
			aria-label="Scroll to top"
			title="Scroll to top"
			className={cn(
				"fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-95 flex size-11 items-center justify-center rounded-full border border-border/60 bg-background/95 text-foreground shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 hover:border-primary/30 hover:text-primary focus-visible:scale-110 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:size-12",
				visible
					? "translate-y-0 opacity-100"
					: "pointer-events-none translate-y-3 opacity-0",
			)}
		>
			<ArrowUp className="size-5" />
		</button>
	);
}
