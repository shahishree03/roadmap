import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

interface BarProps {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
}

const Bar = ({ position, height, color, label }: BarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = height / 100 * 4; // Max height is 4 units

  useFrame((state) => {
    if (meshRef.current) {
      // Animate growth
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetHeight || 0.1, 0.1);
      meshRef.current.position.y = meshRef.current.scale.y / 2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>
      <Text
        position={[0, -0.5, 0.6]}
        fontSize={0.2}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
        fontWeight="bold"
      >
        {label}
      </Text>
      <Text
        position={[0, targetHeight + 0.3, 0]}
        fontSize={0.25}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {Math.round(height)}%
      </Text>
    </group>
  );
};

export const ThreeDBarChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  return (
    <div className="w-full h-[400px] bg-slate-50/50 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows camera={{ position: [5, 5, 8], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Environment preset="city" />

        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <group position={[-(data.length - 1) * 0.75, -1, 0]}>
            {data.map((item, i) => (
              <Bar
                key={item.label}
                position={[i * 1.5, 0, 0]}
                height={item.value}
                color={item.color}
                label={item.label}
              />
            ))}
            {/* Base grid/floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, -0.05, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#f8fafc" opacity={0.5} transparent />
            </mesh>
          </group>
        </PresentationControls>
      </Canvas>
    </div>
  );
};
