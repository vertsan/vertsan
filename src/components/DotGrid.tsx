"use client";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import "./DotGrid.css";

gsap.registerPlugin(InertiaPlugin);

const throttle = (func: (...args: unknown[]) => void, limit: number) => {
	let lastCall = 0;
	return (...args: unknown[]) => {
		const now = performance.now();
		if (now - lastCall >= limit) {
			lastCall = now;
			func.apply(undefined, args);
		}
	};
};

interface Dot {
	cx: number;
	cy: number;
	xOffset: number;
	yOffset: number;
	_inertiaApplied: boolean;
}

export interface DotGridProps {
	dotSize?: number;
	gap?: number;
	baseColor?: string;
	activeColor?: string;
	proximity?: number;
	speedTrigger?: number;
	shockRadius?: number;
	shockStrength?: number;
	maxSpeed?: number;
	resistance?: number;
	returnDuration?: number;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * Resolve a color that may be a hex string, an rgb()/rgba() string, a named
 * color, or a CSS variable (e.g. `var(--foreground)`). CSS variables are
 * resolved against `baseElement` at call time so theme-aware tokens such as
 * `--foreground` update on light/dark mode switches.
 */
function resolveColor(color: string, baseElement: HTMLElement): string {
	if (!color.startsWith("var(")) return color;

	const match = color.match(/var\((--[^,\s)]+)(?:,[^)]*)?\)/);
	if (!match) return color;

	const value = getComputedStyle(baseElement).getPropertyValue(match[1]).trim();
	if (!value) return color;

	return convertCssColor(value);
}

/**
 * Convert any css color value that getComputedStyle can return into one of the
 * forms (hex, rgb()) that the dot grid understands.
 */
function convertCssColor(value: string): string {
	const trimmed = value.trim();

	if (trimmed.startsWith("#")) return trimmed;

	const m = trimmed.match(/^rgba?\(([^)]+)\)$/i);
	if (m) {
		const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
		const r = Math.round(parts[0]);
		const g = Math.round(parts[1]);
		const b = Math.round(parts[2]);
		const a = parts[3] ?? 1;
		return a >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
	}

	const oklch = trimmed.match(
		/^oklch\(\s*(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\/?\s*([\d.]*%?)\s*\)$/i,
	);
	if (oklch) {
		const rgb = oklchToRgb(
			parseFloat(oklch[1]),
			parseFloat(oklch[2]),
			parseFloat(oklch[3]),
		);
		return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
	}

	return trimmed;
}

function oklchToRgb(l: number, c: number, h: number) {
	const hr = (h * Math.PI) / 180;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);
	const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
	const a_ = a - 0.1055613458 * l_ - 0.0638541728 * b;
	const b_ = b - 0.0894841775 * l_ - 1.291485548 * a_;
	const l_3 = l_ * l_ * l_;
	const a_3 = a_ * a_ * a_;
	const b_3 = b_ * b_ * b_;
	let r = 4.0767416621 * l_3 - 3.3077115913 * a_3 + 0.2309699292 * b_3;
	let g = -1.2684380046 * l_3 + 2.6097574011 * a_3 - 0.3413193965 * b_3;
	let bl = -0.0041960863 * l_3 - 0.7034186147 * a_3 + 1.707614701 * b_3;

	r = 255 * 1.055 * Math.max(r, 0) ** (1 / 2.4) - 55.2;
	g = 255 * 1.055 * Math.max(g, 0) ** (1 / 2.4) - 55.2;
	bl = 255 * 1.055 * Math.max(bl, 0) ** (1 / 2.4) - 55.2;

	return {
		r: Math.max(0, Math.min(255, Math.round(r))),
		g: Math.max(0, Math.min(255, Math.round(g))),
		b: Math.max(0, Math.min(255, Math.round(bl))),
	};
}

function hexToRgb(hex: string) {
	const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
	if (!m) return { r: 0, g: 0, b: 0 };
	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
}

