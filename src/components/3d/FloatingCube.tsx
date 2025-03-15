import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

interface FloatingCubeProps {
  position?: [number, number, number];
  color?: string;
}

export const FloatingCube: React.FC<FloatingCubeProps> = ({ 
  position = [0, 0, 0], 
  color = '#6366F1' 
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  const springs = useSpring({
    loop: true,
    from: { distort: 0.4, speed: 4 },
    to: [
      { distort: 0.7, speed: 2 },
      { distort: 0.4, speed: 4 }
    ],
    config: { mass: 2, tension: 170, friction: 15 }
  });

  useFrame((state) => {
    if (!mesh.current) return;
    
    // Complex movement pattern
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
    mesh.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.8) * 0.3;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    mesh.current.position.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <AnimatedMeshDistortMaterial
        color={color}
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.5}
        {...springs}
      />
    </mesh>
  );
};