"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, type ReactNode, useEffect, useMemo, useRef } from "react";
import {
  ACESFilmicToneMapping,
  SRGBColorSpace,
  type Group,
} from "three";

type Props = {
  theme: "light" | "dark";
  quality: "desktop" | "mobile";
  onFailure: () => void;
};

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function CameraRig({ enabled }: { enabled: boolean }) {
  const { camera, pointer } = useThree();
  useFrame(() => {
    const x = enabled ? pointer.x * 0.16 : 0;
    const y = enabled ? pointer.y * 0.08 : 0;
    camera.position.set(x, 5.6 + y, 7.8);
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

function DeskScene({ theme, quality }: Omit<Props, "onFailure">) {
  const group = useRef<Group>(null);
  const { invalidate } = useThree();
  const dark = theme === "dark";
  const mobile = quality === "mobile";
  const palette = useMemo(() => ({
    desk: dark ? "#17191d" : "#d8d1c2",
    paper: dark ? "#d7d2c5" : "#f4f0e6",
    graphite: dark ? "#292c32" : "#32353a",
    glass: dark ? "#59616b" : "#8f979e",
    line: dark ? "#777e86" : "#62676d",
    lime: "#c7f36b",
    screen: dark ? "#111318" : "#e9e5dc",
  }), [dark]);

  useEffect(() => {
    invalidate();
  }, [invalidate, palette]);

  return (
    <>
      <color attach="background" args={[dark ? "#101216" : "#eee9df"]} />
      <ambientLight intensity={dark ? 1.2 : 1.55} />
      <directionalLight position={[4, 7, 5]} intensity={dark ? 2.1 : 2.5} color={dark ? "#e9e2d4" : "#fff8e8"} />
      <CameraRig enabled={!mobile} />
      <group ref={group} rotation={[-0.06, -0.12, 0]} position={[0, -0.4, 0]}>
        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[7.4, 0.32, 5]} />
          <meshStandardMaterial color={palette.desk} roughness={0.82} metalness={0.08} />
        </mesh>

        <mesh position={[-2.45, -0.34, 0.65]} rotation={[-Math.PI / 2, 0, -0.12]}>
          <planeGeometry args={[1.25, 1.7]} />
          <meshStandardMaterial color={palette.paper} roughness={0.92} />
        </mesh>
        <mesh position={[-2.05, -0.3, -1.25]} rotation={[-Math.PI / 2, 0, 0.18]}>
          <planeGeometry args={[1, 0.72]} />
          <meshStandardMaterial color={dark ? "#bdb7aa" : "#fffaf0"} roughness={1} />
        </mesh>

        <mesh position={[-0.55, 0.5, 0.55]} rotation={[0.04, -0.08, 0]}>
          <boxGeometry args={[2.55, 1.65, 0.14]} />
          <meshStandardMaterial color={palette.graphite} roughness={0.58} metalness={0.18} />
        </mesh>
        {[0.26, -0.08, -0.42].map((y, i) => (
          <mesh key={y} position={[-0.77 + i * 0.08, 0.63 + y, 0.64]}>
            <boxGeometry args={[1.42 - i * 0.18, 0.075, 0.03]} />
            <meshBasicMaterial color={i === 0 ? palette.lime : palette.line} />
          </mesh>
        ))}

        <group position={[1.2, 0.18, -0.55]} rotation={[0.05, -0.2, 0.02]}>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[index * 0.18, index * 0.14, -index * 0.22]}>
              <boxGeometry args={[2.1, 1.18, 0.12]} />
              <meshStandardMaterial color={index === 2 ? palette.screen : palette.glass} transparent={index !== 2} opacity={mobile ? 1 : index === 2 ? 1 : 0.48} roughness={0.55} />
            </mesh>
          ))}
          <mesh position={[0.48, 0.58, -0.48]}>
            <boxGeometry args={[0.8, 0.08, 0.03]} />
            <meshBasicMaterial color={palette.lime} />
          </mesh>
          <mesh position={[0.28, 0.31, -0.48]}>
            <boxGeometry args={[1.15, 0.07, 0.03]} />
            <meshBasicMaterial color={palette.line} />
          </mesh>
        </group>

        <mesh position={[2.35, -0.05, 1.45]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.085, 12, 36, Math.PI * 1.72]} />
          <meshStandardMaterial color={palette.lime} roughness={0.38} metalness={0.18} />
        </mesh>
        <mesh position={[2.35, 0.01, 1.45]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 20]} />
          <meshStandardMaterial color={palette.graphite} />
        </mesh>

        <mesh position={[-0.15, 0.05, 1.65]}>
          <icosahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial color={palette.lime} emissive={palette.lime} emissiveIntensity={dark ? 0.28 : 0.06} roughness={0.44} />
        </mesh>

        {!mobile ? (
          <group position={[-2.35, 0.08, -0.95]}>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[i * 0.3, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.12 + i * 0.11, 14]} />
                <meshStandardMaterial color={i === 2 ? palette.lime : palette.line} roughness={0.6} />
              </mesh>
            ))}
          </group>
        ) : null}
      </group>
    </>
  );
}

export default function BuilderDeskScene({ theme, quality, onFailure }: Props) {
  const dpr: [number, number] = quality === "mobile" ? [1, 1.5] : [1, 2];
  return (
    <SceneBoundary onFailure={onFailure}>
      <Canvas
        className="builder-desk-canvas"
        aria-hidden="true"
        tabIndex={-1}
        frameloop="demand"
        dpr={dpr}
        camera={{ position: [0, 5.6, 7.8], fov: 39, near: 0.1, far: 30 }}
        gl={{ antialias: quality === "desktop", alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = theme === "dark" ? 1.05 : 0.94;
        }}
      >
        <DeskScene theme={theme} quality={quality} />
      </Canvas>
    </SceneBoundary>
  );
}