const DotGrid: React.FC<DotGridProps> = ({
	dotSize = 16,
	gap = 32,
	baseColor = "#5227FF",
	activeColor = "#5227FF",
	proximity = 150,
	speedTrigger = 100,
	shockRadius = 250,
	shockStrength = 5,
	maxSpeed = 5000,
	resistance = 750,
	returnDuration = 1.5,
	className = "",
	style,
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dotsRef = useRef<Dot[]>([]);
	const pointerRef = useRef({
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		speed: 0,
		lastTime: 0,
		lastX: 0,
		lastY: 0,
	});

	const circlePath = useMemo(() => {
		if (typeof window === "undefined" || !window.Path2D) return null;

		const p = new Path2D();
		p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
		return p;
	}, [dotSize]);

	const buildGrid = useCallback(() => {
		const wrap = wrapperRef.current;
		const canvas = canvasRef.current;
		if (!wrap || !canvas) return;

		const { width, height } = wrap.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;

		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		const ctx = canvas.getContext("2d");
		if (ctx) ctx.scale(dpr, dpr);

		const cols = Math.floor((width + gap) / (dotSize + gap));
		const rows = Math.floor((height + gap) / (dotSize + gap));
		const cell = dotSize + gap;

		const gridW = cell * cols - gap;
		const gridH = cell * rows - gap;

		const extraX = width - gridW;
		const extraY = height - gridH;

		const startX = extraX / 2 + dotSize / 2;
		const startY = extraY / 2 + dotSize / 2;

		const dots: Dot[] = [];
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const cx = startX + x * cell;
				const cy = startY + y * cell;
				dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
			}
		}
		dotsRef.current = dots;
	}, [dotSize, gap]);

	useEffect(() => {
		if (!circlePath) return;

		let rafId: number;
		const proxSq = proximity * proximity;

		const draw = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const wrap = wrapperRef.current;
			const baseEl = wrap ?? document.documentElement;
			const resolvedBase = resolveColor(baseColor, baseEl);
			const resolvedActive = resolveColor(activeColor, baseEl);
			const baseR = hexToRgb(resolvedBase);
			const activeR = hexToRgb(resolvedActive);

			const { x: px, y: py } = pointerRef.current;

			for (const dot of dotsRef.current) {
				const ox = dot.cx + dot.xOffset;
				const oy = dot.cy + dot.yOffset;
				const dx = dot.cx - px;
				const dy = dot.cy - py;
				const dsq = dx * dx + dy * dy;

				let style = resolvedBase;
				if (dsq <= proxSq) {
					const dist = Math.sqrt(dsq);
					const t = 1 - dist / proximity;
					const r = Math.round(baseR.r + (activeR.r - baseR.r) * t);
					const g = Math.round(baseR.g + (activeR.g - baseR.g) * t);
					const b = Math.round(baseR.b + (activeR.b - baseR.b) * t);
					style = `rgb(${r},${g},${b})`;
				}

				ctx.save();
				ctx.translate(ox, oy);
				ctx.fillStyle = style;
				ctx.fill(circlePath);
				ctx.restore();
			}

			rafId = requestAnimationFrame(draw);
		};

		draw();
		return () => cancelAnimationFrame(rafId);
	}, [proximity, baseColor, activeColor, circlePath]);

	useEffect(() => {
		buildGrid();
		let ro: ResizeObserver | null = null;
		if ("ResizeObserver" in window) {
			ro = new ResizeObserver(buildGrid);
			wrapperRef.current && ro.observe(wrapperRef.current);
		} else {
			(window as Window).addEventListener("resize", buildGrid);
		}
		return () => {
			if (ro) ro.disconnect();
			else window.removeEventListener("resize", buildGrid);
		};
	}, [buildGrid]);

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			const now = performance.now();
			const pr = pointerRef.current;
			const dt = pr.lastTime ? now - pr.lastTime : 16;
			const dx = e.clientX - pr.lastX;
			const dy = e.clientY - pr.lastY;
			let vx = (dx / dt) * 1000;
			let vy = (dy / dt) * 1000;
			let speed = Math.hypot(vx, vy);
			if (speed > maxSpeed) {
				const scale = maxSpeed / speed;
				vx *= scale;
				vy *= scale;
				speed = maxSpeed;
			}
			pr.lastTime = now;
			pr.lastX = e.clientX;
			pr.lastY = e.clientY;
			pr.vx = vx;
			pr.vy = vy;
			pr.speed = speed;

			const canvas = canvasRef.current;
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			pr.x = e.clientX - rect.left;
			pr.y = e.clientY - rect.top;

			for (const dot of dotsRef.current) {
				const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
				if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
					dot._inertiaApplied = true;
					gsap.killTweensOf(dot);
					const pushX = dot.cx - pr.x + vx * 0.005;
					const pushY = dot.cy - pr.y + vy * 0.005;
					gsap.to(dot, {
						inertia: { xOffset: pushX, yOffset: pushY, resistance },
						onComplete: () => {
							gsap.to(dot, {
								xOffset: 0,
								yOffset: 0,
								duration: returnDuration,
								ease: "elastic.out(1,0.75)",
							});
							dot._inertiaApplied = false;
						},
					});
				}
			}
		};

		const onClick = (e: MouseEvent) => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			const cx = e.clientX - rect.left;
			const cy = e.clientY - rect.top;
			for (const dot of dotsRef.current) {
				const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
				if (dist < shockRadius && !dot._inertiaApplied) {
					dot._inertiaApplied = true;
					gsap.killTweensOf(dot);
					const falloff = Math.max(0, 1 - dist / shockRadius);
					const pushX = (dot.cx - cx) * shockStrength * falloff;
					const pushY = (dot.cy - cy) * shockStrength * falloff;
					gsap.to(dot, {
						inertia: { xOffset: pushX, yOffset: pushY, resistance },
						onComplete: () => {
							gsap.to(dot, {
								xOffset: 0,
								yOffset: 0,
								duration: returnDuration,
								ease: "elastic.out(1,0.75)",
							});
							dot._inertiaApplied = false;
						},
					});
				}
			}
		};

		const throttledMove = throttle(onMove, 50);
		window.addEventListener("mousemove", throttledMove, { passive: true });
		window.addEventListener("click", onClick);

		return () => {
			window.removeEventListener("mousemove", throttledMove);
			window.removeEventListener("click", onClick);
		};
	}, [
		maxSpeed,
		speedTrigger,
		proximity,
		resistance,
		returnDuration,
		shockRadius,
		shockStrength,
	]);

	return (
		<section className={`dot-grid ${className}`} style={style}>
			<div ref={wrapperRef} className="dot-grid__wrap">
				<canvas ref={canvasRef} className="dot-grid__canvas" />
			</div>
		</section>
	);
};

export default DotGrid;
