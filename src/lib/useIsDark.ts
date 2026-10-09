import { useEffect, useState } from "react";

function readIsDark(): boolean {
	if (typeof document === "undefined") return false;
	return document.documentElement.classList.contains("dark");
}

export function useIsDark(): boolean {
	const [isDark, setIsDark] = useState(readIsDark);

	useEffect(() => {
		const root = document.documentElement;
		const sync = () => setIsDark(root.classList.contains("dark"));
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(root, { attributes: true, attributeFilter: ["class"] });
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", sync);
		return () => {
			observer.disconnect();
			media.removeEventListener("change", sync);
		};
	}, []);

	return isDark;
}
