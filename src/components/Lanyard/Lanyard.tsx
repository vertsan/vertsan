import { useEffect, useMemo, useRef, useState } from "react";
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
import lanyard from "./lanyard.png";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
	interface ThreeElements {
		meshLineGeometry: any;
		meshLineMaterial: any;
	}
}

const BLANK_PIXEL =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

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
	const phoneTimestep = 1 / 30;
	const tabletTimestep = 1 / 48;
	const desktopTimestep = 1 / 60;

	const camPos: [number, number, number] = useMemo(
		() => {
			if (device === "phone") return [0, 0, 9];
			if (device === "tablet") return [0, 0, 11];
			return position;
		},
		[device, position],
	);
	const camFov = useMemo(
		() => (device === "phone" ? 22 : device === "tablet" ? 20 : fov),
		[device, fov],
	);
	const cardScale = useMemo(
		() => (device === "phone" ? 2.0 : device === "tablet" ? 2.15 : 2.25),
		[device],
	);
	const lWidth = useMemo(
		() => (device === "phone" ? lanyardWidth * 0.6 : device === "tablet" ? lanyardWidth * 0.8 : lanyardWidth),
		[device, lanyardWidth],
	);

	return (
		<div className="lanyard-wrapper">
			<Canvas
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
							setTimeout(
								() => gl.domElement.getContext("webgl2"),
								100,
							);
						},
					);
				}}
			>
				<ambientLight intensity={Math.PI} />
				<Physics gravity={gravity} timeStep={device === "phone" ? phoneTimestep : device === "tablet" ? tabletTimestep : desktopTimestep}>
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

	const vec = new THREE.Vector3();
	const ang = new THREE.Vector3();
	const rot = new THREE.Vector3();
	const dir = new THREE.Vector3();

	const segmentProps: any = {
		type: "dynamic" as RigidBodyProps["type"],
		canSleep: true,
		colliders: false,
		angularDamping: isMobile ? 6 : 4,
		linearDamping: isMobile ? 6 : 4,
	};

	const { nodes, materials } = useGLTF(cardGLB) as any;
	const texture = useTexture(lanyardImage || lanyard);
	const frontTex = useTexture(frontImage || BLANK_PIXEL);
	const backTex = useTexture(backImage || BLANK_PIXEL);

	const cardMap = useMemo(() => {
		const baseMap = materials.base.map as THREE.Texture;
		if (!frontImage && !backImage) return baseMap;

		const baseImg = baseMap.image as any;
		const W = baseImg.width;
		const H = baseImg.height;
		const canvas = document.createElement("canvas");
		canvas.width = W;
		canvas.height = H;
		const ctx = canvas.getContext("2d");
		if (!ctx) return baseMap;

		ctx.drawImage(baseImg, 0, 0, W, H);

		const drawFitted = (img: any, rect: typeof FRONT_UV_RECT) => {
			const rx = rect.x * W;
			const ry = rect.y * H;
			const rw = rect.w * W;
			const rh = rect.h * H;
			const pick = imageFit === "contain" ? Math.min : Math.max;
			const scale = pick(rw / img.width, rh / img.height);
			const dw = img.width * scale;
			const dh = img.height * scale;
			const dx = rx + (rw - dw) / 2;
			const dy = ry + (rh - dh) / 2;
			ctx.save();
			ctx.beginPath();
			ctx.rect(rx, ry, rw, rh);
			ctx.clip();
			ctx.drawImage(img, dx, dy, dw, dh);
			ctx.restore();
		};

		if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
		if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

		const composite = new THREE.CanvasTexture(canvas);
		composite.colorSpace = THREE.SRGBColorSpace;
		composite.flipY = baseMap.flipY;
		composite.anisotropy = isMobile ? 4 : 16;
		composite.needsUpdate = true;
		return composite;
	}, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

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
			const bandWidth = isMobile ? 20 : 32;
			band.current.geometry.setPoints(curve.getPoints(bandWidth));
			ang.copy(card.current.angvel());
			rot.copy(card.current.rotation());
			card.current.setAngvel({
				x: ang.x,
				y: ang.y - rot.y * 0.25,
				z: ang.z,
			});
		}
	});

	curve.curveType = "chordal";
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

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
						onPointerUp={(e: any) => {
							e.target.releasePointerCapture(e.pointerId);
							drag(false);
						}}
						onPointerCancel={(e: any) => {
							e.target.releasePointerCapture(e.pointerId);
							drag(false);
						}}
						onPointerDown={(e: any) => {
							e.target.setPointerCapture(e.pointerId);
							drag(
								new THREE.Vector3()
									.copy(e.point)
									.sub(vec.copy(card.current.translation())),
							);
						}}
					>
						<mesh geometry={nodes.card.geometry}>
							<meshPhysicalMaterial
								map={cardMap}
								map-anisotropy={isMobile ? 4 : 16}
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
					resolution={isMobile ? [1000, 2000] : [1000, 1000]}
					useMap
					map={texture}
					repeat={[-4, 1]}
					lineWidth={lanyardWidth}
				/>
			</mesh>
		</>
	);
}
