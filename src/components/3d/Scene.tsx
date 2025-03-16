import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Import planet textures
import earthDayMap from '../../assets/planettextures/8k_earth_daymap.jpg';
import earthCloudsMap from '../../assets/planettextures/8k_earth_clouds.jpg';
import earthNightMap from '../../assets/planettextures/8k_earth_nightmap.jpg';
import mercuryMap from '../../assets/planettextures/8k_mercury.jpg';
import venusMap from '../../assets/planettextures/8k_venus_surface.jpg';
import venusAtmosphereMap from '../../assets/planettextures/4k_venus_atmosphere.jpg';
import marsMap from '../../assets/planettextures/8k_mars.jpg';
import jupiterMap from '../../assets/planettextures/8k_jupiter.jpg';
import saturnMap from '../../assets/planettextures/8k_saturn.jpg';
import saturnRingMap from '../../assets/planettextures/8k_saturn_ring_alpha.png';
import uranusMap from '../../assets/planettextures/2k_uranus.jpg';
import neptuneMap from '../../assets/planettextures/2k_neptune.jpg';
import sunMap from '../../assets/planettextures/8k_sun.jpg';
import moonMap from '../../assets/planettextures/8k_moon.jpg';

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
  textureMap,
  bumpMap = null,
  normalMap = null,
  cloudsMap = null,
  orbitRadius, 
  orbitSpeed, 
  rotationSpeed,
  atmosphereColor = '#ffffff',
  atmosphereIntensity = 1.5,
  ringGeometry = null,
  ringTexture = null,
  tilt = 0
}: {
  radius: number;
  position: [number, number, number];
  textureMap: string;
  bumpMap?: string | null;
  normalMap?: string | null;
  cloudsMap?: string | null;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  ringGeometry?: React.ReactNode;
  ringTexture?: string | null;
  tilt?: number;
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  
  // Load textures
  const texture = useTexture(textureMap);
  const bumpTexture = bumpMap ? useTexture(bumpMap) : null;
  const normalTexture = normalMap ? useTexture(normalMap) : null;
  const cloudsTexture = cloudsMap ? useTexture(cloudsMap) : null;
  const ringTextureMap = ringTexture ? useTexture(ringTexture) : null;
  
  // Apply texture settings
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    if (cloudsTexture) {
      cloudsTexture.colorSpace = THREE.SRGBColorSpace;
    }
    if (ringTextureMap) {
      ringTextureMap.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture, cloudsTexture, ringTextureMap]);
  
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
        1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 0.6; // Clouds rotate slightly faster
    }
  });

  return (
    <group position={position}>
      <group ref={orbitRef} rotation={[0, 0, tilt]}>
        <mesh ref={planetRef}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            bumpMap={bumpTexture}
            normalMap={normalTexture}
            bumpScale={0.05}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        
        {cloudsMap && (
          <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshStandardMaterial
              map={cloudsTexture}
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        )}
        
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
              map={ringTextureMap}
              color="#A67C52"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
              alphaTest={0.1}
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
  const texture = useTexture(sunMap);
  
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

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
          map={texture}
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
      
      {/* Add a glow effect */}
      <mesh>
        <sphereGeometry args={[7, 32, 32]} />
        <meshBasicMaterial
          color="#FF7700"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const EnhancedStars = () => {
  const starsRef1 = useRef<THREE.Points>(null);
  const starsRef2 = useRef<THREE.Points>(null);
  
  // Create two layers of stars with different densities and sizes
  const count1 = 15000;
  const count2 = 5000;
  
  const positions1 = useMemo(() => {
    const positions = new Float32Array(count1 * 3);
    for (let i = 0; i < count1 * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600;
      positions[i + 1] = (Math.random() - 0.5) * 600;
      positions[i + 2] = (Math.random() - 0.5) * 600;
    }
    return positions;
  }, [count1]);
  
  const positions2 = useMemo(() => {
    const positions = new Float32Array(count2 * 3);
    for (let i = 0; i < count2 * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 400;
      positions[i + 1] = (Math.random() - 0.5) * 400;
      positions[i + 2] = (Math.random() - 0.5) * 400;
    }
    return positions;
  }, [count2]);
  
  const colors1 = useMemo(() => {
    const colors = new Float32Array(count1 * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count1 * 3; i += 3) {
      // Random star colors with bias towards white/blue
      const r = Math.random();
      if (r < 0.1) {
        color.setStyle('#FF8F8F'); // Reddish
      } else if (r < 0.2) {
        color.setStyle('#FFDF8F'); // Yellowish
      } else if (r < 0.4) {
        color.setStyle('#8FB3FF'); // Blueish
      } else {
        color.setStyle('#FFFFFF'); // White
      }
      
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    return colors;
  }, [count1]);
  
  const colors2 = useMemo(() => {
    const colors = new Float32Array(count2 * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count2 * 3; i += 3) {
      // Brighter stars
      const r = Math.random();
      if (r < 0.3) {
        color.setStyle('#A7D8FF'); // Light blue
      } else if (r < 0.6) {
        color.setStyle('#FFFACD'); // Light yellow
      } else {
        color.setStyle('#FFFFFF'); // White
      }
      
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    return colors;
  }, [count2]);
  
  useFrame((state) => {
    if (starsRef1.current) {
      starsRef1.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
    if (starsRef2.current) {
      starsRef2.current.rotation.y = -state.clock.elapsedTime * 0.005;
    }
  });
  
  return (
    <>
      <points ref={starsRef1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions1.length / 3}
            array={positions1}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors1.length / 3}
            array={colors1}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.2} 
          vertexColors 
          transparent 
          opacity={0.7}
          sizeAttenuation
        />
      </points>
      
      <points ref={starsRef2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions2.length / 3}
            array={positions2}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors2.length / 3}
            array={colors2}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.3} 
          vertexColors 
          transparent 
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </>
  );
};

