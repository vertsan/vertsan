import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { cn } from "#/lib/utils";

interface NavbarProps {
	children: React.ReactNode;
	className?: string;
	threshold?: number;
}

interface NavBodyProps {
	children: React.ReactNode;
	className?: string;
	visible?: boolean;
}

interface NavItem {
	name: string;
	link: string;
	icon?: React.ComponentType<{ className?: string }>;
}

/**
 * `React.ElementType` collapses JSX children to `never`, so the accepted link
 * component is constrained to the props we actually pass down.
 */
type NavLinkComponent = React.ElementType<{
	to?: string;
	href?: string;
	className?: string;
	onClick?: () => void;
	"aria-current"?: "page" | undefined;
	children?: React.ReactNode;
}>;

interface NavItemsProps {
	items: NavItem[];
	className?: string;
	onItemClick?: () => void;
	linkComponent?: NavLinkComponent;
	activeLink?: string;
}

interface MobileNavProps {
	children: React.ReactNode;
	className?: string;
	visible?: boolean;
}

interface MobileNavHeaderProps {
	children: React.ReactNode;
	className?: string;
}

interface MobileNavMenuProps {
	children: React.ReactNode;
	className?: string;
	isOpen: boolean;
	onClose: () => void;
}

/**
 * The bar is animated on two independent layers so the resize stays cheap and
 * still reads as instant:
 *
 * - **Geometry** (the bar box) only transitions `max-width` and `padding`, the
 *   two properties that can invalidate layout. Keeping the list this short means
 *   one layout pass per frame scoped to the bar itself - `[contain:layout_style]`
 *   stops those frames from invalidating the rest of the document.
 * - **Surface** (an absolutely positioned layer behind the content) carries
 *   `border-radius` / `background-color` / `border-color`, which are paint-only,
 *   and runs on a shorter clock than the geometry. The pill therefore looks
 *   finished while the bar is still resizing, which is what makes the whole
 *   transition feel faster than its duration suggests.
 *
 * `box-shadow` and `backdrop-filter` are deliberately excluded from both
 * transition lists. Neither is meaningfully interpolatable, so listing them
 * only forces the engine to re-evaluate a full-viewport blur on every frame -
 * by far the most expensive thing this bar can do. They snap in with the first
 * frame of the geometry change instead.
 */
const BAR_GEOMETRY =
	"transition-[max-width,padding] ease-[cubic-bezier(0.22,1,0.36,1)]";
const BAR_DURATION = "duration-[380ms]";

const BAR_SURFACE_TRANSITION =
	"transition-[border-radius,background-color,border-color] ease-[cubic-bezier(0.4,0,0.2,1)]";
const BAR_SURFACE_DURATION = "duration-[180ms]";

const BAR_SURFACE_BASE = "pointer-events-none absolute inset-0 -z-10";

const SURFACE = {
	desktop: {
		solid:
			"rounded-2xl border border-border/60 bg-background/70 shadow-[0_8px_28px_-14px_rgb(0_0_0/0.32)] backdrop-blur-md",
		clear: "rounded-full border border-transparent bg-transparent shadow-none",
	},
	mobile: {
		solid:
			"rounded-2xl border border-border/60 bg-background/80 shadow-[0_8px_28px_-14px_rgb(0_0_0/0.32)] backdrop-blur-md",
		clear: "rounded-3xl border border-transparent bg-transparent shadow-none",
	},
} as const;

/** Fraction of `threshold` at which the bar expands again (hysteresis band). */
const RELEASE_RATIO = 0.6;

const DESKTOP_QUERY = "(min-width: 1024px)";

const MENU_TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1] } as const;
const MENU_EXIT_TRANSITION = { duration: 0.12, ease: [0.4, 0, 1, 1] } as const;
const TOGGLE_TRANSITION = { duration: 0.14, ease: [0.22, 1, 0.36, 1] } as const;
const PILL_TRANSITION = {
	type: "spring",
	stiffness: 520,
	damping: 34,
	mass: 0.7,
} as const;

interface NavbarState {
	scrolled: boolean;
	reducedMotion: boolean;
}

/**
 * One provider for both the scroll state and the reduced-motion flag: the three
 * consumers below used to each own a `matchMedia` listener and a subscription,
 * which meant three listeners and three renders per scroll threshold crossing.
 */
const NavbarStateContext = React.createContext<NavbarState>({
	scrolled: false,
	reducedMotion: false,
});

function useNavbarState(): NavbarState {
	return useContext(NavbarStateContext);
}

function usePrefersReducedMotion(): boolean {
	return useNavbarState().reducedMotion;
}

function BarSurface({
	scrolled,
	variant,
	reducedMotion,
}: {
	scrolled: boolean;
	variant: keyof typeof SURFACE;
	reducedMotion: boolean;
}) {
	return (
		<span
			aria-hidden
			className={cn(
				BAR_SURFACE_BASE,
				BAR_SURFACE_TRANSITION,
				reducedMotion ? "duration-0" : BAR_SURFACE_DURATION,
				scrolled ? SURFACE[variant].solid : SURFACE[variant].clear,
			)}
		/>
	);
}

