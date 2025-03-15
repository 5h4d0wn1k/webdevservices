import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

interface FloatingSphereProps {
  position?: [number, number, number];
  color?: string;
}

export const FloatingSphere: React.FC<FloatingSphereProps> = ({ 
  position = [0, 0, 0], 
  color = '#F472B6' 
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  const springs = useSpring({
    loop: true,
    from: { distort: 0.3, speed: 3 },
    to: [
      { distort: 0.6, speed: 1 },
      { distort: 0.3, speed: 3 }
    ],
    config: { mass: 1, tension: 150, friction: 10 }
  });

  useFrame((state) => {
    if (!mesh.current) return;
    
    // Complex movement pattern
    const time = state.clock.elapsedTime;
    
    // Lissajous curve movement
    mesh.current.position.x = Math.sin(time * 0.5) * 0.3;
    mesh.current.position.y = Math.sin(time * 0.7) * 0.4;
    mesh.current.position.z = Math.cos(time * 0.3) * 0.2;
    
    // Smooth rotation
    mesh.current.rotation.x = Math.cos(time * 0.4) * 0.3;
    mesh.current.rotation.y = Math.sin(time * 0.5) * 0.3;
    mesh.current.rotation.z = Math.sin(time * 0.3) * 0.2;
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[1, 64, 64]} />
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