const GalaxyField = () => {
  const particles = useRef<THREE.Points>(null);
  const count = 15000; // Increased particle count
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count * 3; i += 3) {
    const radius = Math.random() * 100;
    const spinAngle = radius * 3;
    const branchAngle = (Math.PI * 2 * Math.floor(Math.random() * 6)) / 6; // More spiral arms
    const randomOffset = (Math.random() - 0.5) * 2 * Math.exp(-radius * 0.01) * 5; // More randomness
    const height = (Math.random() - 0.5) * 2 * Math.exp(-radius * 0.02) * 2; // Thicker galaxy

    positions[i] = Math.cos(spinAngle + branchAngle) * radius + randomOffset;
    positions[i + 1] = height;
    positions[i + 2] = Math.sin(spinAngle + branchAngle) * radius + randomOffset;

    const distanceRatio = radius / 100;
    if (distanceRatio < 0.25) {
      color.setStyle('#8B5CF6'); // Purple
    } else if (distanceRatio < 0.5) {
      color.setStyle('#EC4899'); // Pink
    } else if (distanceRatio < 0.75) {
      color.setStyle('#3B82F6'); // Blue
    } else {
      color.setStyle('#ffffff'); // White
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
        size={0.15} 
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
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        <EnhancedStars />
        <GalaxyField />
        <Sun />

        {/* Mercury */}
        <Planet
          radius={0.8}
          position={[0, 0, 0]}
          textureMap={mercuryMap}
          orbitRadius={8}
          orbitSpeed={0.08}
          rotationSpeed={0.004}
          atmosphereColor="#666666"
          atmosphereIntensity={0.5}
        />
        
        {/* Venus */}
        <Planet
          radius={1.2}
          position={[0, 0, 0]}
          textureMap={venusMap}
          cloudsMap={venusAtmosphereMap}
          orbitRadius={12}
          orbitSpeed={0.06}
          rotationSpeed={0.002}
          atmosphereColor="#FFA500"
          atmosphereIntensity={2}
        />
        
        {/* Earth */}
        <Planet
          radius={1.4}
          position={[0, 0, 0]}
          textureMap={earthDayMap}
          cloudsMap={earthCloudsMap}
          orbitRadius={16}
          orbitSpeed={0.04}
          rotationSpeed={0.003}
          atmosphereColor="#4B96DB"
          tilt={0.41} // Earth's axial tilt (23.5 degrees in radians)
        />
        
        {/* Mars */}
        <Planet
          radius={1}
          position={[0, 0, 0]}
          textureMap={marsMap}
          orbitRadius={20}
          orbitSpeed={0.03}
          rotationSpeed={0.003}
          atmosphereColor="#FF4500"
          atmosphereIntensity={0.8}
          tilt={0.44} // Mars' axial tilt (25 degrees in radians)
        />

        {/* Jupiter */}
        <Planet
          radius={3}
          position={[0, 0, 0]}
          textureMap={jupiterMap}
          orbitRadius={28}
          orbitSpeed={0.02}
          rotationSpeed={0.005}
          atmosphereColor="#CD853F"
          tilt={0.05} // Jupiter's axial tilt (3 degrees in radians)
        />
        
        {/* Saturn */}
        <Planet 
          radius={2.5}
          position={[0, 0, 0]}
          textureMap={saturnMap}
          orbitRadius={36}
          orbitSpeed={0.015}
          rotationSpeed={0.004}
          atmosphereColor="#DAA520"
          ringGeometry={<ringGeometry args={[3.5, 5, 64]} />}
          ringTexture={saturnRingMap}
          tilt={0.47} // Saturn's axial tilt (27 degrees in radians)
        />
        
        {/* Uranus */}
        <Planet 
          radius={1.8}
          position={[0, 0, 0]}
          textureMap={uranusMap}
          orbitRadius={44}
          orbitSpeed={0.01}
          rotationSpeed={0.003}
          atmosphereColor="#B0E0E6"
          atmosphereIntensity={1.2}
          tilt={1.48} // Uranus' axial tilt (85 degrees in radians)
        />
        
        {/* Neptune */}
        <Planet 
          radius={1.8}
          position={[0, 0, 0]}
          textureMap={neptuneMap}
          orbitRadius={52}
          orbitSpeed={0.008}
          rotationSpeed={0.003}
          atmosphereColor="#4169E1"
          atmosphereIntensity={1.5}
          tilt={0.49} // Neptune's axial tilt (28 degrees in radians)
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
};// Enhanced scale factors
