import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ImageOff } from "lucide-react";
import "./BounceCards.css";

interface BounceCardsProps {
	className?: string;
	images?: string[];
	altTexts?: string[];
	containerWidth?: number;
	containerHeight?: number;
	cardSize?: number;
	animationDelay?: number;
	animationStagger?: number;
	easeType?: string;
	transformStyles?: string[];
	enableHover?: boolean;
}

function CardSkeleton() {
	return <div className="card-skeleton" />;
}

function CardError() {
	return (
		<div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
			<ImageOff className="size-6" />
		</div>
	);
}

export default function BounceCards({
	className = "",
	images = [],
	altTexts,
	containerWidth = 400,
	containerHeight = 400,
	cardSize = 160,
	animationDelay = 0.5,
	animationStagger = 0.06,
	easeType = "elastic.out(1, 0.8)",
	transformStyles = [
		"rotate(10deg) translate(-170px)",
		"rotate(5deg) translate(-85px)",
		"rotate(-3deg)",
		"rotate(-10deg) translate(85px)",
		"rotate(2deg) translate(170px)",
	],
	enableHover = false,
}: BounceCardsProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
	const [loaded, setLoaded] = useState<Record<number, boolean>>({});
	const [errored, setErrored] = useState<Record<number, boolean>>({});

	useEffect(() => {
		imgRefs.current.forEach((img, idx) => {
			if (img?.complete && !loaded[idx] && !errored[idx]) {
				setLoaded((prev) => ({ ...prev, [idx]: true }));
			}
		});
	}, [images]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				".card",
				{ scale: 0 },
				{
					scale: 1,
					stagger: animationStagger,
					ease: easeType,
					delay: animationDelay,
				},
			);
		}, containerRef);
		return () => ctx.revert();
	}, [animationStagger, easeType, animationDelay]);

	const getCardStyle = useCallback(
		(idx: number) => ({
			width: cardSize,
			height: cardSize,
			transform: transformStyles[idx] ?? "none",
		}),
		[cardSize, transformStyles],
	);

	const getNoRotationTransform = (transformStr: string): string => {
		const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
		if (hasRotate) {
			return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
		} else if (transformStr === "none") {
			return "rotate(0deg)";
		} else {
			return `${transformStr} rotate(0deg)`;
		}
	};

	const getPushedTransform = (
		baseTransform: string,
		offsetX: number,
	): string => {
		const translateRegex = /translate\(([-0-9.]+)px\)/;
		const match = baseTransform.match(translateRegex);
		if (match) {
			const currentX = parseFloat(match[1]);
			const newX = currentX + offsetX;
			return baseTransform.replace(
				translateRegex,
				`translate(${newX}px)`,
			);
		} else {
			return baseTransform === "none"
				? `translate(${offsetX}px)`
				: `${baseTransform} translate(${offsetX}px)`;
		}
	};

	const animateCards = (hoveredIdx: number | null) => {
		if (!containerRef.current) return;
		const q = gsap.utils.selector(containerRef);

		images.forEach((_, i) => {
			const selector = q(`.card-${i}`);
			gsap.killTweensOf(selector);

			const baseTransform = transformStyles[i] || "none";

			if (hoveredIdx === null) {
				gsap.to(selector, {
					transform: baseTransform,
					duration: 0.4,
					ease: "back.out(1.4)",
					overwrite: "auto",
				});
			} else if (i === hoveredIdx) {
				const noRotation = getNoRotationTransform(baseTransform);
				gsap.to(selector, {
					transform: noRotation,
					duration: 0.4,
					ease: "back.out(1.4)",
					overwrite: "auto",
					zIndex: images.length,
				});
			} else {
				const offsetX = i < hoveredIdx ? -160 : 160;
				const pushedTransform = getPushedTransform(baseTransform, offsetX);
				const distance = Math.abs(hoveredIdx - i);
				const delay = distance * 0.05;

				gsap.to(selector, {
					transform: pushedTransform,
					duration: 0.4,
					ease: "back.out(1.4)",
					delay,
					overwrite: "auto",
					zIndex: images.length - distance,
				});
			}
		});
	};

	const handleMouseEnter = (idx: number) => {
		if (!enableHover) return;
		animateCards(idx);
	};

	const handleMouseLeave = () => {
		if (!enableHover) return;
		animateCards(null);
	};

	const handleFocus = (idx: number) => {
		if (!enableHover) return;
		animateCards(idx);
	};

	const handleBlur = () => {
		if (!enableHover) return;
		animateCards(null);
	};

	if (images.length === 0) return null;

	return (
		<div
			className={`bounceCardsContainer ${className}`}
			ref={containerRef}
			style={{
				position: "relative",
				width: containerWidth,
				height: containerHeight,
			}}
		>
			{images.map((src, idx) => {
				const isLoaded = loaded[idx];
				const hasError = errored[idx];
				const alt = altTexts?.[idx] ?? `Gallery image ${idx + 1}`;

				return (
					<div
						key={idx}
						className={`card card-${idx}`}
						style={getCardStyle(idx)}
						tabIndex={enableHover ? 0 : undefined}
						role={enableHover ? "button" : undefined}
						onMouseEnter={() => handleMouseEnter(idx)}
						onMouseLeave={handleMouseLeave}
						onFocus={() => handleFocus(idx)}
						onBlur={handleBlur}
					>
						<div
							className="card-skeleton"
							style={{ opacity: isLoaded ? 0 : 1 }}
						/>
						{hasError && (
							<div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground z-10">
								<ImageOff className="size-6" />
							</div>
						)}
						<img
							className="image"
							ref={(el) => {
								imgRefs.current[idx] = el;
							}}
							src={src}
							alt={alt}
							onLoad={() =>
								setLoaded((prev) => ({ ...prev, [idx]: true }))
							}
							onError={() => {
								setErrored((prev) => ({ ...prev, [idx]: true }));
								setLoaded((prev) => ({ ...prev, [idx]: true }));
							}}
							style={{
								opacity: isLoaded && !hasError ? 1 : 0,
							}}
						/>
					</div>
				);
			})}
		</div>
	);
}
