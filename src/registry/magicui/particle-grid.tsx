import { useCallback, useEffect, useRef } from "react";

interface Particle {
	baseX: number;
	baseY: number;
	x: number;
	y: number;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
	opacity: number;
}

interface ParticleGridProps {
	className?: string;
	spacing?: number;
	dotRadius?: number;
	color?: string;
	connectionDistance?: number;
	influenceRadius?: number;
	waveAmplitude?: number;
	maxOpacity?: number;
	lineOpacity?: number;
}

export function ParticleGrid({
	className,
	spacing = 32,
	dotRadius = 1.5,
	color = "#60A5FA",
	connectionDistance = 100,
	influenceRadius = 160,
	waveAmplitude = 6,
	maxOpacity = 0.6,
	lineOpacity = 0.15,
}: ParticleGridProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0 });
	const particlesRef = useRef<Particle[]>([]);
	const dimsRef = useRef({ w: 0, h: 0 });

	const parseColor = useCallback((hex: string) => {
		const temp = document.createElement("canvas");
		temp.width = 1;
		temp.height = 1;
		const tCtx = temp.getContext("2d")!;
		tCtx.fillStyle = hex;
		tCtx.fillRect(0, 0, 1, 1);
		const [r, g, b] = tCtx.getImageData(0, 0, 1, 1).data;
		return { r, g, b };
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animId: number;
		const mouse = mouseRef.current;
		const { r, g, b } = parseColor(color);

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			const w = canvas.clientWidth * dpr;
			const h = canvas.clientHeight * dpr;
			if (w !== dimsRef.current.w || h !== dimsRef.current.h) {
				canvas.width = w;
				canvas.height = h;
				dimsRef.current = { w, h };

				const cols = Math.floor(w / spacing) + 2;
				const rows = Math.floor(h / spacing) + 2;
				const particles: Particle[] = [];
				for (let row = 0; row < rows; row++) {
					for (let col = 0; col < cols; col++) {
						const baseX = col * spacing;
						const baseY = row * spacing;
						particles.push({
							baseX,
							baseY,
							x: baseX,
							y: baseY,
							ox: (Math.random() - 0.5) * spacing * 0.4,
							oy: (Math.random() - 0.5) * spacing * 0.4,
							vx: 0,
							vy: 0,
							opacity: 0.15 + Math.random() * (maxOpacity - 0.15),
						});
					}
				}
				particlesRef.current = particles;
			}
		};

		resize();

		let prevX = mouse.x;
		let prevY = mouse.y;

		const draw = () => {
			resize();
			const { w, h } = dimsRef.current;

			mouse.vx = mouse.x - prevX;
			mouse.vy = mouse.y - prevY;
			prevX = mouse.x;
			prevY = mouse.y;

			ctx.clearRect(0, 0, w, h);

			const particles = particlesRef.current;
			const sqThreshold = connectionDistance * connectionDistance;
			const sqInfluence = influenceRadius * influenceRadius;

			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				const dx = mouse.x - p.x;
				const dy = mouse.y - p.y;
				const sqDist = dx * dx + dy * dy;

				if (sqDist < sqInfluence && sqDist > 0) {
					const dist = Math.sqrt(sqDist);
					const force = (1 - dist / influenceRadius) * 0.08;
					const angle = Math.atan2(dy, dx);
					const push = Math.min(dist * 0.01, 0.3);
					p.vx += -Math.cos(angle) * force * push * 0.5 + mouse.vx * 0.002;
					p.vy += -Math.sin(angle) * force * push * 0.5 + mouse.vy * 0.002;
				} else {
					const time = Date.now() * 0.001;
					p.vx += Math.sin(time + p.baseY * 0.01) * 0.01;
					p.vy += Math.cos(time * 0.7 + p.baseX * 0.01) * 0.01;
				}

				const targetX = p.baseX + p.ox + (sqDist < sqInfluence ? 0 : 0);
				const targetY = p.baseY + p.oy + (sqDist < sqInfluence ? 0 : 0);
				p.vx += (targetX - p.x) * 0.04;
				p.vy += (targetY - p.y) * 0.04;
				p.vx *= 0.85;
				p.vy *= 0.85;
				p.x += p.vx;
				p.y += p.vy;

				const dpr = window.devicePixelRatio || 1;
				ctx.beginPath();
				ctx.arc(p.x / dpr, p.y / dpr, dotRadius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
				ctx.fill();
			}

			for (let i = 0; i < particles.length; i++) {
				const a = particles[i];
				for (let j = i + 1; j < particles.length; j++) {
					const b = particles[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const sqDist = dx * dx + dy * dy;
					if (sqDist > sqThreshold || sqDist === 0) continue;

					const dist = Math.sqrt(sqDist);
					const alpha = (1 - dist / connectionDistance) * lineOpacity;

					const dpr = window.devicePixelRatio || 1;
					ctx.beginPath();
					ctx.moveTo(a.x / dpr, a.y / dpr);
					ctx.lineTo(b.x / dpr, b.y / dpr);
					ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
					ctx.lineWidth = 0.5;
					ctx.stroke();
				}
			}

			animId = requestAnimationFrame(draw);
		};

		animId = requestAnimationFrame(draw);

		const onMouse = (e: MouseEvent) => {
			const dpr = window.devicePixelRatio || 1;
			mouse.x = e.clientX * dpr;
			mouse.y = e.clientY * dpr;
		};

		const onLeave = () => {
			mouse.x = -9999;
			mouse.y = -9999;
		};

		window.addEventListener("mousemove", onMouse, { passive: true });
		window.addEventListener("mouseleave", onLeave, { passive: true });

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener("mousemove", onMouse);
			window.removeEventListener("mouseleave", onLeave);
		};
	}, [spacing, dotRadius, color, connectionDistance, influenceRadius, waveAmplitude, maxOpacity, lineOpacity, parseColor]);

	return (
		<canvas
			ref={canvasRef}
			className={className}
		/>
	);
}
