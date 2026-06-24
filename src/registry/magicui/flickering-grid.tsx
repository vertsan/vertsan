import { useEffect, useMemo, useRef } from "react";

interface FlickeringGridProps {
	className?: string;
	squareSize?: number;
	gridGap?: number;
	flickerChance?: number;
	color?: string;
	width?: number;
	height?: number;
	maxOpacity?: number;
}

export function FlickeringGrid({
	className,
	squareSize = 4,
	gridGap = 6,
	flickerChance = 0.3,
	color = "rgb(0, 0, 0)",
	width: propWidth,
	height: propHeight,
	maxOpacity = 0.2,
}: FlickeringGridProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sizeRef = useRef({ w: propWidth ?? 800, h: propHeight ?? 800 });

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

	const isFixedSize = propWidth != null && propHeight != null;
	const w = propWidth ?? 800;
	const h = propHeight ?? 800;

	const opacityGrid = useMemo(() => {
		const cols = Math.floor(w / (squareSize + gridGap));
		const rows = Math.floor(h / (squareSize + gridGap));
		return Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () => Math.random()),
		);
	}, [w, h, squareSize, gridGap]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId: number;

		const getSize = () => {
			if (isFixedSize) {
				return { w: propWidth!, h: propHeight! };
			}
			const parent = canvas.parentElement;
			if (!parent) return { w: 800, h: 800 };
			return { w: parent.clientWidth, h: parent.clientHeight };
		};

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			const { w: cw, h: ch } = getSize();
			const bw = Math.round(cw * dpr);
			const bh = Math.round(ch * dpr);
			if (canvas.width !== bw || canvas.height !== bh) {
				canvas.width = bw;
				canvas.height = bh;
				sizeRef.current = { w: cw, h: ch };
			}
		};

		resize();

		const ro = new ResizeObserver(() => resize());
		if (!isFixedSize) ro.observe(canvas.parentElement!);

		const draw = () => {
			const dpr = window.devicePixelRatio || 1;
			const { w: cw, h: ch } = sizeRef.current;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const cols = Math.floor(cw / (squareSize + gridGap));
			const rows = Math.floor(ch / (squareSize + gridGap));

			const reinitOpacityGrid =
				opacityGrid.length !== rows ||
				(opacityGrid[0] && opacityGrid[0].length !== cols);

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					let opacity: number;
					if (reinitOpacityGrid) {
						opacity = Math.random() * maxOpacity;
					} else {
						if (row < opacityGrid.length && col < opacityGrid[row].length) {
							if (Math.random() < flickerChance) {
								opacityGrid[row][col] = Math.random();
							}
							opacity = opacityGrid[row][col] * maxOpacity;
						} else {
							opacity = Math.random() * maxOpacity;
						}
					}

					ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
					ctx.fillRect(
						col * (squareSize + gridGap) * dpr,
						row * (squareSize + gridGap) * dpr,
						squareSize * dpr,
						squareSize * dpr,
					);
				}
			}

			animationId = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			cancelAnimationFrame(animationId);
			ro.disconnect();
		};
	}, [
		squareSize,
		gridGap,
		maxOpacity,
		flickerChance,
		r,
		g,
		b,
		opacityGrid,
		propWidth,
		propHeight,
		isFixedSize,
	]);

	return (
		<canvas
			ref={canvasRef}
			className={className}
		/>
	);
}
