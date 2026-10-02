import { IconMenu2, IconX } from "@tabler/icons-react";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from "motion/react";
import React, { useContext, useEffect, useState } from "react";
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
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
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
 * Bar geometry transitions live in CSS (see `transition-[max-width,...]`) rather than
 * motion values so the shrink never has to interpolate between mismatched units
 * (`100%` -> `40%` collapses the bar on narrow viewports once content no longer fits).
 */
const BAR_TRANSITION =
	"transition-[max-width,border-radius,background-color,border-color,box-shadow,backdrop-filter,padding] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

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
	const { scrollY } = useScroll();
	const [visible, setVisible] = useState(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		const next = latest > threshold;
		setVisible((prev) => (prev === next ? prev : next));
	});

	useEffect(() => {
		setVisible(scrollY.get() > threshold);
	}, [scrollY, threshold]);

	return (
		<NavbarVisibilityContext.Provider value={visible}>
			<motion.header
				className={cn(
					// IMPORTANT: override `top-*` and `z-*` via className to reposition.
					"sticky inset-x-0 top-20 z-40 w-full",
					className,
				)}
			>
				{children}
			</motion.header>
		</NavbarVisibilityContext.Provider>
	);
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
	const isVisible = useNavbarVisible(visible);

	return (
		<div
			data-scrolled={isVisible ? "true" : "false"}
			className={cn(
				"relative z-10 mx-auto hidden w-full self-start items-center justify-between px-4 py-2.5 lg:flex",
				BAR_TRANSITION,
				isVisible
					? "max-w-[min(52rem,94vw)] rounded-2xl border border-border/60 bg-background/70 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.28)] backdrop-blur-xl"
					: "max-w-[92rem] rounded-full border border-transparent bg-transparent",
				className,
			)}
		>
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
	const [hovered, setHovered] = useState<number | null>(null);

	return (
		<div
			className={cn(
				"hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex",
				className,
			)}
		>
			{items.map((item, idx) => {
				const isActive = activeLink !== undefined && activeLink === item.link;
				const Icon = item.icon;
				const linkProps =
					LinkComponent === "a" ? { href: item.link } : { to: item.link };

				return (
					<LinkComponent
						key={item.link}
						{...linkProps}
						onMouseEnter={() => setHovered(idx)}
						onMouseLeave={() => setHovered(null)}
						onClick={onItemClick}
						aria-current={isActive ? "page" : undefined}
						className={cn(
							"relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
							isActive
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{(isActive || hovered === idx) && (
							<motion.span
								layoutId={isActive ? "nav-active-pill" : "nav-hover-pill"}
								transition={{ type: "spring", stiffness: 380, damping: 32 }}
								className={cn(
									"absolute inset-0 rounded-full",
									isActive
										? "bg-primary/10 ring-1 ring-primary/25"
										: "bg-muted",
								)}
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

	return (
		<div
			data-scrolled={isVisible ? "true" : "false"}
			className={cn(
				"relative z-10 mx-auto flex w-full flex-col items-center justify-between px-3 py-2 lg:hidden",
				BAR_TRANSITION,
				isVisible
					? "max-w-[min(40rem,94vw)] rounded-2xl border border-border/60 bg-background/80 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.28)] backdrop-blur-xl"
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
	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: -12, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -12, scale: 0.98 }}
					transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
					className={cn(
						"absolute inset-x-0 top-full z-50 mt-2 flex w-full flex-col items-start justify-start gap-1 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] backdrop-blur-xl",
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
				"inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-muted",
				className,
			)}
		>
			{isOpen ? <IconX className="size-4" /> : <IconMenu2 className="size-4" />}
		</button>
	);
};

export const NavbarLogo = ({
	className,
	href = "/",
}: {
	className?: string;
	href?: string;
}) => {
	return (
		<a
			href={href}
			className={cn(
				"relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black dark:text-white",
				className,
			)}
		>
			<img
				src="https://assets.aceternity.com/logo-dark.png"
				alt="logo"
				width={30}
				height={30}
			/>
			<span className="font-medium">Startup</span>
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
