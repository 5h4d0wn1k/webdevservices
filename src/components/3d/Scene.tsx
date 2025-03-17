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

// Planet component with moons support
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
  tilt = 0,
  moons = [],
  rings = null
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
  tilt?: number;
  moons?: Array<{
    name: string;
    distance: number;
    size: number;
    color1: string;
    color2: string;
    orbitSpeed: number;
    rotationSpeed: number;
  }>;
  rings?: React.ReactNode;
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  
  const texture = useTexture(textureMap);
  const bumpTexture = bumpMap ? useTexture(bumpMap) : null;
  const normalTexture = normalMap ? useTexture(normalMap) : null;
  const cloudsTexture = cloudsMap ? useTexture(cloudsMap) : null;

  useEffect(() => {
    if (texture) texture.colorSpace = THREE.SRGBColorSpace;
    if (cloudsTexture) cloudsTexture.colorSpace = THREE.SRGBColorSpace;
  }, [texture, cloudsTexture]);

  useFrame((state) => {
    if (!planetRef.current || !orbitRef.current) return;
    
    planetRef.current.rotation.y += rotationSpeed;
    
    const angle = state.clock.elapsedTime * orbitSpeed;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    orbitRef.current.position.x = x;
    orbitRef.current.position.z = z;

    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03);
    }
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 0.6;
    }
  });

  return (
    <group position={position}>
      <group ref={orbitRef}>
        <group rotation={[0, 0, tilt]}>
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

          {rings}

          {/* Moons */}
          {moons.map((moon) => (
            <Moon
              key={moon.name}
              parentRadius={0}
              orbitRadius={moon.distance}
              size={moon.size}
              textureMap={moon.name === "Moon" ? moonMap : createProceduralTexture(moon.color1, moon.color2, 0.8)}
              orbitSpeed={moon.orbitSpeed}
              rotationSpeed={moon.rotationSpeed}
            />
          ))}
        </group>
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

// Create asteroid belt particles
const createAsteroidBelt = (count: number, innerRadius: number, outerRadius: number) => {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 2;

    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;

    sizes[i] = Math.random() * 0.3 + 0.1;

    color.setHSL(0.1, 0.2, Math.random() * 0.2 + 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return { positions, sizes, colors };
};

// Moon component with texture type handling
const Moon = ({ parentRadius, orbitRadius, size, textureMap, orbitSpeed, rotationSpeed }: {
  parentRadius: number;
  orbitRadius: number;
  size: number;
  textureMap: string | THREE.Texture;
  orbitSpeed: number;
  rotationSpeed: number;
}) => {
  const moonRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const texture = typeof textureMap === 'string' ? useTexture(textureMap) : textureMap;

  useEffect(() => {
    if (texture && 'colorSpace' in texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  useFrame((state) => {
    if (!moonRef.current || !orbitRef.current) return;

    moonRef.current.rotation.y += rotationSpeed;
    const angle = state.clock.elapsedTime * orbitSpeed;
    orbitRef.current.rotation.y = angle;
  });

  return (
    <group position={[parentRadius, 0, 0]}>
      <group ref={orbitRef}>
        <mesh ref={moonRef} position={[orbitRadius, 0, 0]}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      </group>
    </group>
  );
};

// Create a procedural texture and return it as a THREE.Texture
const createProceduralTexture = (color1: string, color2: string, noiseAmount: number = 0.5) => {
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

// Asteroid Belt component
const AsteroidBelt = ({ count, innerRadius, outerRadius }: {
  count: number;
  innerRadius: number;
  outerRadius: number;
}) => {
  const { positions, sizes, colors } = useMemo(
    () => createAsteroidBelt(count, innerRadius, outerRadius),
    [count, innerRadius, outerRadius]
  );

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={pointsRef}>
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

// Enhanced Saturn Rings with proper scale and detail
const SaturnRings = ({ radius }: { radius: number }) => {
  const ringsRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(saturnRingMap);

  useEffect(() => {
    if (texture) texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.005;
    }
  });

  return (
    <group rotation={[Math.PI / 2.8, 0, Math.PI / 6]}>
      {/* Main rings (A, B rings) */}
      <mesh ref={ringsRef}>
        <ringGeometry args={[radius * 1.2, radius * 2.0, 256]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          color="#A67C52"
        />
      </mesh>
      {/* C ring (inner) */}
      <mesh>
        <ringGeometry args={[radius * 1.1, radius * 1.19, 180]} />
        <meshStandardMaterial
          color="#8B4513"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* D ring (innermost) */}
      <mesh>
        <ringGeometry args={[radius * 1.05, radius * 1.09, 180]} />
        <meshStandardMaterial
          color="#8B4513"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* F ring (narrow, bright) */}
      <mesh>
        <ringGeometry args={[radius * 2.01, radius * 2.05, 180]} />
        <meshStandardMaterial
          color="#FFE4B5"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
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

        {/* Main Asteroid Belt */}
        <AsteroidBelt count={10000} innerRadius={22} outerRadius={26} />

        {/* Kuiper Belt */}
        <AsteroidBelt count={15000} innerRadius={54} outerRadius={60} />

        {/* Mercury (no moons) */}
        <Planet
          radius={0.8}
          position={[0, 0, 0]}
          textureMap={mercuryMap}
          orbitRadius={12}
          orbitSpeed={0.08}
          rotationSpeed={0.004}
          atmosphereColor="#666666"
          atmosphereIntensity={0.5}
        />
        
        {/* Venus (no moons) */}
        <Planet
          radius={1.2}
          position={[0, 0, 0]}
          textureMap={venusMap}
          cloudsMap={venusAtmosphereMap}
          orbitRadius={18}
          orbitSpeed={0.06}
          rotationSpeed={0.002}
          atmosphereColor="#FFA500"
          atmosphereIntensity={2}
        />
        
        {/* Earth with Moon */}
        <Planet
          radius={1.4}
          position={[0, 0, 0]}
          textureMap={earthDayMap}
          cloudsMap={earthCloudsMap}
          orbitRadius={24}
          orbitSpeed={0.04}
          rotationSpeed={0.003}
          atmosphereColor="#4B96DB"
          tilt={0.41}
          moons={[
            {
              name: "Moon",
              distance: 3.5,
              size: 0.38,
              color1: '#CCCCCC',
              color2: '#999999',
              orbitSpeed: 0.15,
              rotationSpeed: 0.005
            }
          ]}
        />

        {/* Mars with moons */}
        <Planet
          radius={1}
          position={[0, 0, 0]}
          textureMap={marsMap}
          orbitRadius={32}
          orbitSpeed={0.03}
          rotationSpeed={0.003}
          atmosphereColor="#FF4500"
          atmosphereIntensity={0.8}
          tilt={0.44}
          moons={[
            {
              name: "Phobos",
              distance: 2.2,
              size: 0.02,
              color1: '#8B4513',
              color2: '#A0522D',
              orbitSpeed: 0.3,
              rotationSpeed: 0.008
            },
            {
              name: "Deimos",
              distance: 3.0,
              size: 0.015,
              color1: '#696969',
              color2: '#808080',
              orbitSpeed: 0.2,
              rotationSpeed: 0.006
            }
          ]}
        />

        {/* Jupiter with Galilean moons */}
        <Planet
          radius={3}
          position={[0, 0, 0]}
          textureMap={jupiterMap}
          orbitRadius={42}
          orbitSpeed={0.02}
          rotationSpeed={0.005}
          atmosphereColor="#CD853F"
          tilt={0.05}
          moons={[
            { name: "Io", distance: 6.0, size: 0.26, color1: '#FFD700', color2: '#DAA520', orbitSpeed: 0.25, rotationSpeed: 0.005 },
            { name: "Europa", distance: 8.5, size: 0.24, color1: '#F5F5F5', color2: '#A9A9A9', orbitSpeed: 0.2, rotationSpeed: 0.005 },
            { name: "Ganymede", distance: 12.0, size: 0.37, color1: '#8B4513', color2: '#A0522D', orbitSpeed: 0.15, rotationSpeed: 0.005 },
            { name: "Callisto", distance: 16.0, size: 0.34, color1: '#696969', color2: '#808080', orbitSpeed: 0.1, rotationSpeed: 0.005 }
          ]}
        />

        {/* Saturn with rings and moons */}
        <Planet
          radius={2.5}
          position={[0, 0, 0]}
          textureMap={saturnMap}
          orbitRadius={54}
          orbitSpeed={0.015}
          rotationSpeed={0.004}
          atmosphereColor="#DAA520"
          tilt={0.47}
          rings={<SaturnRings radius={2.5} />}
          moons={[
            { name: "Titan", distance: 14.0, size: 0.36, color1: '#FFD700', color2: '#B8860B', orbitSpeed: 0.15, rotationSpeed: 0.005 },
            { name: "Rhea", distance: 8.0, size: 0.11, color1: '#C0C0C0', color2: '#808080', orbitSpeed: 0.2, rotationSpeed: 0.005 },
            { name: "Iapetus", distance: 20.0, size: 0.1, color1: '#8B4513', color2: '#A0522D', orbitSpeed: 0.08, rotationSpeed: 0.005 },
            { name: "Dione", distance: 6.5, size: 0.08, color1: '#E6E6FA', color2: '#D8BFD8', orbitSpeed: 0.22, rotationSpeed: 0.005 },
            { name: "Tethys", distance: 5.0, size: 0.08, color1: '#F0F8FF', color2: '#B0C4DE', orbitSpeed: 0.24, rotationSpeed: 0.005 },
            { name: "Enceladus", distance: 4.0, size: 0.04, color1: '#FFFFFF', color2: '#F0F8FF', orbitSpeed: 0.26, rotationSpeed: 0.005 },
            { name: "Mimas", distance: 3.2, size: 0.03, color1: '#D3D3D3', color2: '#A9A9A9', orbitSpeed: 0.28, rotationSpeed: 0.005 }
          ]}
        />

        {/* Uranus with moons */}
        <Planet
          radius={1.8}
          position={[0, 0, 0]}
          textureMap={uranusMap}
          orbitRadius={68}
          orbitSpeed={0.01}
          rotationSpeed={0.003}
          atmosphereColor="#B0E0E6"
          atmosphereIntensity={1.2}
          tilt={1.48}
          moons={[
            { name: "Titania", distance: 7.0, size: 0.12, color1: '#E6E6FA', color2: '#D8BFD8', orbitSpeed: 0.2, rotationSpeed: 0.005 },
            { name: "Oberon", distance: 9.0, size: 0.12, color1: '#F0F8FF', color2: '#B0C4DE', orbitSpeed: 0.18, rotationSpeed: 0.005 },
            { name: "Umbriel", distance: 5.5, size: 0.09, color1: '#808080', color2: '#696969', orbitSpeed: 0.22, rotationSpeed: 0.005 },
            { name: "Ariel", distance: 4.2, size: 0.09, color1: '#DCDCDC', color2: '#C0C0C0', orbitSpeed: 0.24, rotationSpeed: 0.005 },
            { name: "Miranda", distance: 3.0, size: 0.04, color1: '#D3D3D3', color2: '#A9A9A9', orbitSpeed: 0.28, rotationSpeed: 0.005 }
          ]}
        />

        {/* Neptune with moons */}
        <Planet
          radius={1.8}
          position={[0, 0, 0]}
          textureMap={neptuneMap}
          orbitRadius={84}
          orbitSpeed={0.008}
          rotationSpeed={0.003}
          atmosphereColor="#4169E1"
          atmosphereIntensity={1.5}
          tilt={0.49}
          moons={[
            { name: "Triton", distance: 6.0, size: 0.21, color1: '#E6E6FA', color2: '#B0C4DE', orbitSpeed: -0.15, rotationSpeed: 0.005 },
            { name: "Nereid", distance: 8.5, size: 0.03, color1: '#C0C0C0', color2: '#A9A9A9', orbitSpeed: 0.1, rotationSpeed: 0.005 }
          ]}
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
