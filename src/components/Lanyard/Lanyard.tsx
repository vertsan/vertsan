import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
	useGLTF,
	useTexture,
	Environment,
	Lightformer,
} from "@react-three/drei";
import {
	BallCollider,
	CuboidCollider,
	Physics,
	RigidBody,
	useRopeJoint,
	useSphericalJoint,
} from "@react-three/rapier";
import type { RigidBodyProps } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

import cardGLB from "./card.glb";
import lanyardPng from "./lanyard.png";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
	interface ThreeElements {
		meshLineGeometry: any;
		meshLineMaterial: any;
	}
}



const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
	position?: [number, number, number];
	gravity?: [number, number, number];
	fov?: number;
	transparent?: boolean;
	frontImage?: string | null;
	backImage?: string | null;
	imageFit?: "cover" | "contain";
	lanyardImage?: string | null;
	lanyardWidth?: number;
}

export default function Lanyard({
	position = [0, 0, 14],
	gravity = [0, -40, 0],
	fov = 18,
	transparent = true,
	frontImage = null,
	backImage = null,
	imageFit = "cover",
	lanyardImage = null,
	lanyardWidth = 1,
}: LanyardProps) {
	const [canvasKey, setCanvasKey] = useState(0);
	const [device, setDevice] = useState<"phone" | "tablet" | "desktop">(
		() => {
			if (typeof window === "undefined") return "desktop";
			const w = window.innerWidth;
			return w < 480 ? "phone" : w < 768 ? "tablet" : "desktop";
		},
	);

	useEffect(() => {
		const handleResize = (): void => {
			const w = window.innerWidth;
			setDevice(w < 480 ? "phone" : w < 768 ? "tablet" : "desktop");
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const isMobile = device !== "desktop";

	const camPos: [number, number, number] = useMemo(() => {
		if (device === "phone") return [0, 0, 9];
		if (device === "tablet") return [0, 0, 11];
		return position;
	}, [device, position]);

	const camFov = useMemo(
		() => (device === "phone" ? 22 : device === "tablet" ? 20 : fov),
		[device, fov],
	);

	const cardScale = useMemo(
		() => (device === "phone" ? 2.0 : device === "tablet" ? 2.15 : 2.25),
		[device],
	);

	const lWidth = useMemo(
		() =>
			device === "phone"
				? lanyardWidth * 0.6
				: device === "tablet"
					? lanyardWidth * 0.8
					: lanyardWidth,
		[device, lanyardWidth],
	);

	const physicsTimestep = useMemo(
		() =>
			device === "phone" ? 1 / 30 : device === "tablet" ? 1 / 48 : 1 / 60,
		[device],
	);

	return (
		<div className="lanyard-wrapper">
			<Canvas
				key={canvasKey}
				camera={{ position: camPos, fov: camFov }}
				dpr={[1, device === "phone" ? 1.2 : isMobile ? 1.5 : 2]}
				gl={{
					alpha: transparent,
					powerPreference: "high-performance",
					failIfMajorPerformanceCaveat: false,
				}}
				onCreated={({ gl }) => {
					gl.setClearColor(
						new THREE.Color(0x000000),
						transparent ? 0 : 1,
					);
					gl.domElement.addEventListener(
						"webglcontextlost",
						(e) => {
							e.preventDefault();
							setCanvasKey(k => k + 1);
						},
					);
				}}
			>
				<ambientLight intensity={Math.PI} />
				<Physics gravity={gravity} timeStep={physicsTimestep}>
					<Band
						isMobile={isMobile}
						cardScale={cardScale}
						lanyardWidth={lWidth}
						frontImage={frontImage}
						backImage={backImage}
						imageFit={imageFit}
						lanyardImage={lanyardImage}
					/>
				</Physics>
				<Environment blur={0.75}>
					<Lightformer
						intensity={2}
						color="white"
						position={[0, -1, 5]}
						rotation={[0, 0, Math.PI / 3]}
						scale={[100, 0.1, 1]}
					/>
					<Lightformer
						intensity={3}
						color="white"
						position={[-1, -1, 1]}
						rotation={[0, 0, Math.PI / 3]}
						scale={[100, 0.1, 1]}
					/>
					<Lightformer
						intensity={3}
						color="white"
						position={[1, 1, 1]}
						rotation={[0, 0, Math.PI / 3]}
						scale={[100, 0.1, 1]}
					/>
					<Lightformer
						intensity={10}
						color="white"
						position={[-10, 0, 14]}
						rotation={[0, Math.PI / 2, Math.PI / 3]}
						scale={[100, 10, 1]}
					/>
				</Environment>
			</Canvas>
		</div>
	);
}

interface BandProps {
	maxSpeed?: number;
	minSpeed?: number;
	isMobile?: boolean;
	cardScale?: number;
	frontImage?: string | null;
	backImage?: string | null;
	imageFit?: "cover" | "contain";
	lanyardImage?: string | null;
	lanyardWidth?: number;
}

function Band({
	maxSpeed = 50,
	minSpeed = 0,
	isMobile = false,
	cardScale = 2.25,
	frontImage = null,
	backImage = null,
	imageFit = "cover",
	lanyardImage = null,
	lanyardWidth = 1,
}: BandProps) {
	const band = useRef<any>(null);
	const fixed = useRef<any>(null);
	const j1 = useRef<any>(null);
	const j2 = useRef<any>(null);
	const j3 = useRef<any>(null);
	const card = useRef<any>(null);

	const vec = useMemo(() => new THREE.Vector3(), []);
	const dir = useMemo(() => new THREE.Vector3(), []);

	const segmentProps: any = {
		type: "dynamic" as RigidBodyProps["type"],
		canSleep: true,
		colliders: false,
		angularDamping: isMobile ? 6 : 4,
		linearDamping: isMobile ? 6 : 4,
	};

	const { nodes, materials } = useGLTF(cardGLB) as any;
	const lanyardTex = useTexture(lanyardImage || lanyardPng);

	const resolutionVec = useMemo(
		() => new THREE.Vector2(1000, isMobile ? 2000 : 1000),
		[isMobile],
	);

	lanyardTex.wrapS = lanyardTex.wrapT = THREE.RepeatWrapping;

	const [curve] = useState(
		() =>
			new THREE.CatmullRomCurve3([
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
			]),
	);
	const [dragged, drag] = useState<false | THREE.Vector3>(false);
	const [hovered, hover] = useState(false);

	const hasCustomImages = Boolean(frontImage || backImage);

	const cardMap = useMemo(() => {
		const baseMap = materials.base.map as THREE.Texture;
		if (!hasCustomImages) return baseMap;

		const baseImg = baseMap.image as any;
		const W = baseImg?.width || 0;
		const H = baseImg?.height || 0;
		if (W === 0 || H === 0) return baseMap;

		const canvas = document.createElement("canvas");
		canvas.width = W;
		canvas.height = H;
		const ctx = canvas.getContext("2d");
		if (!ctx) return baseMap;

		ctx.drawImage(baseImg, 0, 0, W, H);

		if (frontImage) {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.src = frontImage;
			if (img.complete && img.width) {
				drawFitted(ctx, img, FRONT_UV_RECT, W, H, imageFit);
			} else {
				img.onload = () => {
					drawFitted(ctx, img, FRONT_UV_RECT, W, H, imageFit);
					composite.needsUpdate = true;
				};
			}
		}

		if (backImage) {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.src = backImage;
			if (img.complete && img.width) {
				drawFitted(ctx, img, BACK_UV_RECT, W, H, imageFit);
			} else {
				img.onload = () => {
					drawFitted(ctx, img, BACK_UV_RECT, W, H, imageFit);
					composite.needsUpdate = true;
				};
			}
		}

		const composite = new THREE.CanvasTexture(canvas);
		composite.colorSpace = THREE.SRGBColorSpace;
		composite.flipY = baseMap.flipY;
		composite.anisotropy = isMobile ? 4 : 16;
		composite.needsUpdate = true;

		return composite;
	}, [frontImage, backImage, imageFit, materials.base.map, isMobile, hasCustomImages]);

	useRopeJoint(fixed, j1, [
		[0, 0, 0],
		[0, 0, 0],
		1,
	]);
	useRopeJoint(j1, j2, [
		[0, 0, 0],
		[0, 0, 0],
		1,
	]);
	useRopeJoint(j2, j3, [
		[0, 0, 0],
		[0, 0, 0],
		1,
	]);
	useSphericalJoint(j3, card, [
		[0, 0, 0],
		[0, 1.5, 0],
	]);

	useEffect(() => {
		if (hovered) {
			document.body.style.cursor = dragged ? "grabbing" : "grab";
			return () => {
				document.body.style.cursor = "auto";
			};
		}
	}, [hovered, dragged]);

	const bandWidth = isMobile ? 20 : 32;

	const handlePointerUp = useCallback((e: any) => {
		e.target.releasePointerCapture(e.pointerId);
		drag(false);
	}, []);

	const handlePointerCancel = useCallback((e: any) => {
		e.target.releasePointerCapture(e.pointerId);
		drag(false);
	}, []);

	const handlePointerDown = useCallback((e: any) => {
		e.target.setPointerCapture(e.pointerId);
		drag(
			new THREE.Vector3()
				.copy(e.point)
				.sub(vec.copy(card.current.translation())),
		);
	}, [vec]);

	useFrame((state, delta) => {
		if (dragged && typeof dragged !== "boolean") {
			vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(
				state.camera,
			);
			dir.copy(vec).sub(state.camera.position).normalize();
			vec.add(dir.multiplyScalar(state.camera.position.length()));
			[card, j1, j2, j3, fixed].forEach((ref) =>
				ref.current?.wakeUp(),
			);
			card.current?.setNextKinematicTranslation({
				x: vec.x - dragged.x,
				y: vec.y - dragged.y,
				z: vec.z - dragged.z,
			});
		}
		if (fixed.current) {
			[j1, j2].forEach((ref) => {
				if (!ref.current.lerped)
					ref.current.lerped = new THREE.Vector3().copy(
						ref.current.translation(),
					);
				const clampedDistance = Math.max(
					0.1,
					Math.min(
						1,
						ref.current.lerped.distanceTo(
							ref.current.translation(),
						),
					),
				);
				ref.current.lerped.lerp(
					ref.current.translation(),
					delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
				);
			});
			curve.points[0].copy(j3.current.translation());
			curve.points[1].copy(j2.current.lerped);
			curve.points[2].copy(j1.current.lerped);
			curve.points[3].copy(fixed.current.translation());
			band.current.geometry.setPoints(curve.getPoints(bandWidth));
			const ang = card.current.angvel();
			const rot = card.current.rotation();
			card.current.setAngvel({
				x: ang.x,
				y: ang.y - rot.y * 0.25,
				z: ang.z,
			});
		}
	});

	curve.curveType = "chordal";

	return (
		<>
			<group position={[0, 4, 0]}>
				<RigidBody
					ref={fixed}
					{...segmentProps}
					type={"fixed" as RigidBodyProps["type"]}
				/>
				<RigidBody
					position={[0.5, 0, 0]}
					ref={j1}
					{...segmentProps}
					type={"dynamic" as RigidBodyProps["type"]}
				>
					<BallCollider args={[0.1]} />
				</RigidBody>
				<RigidBody
					position={[1, 0, 0]}
					ref={j2}
					{...segmentProps}
					type={"dynamic" as RigidBodyProps["type"]}
				>
					<BallCollider args={[0.1]} />
				</RigidBody>
				<RigidBody
					position={[1.5, 0, 0]}
					ref={j3}
					{...segmentProps}
					type={"dynamic" as RigidBodyProps["type"]}
				>
					<BallCollider args={[0.1]} />
				</RigidBody>
				<RigidBody
					position={[2, 0, 0]}
					ref={card}
					{...segmentProps}
					type={
						(dragged
							? ("kinematicPosition" as RigidBodyProps["type"])
							: ("dynamic" as RigidBodyProps["type"])) as RigidBodyProps["type"]
					}
				>
					<CuboidCollider args={[0.8, 1.125, 0.01]} />
					<group
						scale={cardScale}
						position={[0, -1.2, -0.05]}
						onPointerOver={() => hover(true)}
						onPointerOut={() => hover(false)}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerCancel}
						onPointerDown={handlePointerDown}
					>
						<mesh geometry={nodes.card.geometry}>
							<meshPhysicalMaterial
								map={cardMap}
								clearcoat={isMobile ? 0 : 1}
								clearcoatRoughness={0.15}
								roughness={0.9}
								metalness={0.8}
							/>
						</mesh>
						<mesh
							geometry={nodes.clip.geometry}
							material={materials.metal}
							material-roughness={0.3}
						/>
						<mesh
							geometry={nodes.clamp.geometry}
							material={materials.metal}
						/>
					</group>
				</RigidBody>
			</group>
			<mesh ref={band}>
				<meshLineGeometry />
				<meshLineMaterial
					color="white"
					depthTest={false}
					resolution={resolutionVec}
					useMap
					map={lanyardTex}
					repeat={[-4, 1]}
					lineWidth={lanyardWidth}
				/>
			</mesh>
		</>
	);
}

function drawFitted(
	ctx: CanvasRenderingContext2D,
	img: CanvasImageSource,
	rect: typeof FRONT_UV_RECT,
	canvasW: number,
	canvasH: number,
	fit: "cover" | "contain",
) {
	const rx = rect.x * canvasW;
	const ry = rect.y * canvasH;
	const rw = rect.w * canvasW;
	const rh = rect.h * canvasH;
	const pick = fit === "contain" ? Math.min : Math.max;
	const scale = pick(rw / (img as any).width, rh / (img as any).height);
	const dw = (img as any).width * scale;
	const dh = (img as any).height * scale;
	const dx = rx + (rw - dw) / 2;
	const dy = ry + (rh - dh) / 2;
	ctx.save();
	ctx.beginPath();
	ctx.rect(rx, ry, rw, rh);
	ctx.clip();
	ctx.drawImage(img, dx, dy, dw, dh);
	ctx.restore();
}
