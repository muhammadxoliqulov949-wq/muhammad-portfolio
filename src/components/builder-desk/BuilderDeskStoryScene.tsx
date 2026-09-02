"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Component, type ReactNode, useEffect, useMemo } from "react";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";

type Props = { theme: "light" | "dark"; quality: "desktop" | "mobile"; stage: number; onFailure: () => void };
type Transform = { position: [number, number, number]; rotation: [number, number, number]; scale: number };

class StoryBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const phase = (stage: number, start: number, end: number) => clamp((stage - start) / (end - start));

function sample(keys: Transform[], stage: number): Transform {
  const from = Math.min(Math.floor(stage), keys.length - 1);
  const to = Math.min(from + 1, keys.length - 1);
  const amount = stage - from;
  return {
    position: keys[from].position.map((value, index) => mix(value, keys[to].position[index], amount)) as Transform["position"],
    rotation: keys[from].rotation.map((value, index) => mix(value, keys[to].rotation[index], amount)) as Transform["rotation"],
    scale: mix(keys[from].scale, keys[to].scale, amount),
  };
}

const PANEL_PATHS: Transform[][] = [
  [
    { position: [-2.2, -0.1, 1.25], rotation: [-1.2, 0.2, -0.35], scale: 0.45 },
    { position: [-1.35, 0.2, 0.6], rotation: [-0.18, -0.12, -0.08], scale: 0.9 },
    { position: [-1.55, 0.6, 0.45], rotation: [0.02, -0.2, -0.04], scale: 0.88 },
    { position: [-1.85, 0.15, 0.15], rotation: [-0.12, 0.06, -0.02], scale: 0.78 },
    { position: [-0.45, 0.32, -0.35], rotation: [0.01, -0.05, 0], scale: 0.75 },
    { position: [0, 0.52, -0.45], rotation: [0, 0, 0], scale: 1.12 },
  ],
  [
    { position: [1.75, -0.25, 1.15], rotation: [-1.05, -0.2, 0.28], scale: 0.38 },
    { position: [0.95, 0.35, 0.35], rotation: [-0.1, 0.14, 0.05], scale: 0.82 },
    { position: [0.4, 0.35, 0], rotation: [0.03, -0.06, 0.02], scale: 0.86 },
    { position: [-0.55, 0.05, -0.15], rotation: [-0.08, 0.02, 0.01], scale: 0.72 },
    { position: [-0.15, 0.3, -0.48], rotation: [0, -0.03, 0], scale: 0.78 },
    { position: [0, 0.52, -0.43], rotation: [0, 0, 0], scale: 1.1 },
  ],
  [
    { position: [-0.2, -0.38, -1.3], rotation: [-1.4, 0.15, 0.14], scale: 0.32 },
    { position: [1.45, 0.08, -0.45], rotation: [-0.06, -0.18, -0.04], scale: 0.74 },
    { position: [1.6, 0.1, -0.75], rotation: [0.03, -0.1, -0.03], scale: 0.78 },
    { position: [0.75, -0.08, -0.42], rotation: [-0.08, 0.01, 0], scale: 0.68 },
    { position: [0.2, 0.27, -0.61], rotation: [0, -0.02, 0], scale: 0.8 },
    { position: [0, 0.52, -0.41], rotation: [0, 0, 0], scale: 1.08 },
  ],
  [
    { position: [2.35, -0.4, -0.4], rotation: [-1.25, -0.1, -0.25], scale: 0.28 },
    { position: [-0.2, -0.15, -0.7], rotation: [-0.1, 0.08, 0.03], scale: 0.62 },
    { position: [2.05, -0.2, -1.05], rotation: [0.02, -0.08, 0.04], scale: 0.68 },
    { position: [1.95, -0.25, -0.65], rotation: [-0.06, -0.02, 0], scale: 0.62 },
    { position: [0.55, 0.24, -0.72], rotation: [0, -0.01, 0], scale: 0.76 },
    { position: [0, 0.52, -0.39], rotation: [0, 0, 0], scale: 1.06 },
  ],
];