/**
 * `true` once the page has scrolled past `threshold`.
 *
 * Uses a passive listener throttled into a single `requestAnimationFrame` read
 * instead of a motion scroll value: no `MotionValue` is allocated, the frame
 * loop is never woken by scrolling, and `window.scrollY` is read only once per
 * frame after all writes have settled so no forced reflow happens.
 *
 * The expand/collapse thresholds differ (`threshold` vs `threshold *
 * {@link RELEASE_RATIO}). A single threshold makes the bar flicker whenever the
 * scroll position idles exactly on it - common with momentum scrolling and
 * keyboard paging.
 */
function useScrolledPast(threshold: number): boolean {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const release = threshold * RELEASE_RATIO;
		let frame = 0;

		const evaluate = (y: number) => {
			setScrolled((prev) => {
				const next = prev ? y > release : y > threshold;
				return prev === next ? prev : next;
			});
		};

		const onScroll = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(() => {
				frame = 0;
				evaluate(window.scrollY);
			});
		};

		evaluate(window.scrollY);
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll, { passive: true });

		return () => {
			if (frame) window.cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [threshold]);

	return scrolled;
}

const NavbarVisibilityContext = React.createContext(false);

function useNavbarVisible(visible?: boolean) {
	const fromContext = useContext(NavbarVisibilityContext);
	return visible ?? fromContext;
}

export const Navbar = ({
	children,
	className,
	threshold = 100,
}: NavbarProps) => {
	const scrolled = useScrolledPast(threshold);
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReducedMotion(media.matches);
		sync();
		media.addEventListener("change", sync);
		return () => media.removeEventListener("change", sync);
	}, []);

	return (
		<NavbarStateContext.Provider value={{ scrolled, reducedMotion }}>
			<header
				className={cn(
					// IMPORTANT: override `top-*` and `z-*` via className to reposition.
					"sticky inset-x-0 top-20 z-40 w-full",
					className,
				)}
			>
				{children}
			</header>
		</NavbarStateContext.Provider>
	);
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
	const isVisible = useNavbarVisible(visible);
	const reducedMotion = usePrefersReducedMotion();

	return (
		<div
			data-scrolled={isVisible ? "true" : "false"}
			className={cn(
				// `isolate` keeps the surface layer behind the content without
				// forcing a `z-index` onto every child.
				"relative z-10 isolate mx-auto hidden w-full self-start items-center justify-between px-4 py-2.5 lg:flex [contain:layout_style]",
				BAR_GEOMETRY,
				reducedMotion ? "duration-0" : BAR_DURATION,
				isVisible ? "max-w-[min(52rem,94vw)]" : "max-w-[92rem]",
				className,
			)}
		>
			<BarSurface
				scrolled={isVisible}
				variant="desktop"
				reducedMotion={reducedMotion}
			/>
			{children}
		</div>
	);
};

