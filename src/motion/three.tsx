import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, ease } from "./theme";

/**
 * Objeto 3D flotante con anillos de órbita luminosos (como la caja de Waves Studio).
 * Todo el movimiento depende de useCurrentFrame(), nunca de useFrame().
 */
export const Orbit3D: React.FC<{ at?: number; color?: string; ring?: string }> = ({
  at = 0,
  color = "#c8a27a",
  ring = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = (frame - at) / 30;
  const enter = interpolate(frame - at, [0, 20], [0, 1], { ...clamp, easing: ease.out });
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0.6, 6], fov: 35 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#9fd2ff" />
      <group scale={enter} rotation={[0.35, t * 0.9, 0.1]} position={[0, 0.35 + Math.sin(t * 1.4) * 0.12, 0]}>
        <mesh>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
        </mesh>
      </group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.35, 0]} rotation={[1.2 + i * 0.5, t * (0.6 + i * 0.25), i * 0.8]} scale={enter}>
          <torusGeometry args={[1.25 + i * 0.18, 0.012, 16, 160, Math.PI * 2 * interpolate(frame - at, [i * 4, 30 + i * 4], [0, 1], clamp)]} />
          <meshBasicMaterial color={ring} transparent opacity={0.85} />
        </mesh>
      ))}
    </ThreeCanvas>
  );
};
