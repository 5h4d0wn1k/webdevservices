import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const createPlanetTexture = (color1: string, color2: string, noiseAmount: number = 0.5) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
        
  // Create gradient background
          const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 512);
          
  // Add noise for texture
          const imageData = ctx.getImageData(0, 0, 512, 512);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
    const noiseValue = (Math.random() - 0.5) * 50 * noiseAmount;
    data[i] = Math.min(255, Math.max(0, data[i] + noiseValue));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noiseValue));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noiseValue));
          }
          ctx.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const Planet = ({ 
  radius, 
  position, 
  colors,
  orbitRadius, 
  orbitSpeed, 
  rotationSpeed,
  atmosphereColor = '#ffffff',
  atmosphereIntensity = 1.5,
  ringGeometry = null
}: {
  radius: number;
  position: [number, number, number];
  colors: [string, string];
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  ringGeometry?: React.ReactNode;
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  
  const texture = useMemo(() => createPlanetTexture(colors[0], colors[1]), [colors]);
  
  useFrame((state) => {
    if (!planetRef.current || !orbitRef.current) return;
    
    planetRef.current.rotation.y += rotationSpeed;
    
    const angle = state.clock.elapsedTime * orbitSpeed;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    orbitRef.current.position.x = x;
    orbitRef.current.position.z = z;

    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime) * 0.03
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <group ref={orbitRef}>
        <mesh ref={planetRef}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>
        
        <mesh ref={atmosphereRef} scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial
            color={atmosphereColor}
              transparent
            opacity={0.1}
            side={THREE.BackSide}
            emissive={atmosphereColor}
            emissiveIntensity={atmosphereIntensity}
            />
          </mesh>

        {ringGeometry && (
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            {ringGeometry}
            <meshStandardMaterial
              color="#A67C52"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.1, orbitRadius + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
    </group>
  );
};

const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!sunRef.current || !coronaRef.current) return;

    sunRef.current.rotation.y += 0.001;
    coronaRef.current.scale.setScalar(
      1.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    );
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial
          emissive="#FDB813"
          emissiveIntensity={2}
        />
        <pointLight color="#FDB813" intensity={100} distance={100} decay={2} />
      </mesh>
      
      <mesh ref={coronaRef}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial
          color="#FDB813"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const GalaxyField = () => {
  const particles = useRef<THREE.Points>(null);
  const count = 10000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count * 3; i += 3) {
    const radius = Math.random() * 100;
    const spinAngle = radius * 3;
    const branchAngle = (Math.PI * 2 * Math.floor(Math.random() * 4)) / 4;
    const height = (Math.random() - 0.5) * 2 * Math.exp(-radius * 0.02);

    positions[i] = Math.cos(spinAngle + branchAngle) * radius;
    positions[i + 1] = height;
    positions[i + 2] = Math.sin(spinAngle + branchAngle) * radius;

    const distanceRatio = radius / 100;
    if (distanceRatio < 0.33) {
      color.setStyle('#6366F1');
    } else if (distanceRatio < 0.66) {
      color.setStyle('#F472B6');
    } else {
      color.setStyle('#ffffff');
    }

    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  useFrame((state) => {
    if (!particles.current) return;
    particles.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

export const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 30, 60], fov: 45 }}>
      <Suspense fallback={null}>
        <Environment preset="night" />
        <Stars
          radius={300}
          depth={100}
          count={10000}
          factor={6}
          saturation={0}
          fade
          speed={1}
        />
        
        <GalaxyField />
        <Sun />

        <Planet
          radius={0.8}
          position={[0, 0, 0]}
          colors={['#71717a', '#3f3f46']}
          orbitRadius={8}
          orbitSpeed={0.08}
          rotationSpeed={0.004}
          atmosphereColor="#666666"
        />
        
        <Planet
          radius={1.2}
          position={[0, 0, 0]}
          colors={['#fb923c', '#ea580c']}
          orbitRadius={12}
          orbitSpeed={0.06}
          rotationSpeed={0.002}
          atmosphereColor="#FFA500"
          atmosphereIntensity={2}
        />
        
        <Planet
          radius={1.4}
          position={[0, 0, 0]}
          colors={['#0ea5e9', '#0369a1']}
          orbitRadius={16}
          orbitSpeed={0.04}
          rotationSpeed={0.003}
          atmosphereColor="#4B96DB"
        />
        
        <Planet
          radius={1}
          position={[0, 0, 0]}
          colors={['#ef4444', '#b91c1c']}
          orbitRadius={20}
          orbitSpeed={0.03}
          rotationSpeed={0.003}
          atmosphereColor="#FF4500"
        />

        <Planet
          radius={3}
          position={[0, 0, 0]}
          colors={['#f97316', '#c2410c']}
          orbitRadius={28}
          orbitSpeed={0.02}
          rotationSpeed={0.005}
          atmosphereColor="#CD853F"
        />
        
            <Planet 
          radius={2.5}
          position={[0, 0, 0]}
          colors={['#eab308', '#a16207']}
          orbitRadius={36}
          orbitSpeed={0.015}
          rotationSpeed={0.004}
          atmosphereColor="#DAA520"
          ringGeometry={<ringGeometry args={[3.5, 5, 64]} />}
        />
          
          <OrbitControls 
          enableZoom={true}
          maxDistance={100}
          minDistance={20}
          autoRotate
          autoRotateSpeed={0.2}
        />
        </Suspense>
      </Canvas>
  );
};
// Enhanced scale factors