function WorkflowPanel({ index, stage, palette, mobile }: { index: number; stage: number; palette: Record<string, string>; mobile: boolean }) {
  const transform = sample(PANEL_PATHS[index], stage);
  const review = phase(stage, 1.25, 2.15);
  const verified = phase(stage, 2.45, 3.35);
  const final = phase(stage, 4.2, 5);
  return (
    <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
      <mesh>
        <boxGeometry args={[2.75, 1.72, 0.12]} />
        <meshStandardMaterial color={index === 0 ? palette.paper : palette.glass} transparent={!mobile && index !== 0} opacity={index === 0 || mobile ? 1 : mix(0.38, 0.72, final)} roughness={mix(0.72, 0.48, final)} metalness={index === 0 ? 0.04 : 0.15} />
      </mesh>
      {[0, 1, 2].map((line) => (
        <mesh key={line} position={[-0.48 + line * 0.07, 0.42 - line * 0.28, 0.075]}>
          <boxGeometry args={[1.38 - line * 0.22, 0.055, 0.025]} />
          <meshBasicMaterial color={line === 0 ? palette.lime : palette.line} transparent opacity={0.45 + review * 0.55} />
        </mesh>
      ))}
      <mesh position={[0.98, 0.56, 0.08]} scale={0.55 + verified * 0.45}>
        <ringGeometry args={[0.095, 0.14, 14]} />
        <meshBasicMaterial color={verified > 0.45 ? palette.lime : palette.line} />
      </mesh>
    </group>
  );
}