export const NavItems = ({
	items,
	className,
	onItemClick,
	linkComponent: LinkComponent = "a",
	activeLink,
}: NavItemsProps) => {
	return (
		<div
			className={cn(
				"hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex",
				className,
			)}
		>
			{items.map((item) => {
				const isActive = activeLink !== undefined && activeLink === item.link;
				const Icon = item.icon;
				const linkProps =
					LinkComponent === "a" ? { href: item.link } : { to: item.link };

				return (
					<LinkComponent
						key={item.link}
						{...linkProps}
						onClick={onItemClick}
						aria-current={isActive ? "page" : undefined}
						className={cn(
							"relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
							isActive
								? // The active pill paints the hover state itself, so no
									// `hover:bg-muted` here and the two never stack.
									"text-foreground"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						{/*
						 * Only the active pill uses `layoutId`. A hover pill used to
						 * share one too, which meant every mouse enter/leave remounted a
						 * projection node and re-measured the whole nav row; a plain
						 * `hover:bg-muted` is indistinguishable here and free.
						 */}
						{isActive && (
							<motion.span
								layoutId="nav-active-pill"
								transition={{ type: "spring", stiffness: 380, damping: 32 }}
								className="absolute inset-0 rounded-full bg-primary/10 ring-1 ring-primary/25"
							/>
						)}
						<span className="relative z-20 inline-flex items-center gap-1.5">
							{Icon ? <Icon className="size-3.5" /> : null}
							{item.name}
						</span>
					</LinkComponent>
				);
			})}
		</div>
	);
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
	const isVisible = useNavbarVisible(visible);
	const reducedMotion = usePrefersReducedMotion();

	return (
		<div
			data-scrolled={isVisible ? "true" : "false"}
			className={cn(
				"relative z-10 mx-auto flex w-full flex-col items-center justify-between px-3 py-2 lg:hidden",
				BAR_GEOMETRY,
				reducedMotion ? BAR_DURATION_STATIC : BAR_DURATION,
				isVisible
					? "max-w-[min(40rem,94vw)] rounded-2xl border border-border/60 bg-background/80 shadow-[0_8px_28px_-14px_rgb(0_0_0/0.32)] backdrop-blur-md"
					: "max-w-[calc(100vw-1.5rem)] rounded-3xl border border-transparent bg-transparent",
				className,
			)}
		>
			{children}
		</div>
	);
};

export const MobileNavHeader = ({
	children,
	className,
}: MobileNavHeaderProps) => {
	return (
		<div
			className={cn(
				"flex w-full flex-row items-center justify-between",
				className,
			)}
		>
			{children}
		</div>
	);
};

export const MobileNavMenu = ({
	children,
	className,
	isOpen,
	onClose,
}: MobileNavMenuProps) => {
	// `onClose` is an inline arrow at every call site, so depending on it directly
	// would tear down and re-add the listeners below on every render of an open
	// menu. The ref keeps the effect keyed to `isOpen` alone.
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onCloseRef.current();
			}
		};

		// Growing past the `lg` breakpoint hides this menu with CSS while leaving
		// `isOpen` true, so the state has to be reset or the menu reappears
		// already open on the way back down to mobile.
		const desktop = window.matchMedia(DESKTOP_QUERY);
		const onBreakpoint = () => {
			if (desktop.matches) onCloseRef.current();
		};

		window.addEventListener("keydown", onKeyDown);
		desktop.addEventListener("change", onBreakpoint);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			desktop.removeEventListener("change", onBreakpoint);
		};
	}, [isOpen]);

	const reducedMotion = usePrefersReducedMotion();

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: -10, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.98 }}
					transition={
						reducedMotion
							? { duration: 0 }
							: { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
					}
					style={{
						transformOrigin: "top center",
						willChange: "transform, opacity",
					}}
					className={cn(
						"absolute inset-x-0 top-full z-50 mt-2 flex w-full flex-col items-start justify-start gap-1 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] backdrop-blur-lg",
						className,
					)}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const MobileNavToggle = ({
	isOpen,
	onClick,
	className,
}: {
	isOpen: boolean;
	onClick: () => void;
	className?: string;
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-expanded={isOpen}
			aria-label={isOpen ? "Close menu" : "Open menu"}
			className={cn(
				"inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-muted active:scale-90",
				className,
			)}
		>
			{/* Both glyphs are stacked in a fixed box so they can cross-fade
			    instead of hard-swapping between renders. */}
			<span className="relative block size-4">
				<AnimatePresence initial={false}>
					<motion.span
						key={isOpen ? "close" : "open"}
						initial={{ opacity: 0, rotate: -70, scale: 0.7 }}
						animate={{ opacity: 1, rotate: 0, scale: 1 }}
						exit={{ opacity: 0, rotate: 70, scale: 0.7 }}
						transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
						className="absolute inset-0 flex items-center justify-center"
					>
						{isOpen ? (
							<IconX className="size-4" />
						) : (
							<IconMenu2 className="size-4" />
						)}
					</motion.span>
				</AnimatePresence>
			</span>
		</button>
	);
};

export const NavbarLogo = ({
	className,
	href = "/",
	src,
	alt = "logo",
	label = "Startup",
}: {
	className?: string;
	href?: string;
	src?: string;
	alt?: string;
	label?: string;
}) => {
	return (
		<a
			href={href}
			className={cn(
				"relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black dark:text-white",
				className,
			)}
		>
			{src ? (
				<img
					src={src}
					alt={alt}
					width={30}
					height={30}
					// Above the fold: load eagerly, decode off the main thread, and
					// skip the CDN round trip when a local asset is supplied.
					loading="eager"
					decoding="async"
					fetchPriority="high"
					draggable={false}
				/>
			) : null}
			<span className="font-medium">{label}</span>
		</a>
	);
};

export const NavbarButton = ({
	href,
	as: Tag = "a",
	children,
	className,
	variant = "primary",
	...props
}: {
	href?: string;
	as?: "a" | "button";
	children: React.ReactNode;
	className?: string;
	variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
	| React.ComponentPropsWithoutRef<"a">
	| React.ComponentPropsWithoutRef<"button">
)) => {
	const baseStyles =
		"relative inline-block cursor-pointer rounded-full px-4 py-2 text-center text-sm font-bold transition duration-200 hover:-translate-y-0.5";

	const variantStyles = {
		primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
		secondary: "bg-transparent text-foreground shadow-none",
		dark: "bg-foreground text-background",
		gradient: "bg-gradient-to-b from-blue-500 to-blue-700 text-white",
	};

	const Comp = Tag as React.ElementType<
		React.ComponentPropsWithoutRef<"a"> &
			React.ComponentPropsWithoutRef<"button">
	>;

	return (
		<Comp
			href={href || undefined}
			className={cn(baseStyles, variantStyles[variant], className)}
			{...props}
		>
			{children}
		</Comp>
	);
};
