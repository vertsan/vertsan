"use client";
import { useCallback, useState } from "react";

import {
	MobileNav,
	MobileNavHeader,
	MobileNavMenu,
	MobileNavToggle,
	NavBody,
	Navbar,
	NavbarButton,
	NavbarLogo,
	NavItems,
} from "#/components/ui/resizable-navbar";

/** Scroll distance (px) before the bar collapses into its pill. */
const COLLAPSE_AT = 80;

const navItems = [
	{ name: "Features", link: "#features" },
	{ name: "Pricing", link: "#pricing" },
	{ name: "Contact", link: "#contact" },
];

// Hoisted so the scroll-lock and menu state changes below never rebuild the
// grid: `navItems` / `boxes` were previously re-allocated on every render.
const boxes = [
	{ id: 1, title: "The", span: "md:col-span-1" },
	{ id: 2, title: "First", span: "md:col-span-2" },
	{ id: 3, title: "Rule", span: "md:col-span-1" },
	{ id: 4, title: "Of", span: "md:col-span-3" },
	{ id: 5, title: "F", span: "md:col-span-1" },
	{ id: 6, title: "Club", span: "md:col-span-2" },
	{ id: 7, title: "Is", span: "md:col-span-2" },
	{ id: 8, title: "You", span: "md:col-span-1" },
	{ id: 9, title: "Do NOT TALK about", span: "md:col-span-2" },
	{ id: 10, title: "F Club", span: "md:col-span-1" },
];

export default function NavbarDemo() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);
	const toggleMenu = useCallback(
		() => setIsMobileMenuOpen((prev) => !prev),
		[],
	);

	return (
		<div className="relative w-full">
			<Navbar threshold={COLLAPSE_AT}>
				{/* Desktop Navigation */}
				<NavBody>
					<NavbarLogo src="/vert.ico" alt="Vert San" label="Startup" />
					<NavItems items={navItems} />
					<div className="flex items-center gap-4">
						<NavbarButton variant="secondary">Login</NavbarButton>
						<NavbarButton variant="primary">Book a call</NavbarButton>
					</div>
				</NavBody>

				{/* Mobile Navigation */}
				<MobileNav>
					<MobileNavHeader>
						<NavbarLogo src="/vert.ico" alt="Vert San" label="Startup" />
						<MobileNavToggle isOpen={isMobileMenuOpen} onClick={toggleMenu} />
					</MobileNavHeader>

					<MobileNavMenu isOpen={isMobileMenuOpen} onClose={closeMenu}>
						{navItems.map((item) => (
							<a
								key={item.link}
								href={item.link}
								onClick={closeMenu}
								className="relative text-neutral-600 dark:text-neutral-300"
							>
								<span className="block">{item.name}</span>
							</a>
						))}
						<div className="flex w-full flex-col gap-4">
							<NavbarButton
								onClick={closeMenu}
								variant="primary"
								className="w-full"
							>
								Login
							</NavbarButton>
							<NavbarButton
								onClick={closeMenu}
								variant="primary"
								className="w-full"
							>
								Book a call
							</NavbarButton>
						</div>
					</MobileNavMenu>
				</MobileNav>
			</Navbar>
			<DummyContent />

			{/* Navbar */}
		</div>
	);
}

const DummyContent = () => {
	return (
		<div className="container mx-auto p-8 pt-24">
			<h1 className="mb-4 text-center text-3xl font-bold">
				Check the navbar at the top of the container
			</h1>
			<p className="mb-10 text-center text-sm text-zinc-500">
				For demo purpose we have kept the position as{" "}
				<span className="font-medium">Sticky</span>. Keep in mind that this
				component is <span className="font-medium">fixed</span> and will not
				move when scrolling.
			</p>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				{boxes.map((box) => (
					<div
						key={box.id}
						className={`${box.span} h-60 flex items-center justify-center rounded-lg bg-neutral-100 p-4 shadow-sm dark:bg-neutral-800`}
					>
						<h2 className="text-xl font-medium">{box.title}</h2>
					</div>
				))}
			</div>
		</div>
	);
};
