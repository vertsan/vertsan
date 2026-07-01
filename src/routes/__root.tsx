import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "vert",
			},
			{
				name: "description",
				content:
					"Vert San — Software Engineer building accessible, performant web applications with modern technologies.",
			},
			{
				property: "og:title",
				content: "Vert San — Software Engineer",
			},
			{
				property: "og:description",
				content:
					"Portfolio and resume of Vert San — building accessible, performant web applications with modern technologies.",
			},
			{
				property: "og:image",
				content: "https://vertsan.netlify.app/og-image.png",
			},
			{
				property: "og:image:width",
				content: "1200",
			},
			{
				property: "og:image:height",
				content: "630",
			},
			{
				property: "og:url",
				content: "https://vertsan.netlify.app",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "Vert San — Software Engineer",
			},
			{
				name: "twitter:description",
				content:
					"Portfolio and resume of Vert San — building accessible, performant web applications with modern technologies.",
			},
			{
				name: "twitter:image",
				content: "https://vertsan.netlify.app/og-image.png",
			},
			{
				property: "twitter:image:width",
				content: "1200",
			},
			{
				property: "twitter:image:height",
				content: "630",
			},
		],
		links: [
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/vert.ico",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Maven+Pro:wght@400..900&display=swap",
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => (
		<main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
			<h1 className="text-6xl font-bold tracking-tight text-muted-foreground/30">404</h1>
			<p className="text-lg text-muted-foreground">Page not found</p>
			<Link to="/" className="text-sm text-primary hover:underline">Back to Home</Link>
		</main>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const loc = useLocation();
	const isAdmin = loc.pathname.startsWith("/admin") || loc.pathname === "/login";

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				<script defer src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){var i=setInterval(function(){if(window.botpress){clearInterval(i);window.botpress.init(${JSON.stringify({
							botId: "4160daa7-1be3-4d1e-b6ef-d2585925c0eb",
							configuration: {
								version: "v2",
								botName: "Vert Bot",
								botAvatar: "https://files.bpcontent.cloud/2026/06/23/06/20260623062819-NM53T589.gif",
								fabImage: "https://files.bpcontent.cloud/2026/06/23/06/20260623062819-NM53T589.gif",
								website: {},
								email: {},
								phone: {},
								termsOfService: {},
								privacyPolicy: {},
								color: "#3276EA",
								variant: "solid",
								headerVariant: "solid",
								themeMode: "light",
								fontFamily: "inter",
								radius: 4,
								feedbackEnabled: false,
								footer: "[⚡ by Botpress](https://botpress.com/?from=webchat)",
								soundEnabled: false,
								proactiveMessageEnabled: false,
								proactiveBubbleMessage: "Hi! 👋 Need help?",
								proactiveBubbleTriggerType: "afterDelay",
								proactiveBubbleDelayTime: 10,
								conversationHistory: false,
								homePageEnabled: false,
								mainCardEnabled: false,
								conversationStartersEnabled: false,
								conversationStarters: [],
								conversationStartersDisplayStyle: "cards",
							},
							clientId: "43a2f4e1-d418-4f74-b774-a33a0a2a976b",
						})})}},100);})();`,
					}}
				/>
				{!isAdmin ? (
					<div className="mx-auto min-h-screen max-w-7xl border-x border-border bg-card shadow-sm">
						<Header />
						{children}
						<Footer />
					</div>
				) : (
					children
				)}
				{import.meta.env.DEV && (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				)}
				<Scripts />
			</body>
		</html>
	);
}
