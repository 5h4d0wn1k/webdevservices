// Type definitions for the solar system project

// Declare modules for libraries without type definitions
declare module 'suncalc';
declare module 'axios';
declare module 'leva';

// Extend existing types
declare namespace THREE {
  interface ShaderMaterial {
    uniforms: Record<string, { value: any }>;
  }
}

// Define planet data structure
interface PlanetData {
  radius: number;
  semiMajorAxis: number;
  eccentricity: number;
  orbitalPeriod: number;
  rotationPeriod: number;
  obliquity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPerihelion: number;
  atmosphereHeight: number;
  atmosphereColor: string;
  textureMap: string;
  bumpMap?: string;
  cloudsMap?: string;
  nightMap?: string;
  specularMap?: string;
  normalMap?: string;
  hasRings: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  ringOpacity?: number;
  ringTextureMap?: string;
  moons: MoonData[];
}

// Define moon data structure
interface MoonData {
  name: string;
  radius: number;
  semiMajorAxis: number;
  eccentricity: number;
  orbitalPeriod: number;
  rotationPeriod: number;
  textureMap: string;
  bumpMap?: string;
  atmosphereHeight?: number;
  atmosphereColor?: string;
}

// Define asteroid data structure
interface AsteroidData {
  radius: number;
  angle: number;
  inclination: number;
  size: number;
  speed: number;
  color: THREE.Color;
}

// Define planetary position data
interface PlanetaryPosition {
  x: number;
  y: number;
  z: number;
}

// Define texture record
interface TextureRecord {
  textureMap: THREE.Texture;
  bumpMap?: THREE.Texture;
  cloudsMap?: THREE.Texture;
  nightMap?: THREE.Texture;
  specularMap?: THREE.Texture;
  normalMap?: THREE.Texture;
  ringMap?: THREE.Texture;
} 