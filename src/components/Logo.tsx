
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const FluidSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const vec = new THREE.Vector3();

  useFrame((state) => {
    if (meshRef.current) {
      // Make the sphere follow the mouse/touch
      vec.set(
        (state.pointer.x * state.viewport.width) / 2,
        (state.pointer.y * state.viewport.height) / 2,
        0
      );
      meshRef.current.position.lerp(vec, 0.05);

      const time = state.clock.getElapsedTime();
      
      // Smoothly interpolate scale on hover
      const targetScale = hovered ? 3.5 : 3;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Organic wobbling effect
      const geometry = meshRef.current.geometry;
      const positions = geometry.attributes.position as THREE.BufferAttribute;
      
      // Store original positions on first frame
      if (!geometry.userData.originalPositions) {
          geometry.userData.originalPositions = positions.clone();
      }
      const originalPos = geometry.userData.originalPositions as THREE.BufferAttribute;

      for (let i = 0; i < positions.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(originalPos, i);
        const normal = new THREE.Vector3().fromBufferAttribute(originalPos, i).normalize();
        // A simple noise function using sine and cosine
        const noise = Math.sin(p.x * 4 + time * 1.5) * Math.cos(p.y * 4 + time * 1.5) * 0.05;
        p.addScaledVector(normal, noise);
        positions.setXYZ(i, p.x, p.y, p.z);
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={3} // Made it smaller
      onPointerOver={(event) => {
        event.stopPropagation();
        setHover(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHover(false);
      }}
    >
      <sphereGeometry args={[0.5, 128, 128]} />
      <meshPhysicalMaterial 
        color={hovered ? '#A3E635' : '#FFFFFF'} // Tint color
        transmission={1.0}
        opacity={0.9}
        metalness={0.1}
        roughness={0}
        ior={1.33} // Index of Refraction for water
        thickness={0.2}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};

const Logo = () => {
  return (
    <div className="w-full h-[300px] md:h-[400px] cursor-none">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />
        <FluidSphere />
      </Canvas>
    </div>
  );
};

export default Logo;
