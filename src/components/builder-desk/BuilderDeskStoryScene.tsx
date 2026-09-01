"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Component, type ReactNode, useEffect, useMemo } from "react";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";

type Props = {
  theme: "light" | "dark";
  quality: "desktop" | "mobile";
  stage: number;
  onFailure: () => void;
};

class StoryBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const phase = (stage: number, start: number, end: number) => clamp((stage - start) / (end - start));

function StoryScene({ theme, quality, stage }: Omit<Props, "onFailure">) {
  const { camera, invalidate } = useThree();
  const dark = theme === "dark";
  const mobile = quality === "mobile";
  const prototype = 1 - phase(stage, 0.65, 1.3);
  const review = phase(stage, 0.45, 1.35) * (1 - phase(stage, 1.8, 2.5));
  const testing = phase(stage, 1.45, 2.2) * (1 - phase(stage, 2.75, 3.35));
  const deploy = phase(stage, 2.45, 3.25);
  const real = phase(stage, 3.25, 4);
  const palette = useMemo(() => ({
    paper: dark ? "#d5d0c4" : "#f4efe4",
    graphite: dark ? "#25282e" : "#34383d",
    line: dark ? "#737a83" : "#687078",
    glass: dark ? "#4d555f" : "#9ca3aa",
    surface: dark ? "#14171b" : "#ddd6c8",
    screen: dark ? "#101217" : "#ece7dd",
    lime: "#c7f36b",
  }), [dark]);

  useEffect(() => {
    camera.position.set(mobile ? 0.3 : 0.6, 4.8 - stage * 0.08, 7.2);
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [camera, invalidate, mobile, stage, theme]);

  return (
    <>
      <color attach="background" args={[dark ? "#101216" : "#eee9df"]} />
      <ambientLight intensity={dark ? 1.3 : 1.65} />
      <directionalLight position={[4, 7, 5]} intensity={dark ? 2 : 2.35} color={dark ? "#e7dfd1" : "#fff8e8"} />

      <group rotation={[-0.12, -0.16 + stage * 0.025, 0]} position={[0, -0.28, 0]}>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[6.6, 0.28, 4.6]} />
          <meshStandardMaterial color={palette.surface} roughness={0.84} metalness={0.08} />
        </mesh>

        <group scale={0.82 + prototype * 0.18} position={[-0.85 + stage * 0.12, 0, 0.35]}>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[index * 0.42, index * 0.16, -index * 0.24]} rotation={[0.03, -0.08, index * 0.025]}>
              <boxGeometry args={[2.45 - index * 0.18, 1.5 - index * 0.08, 0.12]} />
              <meshStandardMaterial
                color={index === 2 ? palette.paper : palette.glass}
                transparent={!mobile && index !== 2}
                opacity={mobile || index === 2 ? 1 : 0.5}
                roughness={0.58}
              />
            </mesh>
          ))}
        </group>

        <group position={[-1.05, 0.35, 0.86]} scale={0.4 + review * 0.6}>
          {[0, 1, 2, 3].map((index) => (
            <mesh key={index} position={[0.1 * index, 0.34 - index * 0.23, 0.22]}>
              <boxGeometry args={[1.55 - index * 0.15, 0.065, 0.035]} />
              <meshBasicMaterial color={index === 0 || index === 3 ? palette.lime : palette.line} />
            </mesh>
          ))}
          <mesh position={[0.96, 0.13, 0.22]}>
            <torusGeometry args={[0.16, 0.035, 8, 18, Math.PI * 1.45]} />
            <meshStandardMaterial color={palette.lime} roughness={0.45} />
          </mesh>
        </group>

        <group position={[-2.05, -0.1, -0.9]} scale={0.35 + testing * 0.65}>
          {[0, 1, 2, 3].slice(0, mobile ? 3 : 4).map((index) => (
            <group key={index} position={[index * 0.48, 0, 0]}>
              <mesh position={[0, 0.12 + index * 0.07, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.22 + index * 0.13, 12]} />
                <meshStandardMaterial color={index < 3 ? palette.lime : palette.line} roughness={0.62} />
              </mesh>
              <mesh position={[0, 0.44 + index * 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.12, 12]} />
                <meshBasicMaterial color={index < 3 ? palette.lime : palette.line} />
              </mesh>
            </group>
          ))}
          <mesh position={[0.75 + testing * 0.8, 0.18, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.035, 2.2]} />
            <meshBasicMaterial color={palette.lime} transparent opacity={0.82} />
          </mesh>
        </group>

        <group position={[1.85, 0.08, 0.65]} scale={0.38 + deploy * 0.62}>
          <mesh rotation={[-Math.PI / 2, 0, stage * 0.12]}>
            <torusGeometry args={[0.72, 0.09, 12, 38, Math.PI * 1.72]} />
            <meshStandardMaterial color={palette.lime} roughness={0.38} metalness={0.16} />
          </mesh>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[-0.82 + index * 0.82, 0.04, -0.85 + index * 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.62, 0.025]} />
              <meshBasicMaterial color={index === 1 ? palette.lime : palette.line} />
            </mesh>
          ))}
        </group>

        <group position={[0.45, 0.65 + real * 0.14, -0.55]} scale={0.55 + real * 0.45}>
          <mesh>
            <boxGeometry args={[3.55, 2.05, 0.16]} />
            <meshStandardMaterial color={palette.graphite} roughness={0.5} metalness={0.17} />
          </mesh>
          <mesh position={[0, 0, 0.095]}>
            <planeGeometry args={[3.18, 1.63]} />
            <meshStandardMaterial color={palette.screen} roughness={0.68} />
          </mesh>
          <mesh position={[-0.92, 0.42, 0.12]}>
            <boxGeometry args={[0.8, 0.08, 0.025]} />
            <meshBasicMaterial color={palette.lime} />
          </mesh>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[-0.58 + index * 0.78, -0.25, 0.12]}>
              <boxGeometry args={[0.58, 0.62 - index * 0.08, 0.025]} />
              <meshBasicMaterial color={index === 1 ? palette.lime : palette.line} transparent opacity={index === 1 ? 0.45 : 0.24} />
            </mesh>
          ))}
        </group>

        <mesh position={[-2.2 + stage * 0.85, 0.1 + Math.sin(stage * Math.PI) * 0.08, 1.45]} scale={1 - real * 0.55}>
          <icosahedronGeometry args={[0.24, 1]} />
          <meshStandardMaterial color={palette.lime} emissive={palette.lime} emissiveIntensity={dark ? 0.22 : 0.05} roughness={0.44} />
        </mesh>
      </group>
    </>
  );
}

export default function BuilderDeskStoryScene({ theme, quality, stage, onFailure }: Props) {
  const dpr: [number, number] = quality === "mobile" ? [1, 1.5] : [1, 2];
  return (
    <StoryBoundary onFailure={onFailure}>
      <Canvas
        className="builder-story__canvas"
        aria-hidden="true"
        tabIndex={-1}
        frameloop="demand"
        dpr={dpr}
        camera={{ position: [0.6, 4.8, 7.2], fov: 40, near: 0.1, far: 30 }}
        gl={{ antialias: quality === "desktop", alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = theme === "dark" ? 1.04 : 0.95;
        }}
      >
        <StoryScene theme={theme} quality={quality} stage={stage} />
      </Canvas>
    </StoryBoundary>
  );
}
