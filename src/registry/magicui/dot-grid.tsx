import { useEffect, useMemo, useRef } from "react";

interface DotGridProps {
	className?: string;
	spacing?: number;
	dotRadius?: number;
	color?: string;
	minOpacity?: number;
	maxOpacity?: number;
	pulsePeriod?: number;
	blur?: number;
}

export function DotGrid({
	className,
	spacing = 28,
	dotRadius = 1.2,
	color = "#9CA3AF",
	minOpacity = 0.08,
	maxOpacity = 0.35,
	pulsePeriod = 6000,
	blur = 0.6,
}: DotGridProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const phases = useMemo(() => {
		return Array.from({ length: 2000 }, () => Math.random() * Math.PI * 2);
	}, []);

	const { r, g, b } = useMemo(() => {
		const temp = document.createElement("canvas");
		temp.width = 1;
		temp.height = 1;
		const tCtx = temp.getContext("2d")!;
		tCtx.fillStyle = color;
		tCtx.fillRect(0, 0, 1, 1);
		const [rr, gg, bb] = tCtx.getImageData(0, 0, 1, 1).data;
		return { r: rr, g: gg, b: bb };
	}, [color]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animId: number;
		const range = maxOpacity - minOpacity;
		const speed = (Math.PI * 2) / pulsePeriod;

		const ro = new ResizeObserver(([entry]) => {
			const dpr = window.devicePixelRatio || 1;
			const w = entry.contentRect.width * dpr;
			const h = entry.contentRect.height * dpr;
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
			}
		});
		ro.observe(canvas.parentElement!);

		const draw = (time: number) => {
			const dpr = window.devicePixelRatio || 1;
			const w = canvas.width;
			const h = canvas.height;

			if (w === 0 || h === 0) {
				animId = requestAnimationFrame(draw);
				return;
			}

			ctx.clearRect(0, 0, w, h);

			const cols = Math.floor(w / (spacing * dpr)) + 2;
			const rows = Math.floor(h / (spacing * dpr)) + 2;
			const gridW = (cols - 1) * spacing * dpr;
			const gridH = (rows - 1) * spacing * dpr;
			const offsetX = (w - gridW) / 2;
			const offsetY = (h - gridH) / 2;

			let idx = 0;
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const phase = phases[idx % phases.length];
					const opacity =
						minOpacity + range * (0.5 + 0.5 * Math.sin(time * speed + phase));
					const x = col * spacing * dpr + offsetX;
					const y = row * spacing * dpr + offsetY;

					ctx.beginPath();
					ctx.arc(x, y, dotRadius * dpr, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
					ctx.fill();
					idx++;
				}
			}

			animId = requestAnimationFrame(draw);
		};

		animId = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(animId);
			ro.disconnect();
		};
	}, [spacing, dotRadius, r, g, b, minOpacity, maxOpacity, pulsePeriod, phases]);

	return (
		<canvas
			ref={canvasRef}
			className={className}
			style={{ filter: `blur(${blur}px)` }}
		/>
	);
}