function StoryScene({ theme, quality, stage }: Omit<Props, "onFailure">) {
  const { camera, invalidate } = useThree();
  const dark = theme === "dark";
  const mobile = quality === "mobile";
  const review = phase(stage, 1.2, 2.2);
  const testing = phase(stage, 2.25, 3.25);
  const deploy = phase(stage, 3.25, 4.25);
  const final = phase(stage, 4.15, 5);
  const palette = useMemo(() => ({ paper: dark ? "#d8d2c5" : "#f5f0e5", graphite: dark ? "#25282e" : "#34383d", line: dark ? "#747c85" : "#687078", glass: dark ? "#505863" : "#9ca3aa", surface: dark ? "#15181c" : "#dcd4c5", screen: dark ? "#101217" : "#ece7dd", lime: "#c7f36b" }), [dark]);

  useEffect(() => {
    const cameraPath: [number, number, number][] = mobile
      ? [[0.1, 4.65, 7.6], [0.15, 4.55, 7.35], [0.1, 4.5, 7.2], [0.15, 4.4, 7.1], [0.1, 4.35, 7], [0, 4.4, 6.8]]
      : [[0.8, 5.1, 8.3], [0.35, 4.8, 7.75], [-0.35, 4.65, 7.4], [0.4, 4.45, 7.15], [0.1, 4.3, 6.85], [0, 4.35, 6.55]];
    const from = Math.min(Math.floor(stage), cameraPath.length - 1);
    const to = Math.min(from + 1, cameraPath.length - 1);
    const amount = stage - from;
    camera.position.set(mix(cameraPath[from][0], cameraPath[to][0], amount), mix(cameraPath[from][1], cameraPath[to][1], amount), mix(cameraPath[from][2], cameraPath[to][2], amount));
    camera.lookAt(mix(-0.4, 0, final), mix(0, 0.35, final), mix(0.2, -0.35, final));
    invalidate();
  }, [camera, final, invalidate, mobile, stage, theme]);

  return (
    <>
      <color attach="background" args={[dark ? "#101216" : "#eee9df"]} />
      <ambientLight intensity={mix(dark ? 1.15 : 1.5, dark ? 1.42 : 1.75, final)} />
      <directionalLight position={[4 - stage * 0.35, 7, 5]} intensity={dark ? 2 : 2.35} color={dark ? "#e7dfd1" : "#fff8e8"} />
      <group rotation={[-0.1 + stage * 0.008, -0.15 + stage * 0.022, 0]} position={[0, -0.36, 0]}>
        <mesh position={[0, -0.72, 0]} scale={[mix(1, 0.82, final), 1, mix(1, 0.8, final)]}>
          <boxGeometry args={[7.6, 0.3, 5.3]} />
          <meshStandardMaterial color={palette.surface} roughness={0.86} metalness={0.07} />
        </mesh>
        {PANEL_PATHS.slice(0, mobile ? 3 : 4).map((_, index) => <WorkflowPanel key={index} index={index} stage={stage} palette={palette} mobile={mobile} />)}
        <group position={[-2.2 + testing * 2.2, -0.18, -0.9]} scale={0.38 + testing * 0.62}>
          {[0, 1, 2, 3].slice(0, mobile ? 3 : 4).map((index) => (
            <mesh key={index} position={[index * 0.45, 0.12 + index * 0.07, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.2 + index * 0.12, 12]} />
              <meshStandardMaterial color={index < Math.ceil(testing * 4) ? palette.lime : palette.line} roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[mix(-0.2, 1.7, testing), 0.22, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.03, 2.25]} />
            <meshBasicMaterial color={palette.lime} transparent opacity={0.72} />
          </mesh>
        </group>
        <group position={[1.72 - final * 1.72, 0.08 + final * 0.35, 0.7 - final]} scale={0.35 + deploy * 0.78}>
          <mesh rotation={[-Math.PI / 2, 0, stage * 0.18]}>
            <torusGeometry args={[0.78, 0.09, 12, 42, Math.PI * mix(1.05, 1.94, deploy)]} />
            <meshStandardMaterial color={palette.lime} roughness={0.36} metalness={0.18} />
          </mesh>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[-1.25 + index * 0.85, 0.02, -0.7 + index * 0.15]} rotation={[-Math.PI / 2, 0, 0]} scale={[deploy, 1, 1]}>
              <planeGeometry args={[0.8, 0.025]} />
              <meshBasicMaterial color={index === 1 ? palette.lime : palette.line} />
            </mesh>
          ))}
        </group>
        <mesh position={[-2.45 + stage * 0.49, 0.05 + Math.sin(stage * Math.PI) * 0.08, 1.55 - final * 1.4]} scale={mix(1, 0.32, final)}>
          <icosahedronGeometry args={[0.29, 1]} />
          <meshStandardMaterial color={palette.lime} emissive={palette.lime} emissiveIntensity={dark ? 0.24 : 0.06} roughness={0.42} />
        </mesh>
        <group position={[0, 0.48, -0.38]} scale={0.2 + final * 0.96}>
          <mesh><boxGeometry args={[4.45, 2.62, 0.18]} /><meshStandardMaterial color={palette.graphite} roughness={0.48} metalness={0.18} /></mesh>
          <mesh position={[0, 0, 0.1]}><planeGeometry args={[4.06, 2.22]} /><meshBasicMaterial color={palette.screen} transparent opacity={1 - final * 0.82} /></mesh>
        </group>
        <group position={[0, 0.1, 0.4]} scale={0.15 + review * (1 - final) * 0.85}>
          {[0, 1, 2, 3, 4].map((index) => (
            <mesh key={index} position={[-2 + index, 0, -0.5 + (index % 2) * 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.72, 0.025]} /><meshBasicMaterial color={index % 2 ? palette.lime : palette.line} transparent opacity={0.65} />
            </mesh>
          ))}
        </group>
      </group>
    </>
  );
}

export default function BuilderDeskStoryScene({ theme, quality, stage, onFailure }: Props) {
  const dpr: [number, number] = quality === "mobile" ? [1, 1.5] : [1, 2];
  return (
    <StoryBoundary onFailure={onFailure}>
      <Canvas className="builder-story__canvas" aria-hidden="true" tabIndex={-1} frameloop="demand" dpr={dpr} camera={{ position: [0.8, 5.1, 8.3], fov: 38, near: 0.1, far: 30 }} gl={{ antialias: quality === "desktop", alpha: false, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.outputColorSpace = SRGBColorSpace; gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = theme === "dark" ? 1.04 : 0.95; }}>
        <StoryScene theme={theme} quality={quality} stage={stage} />
      </Canvas>
    </StoryBoundary>
  );
}
