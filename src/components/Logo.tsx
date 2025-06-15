
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FluidSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Smoothly interpolate scale on hover
      const targetScale = hovered ? 6 : 5;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Add a subtle pulsing effect
      const pulse = Math.sin(time * 2) * 0.05;
      // We need to apply the pulse to the current scale
      const currentScale = meshRef.current.scale.x;
      meshRef.current.scale.set(currentScale + pulse, currentScale + pulse, currentScale + pulse);
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={5}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHover(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHover(false);
      }}
    >
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial 
        color={hovered ? '#84CC16' : '#A3E635'} // Brighter on hover
        transparent 
        opacity={0.8} 
        roughness={0.1} 
        metalness={0.1}
      />
    </mesh>
  );
};

const Logo = () => {
  return (
    <div className="w-full h-[300px] md:h-[400px] cursor-pointer">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <FluidSphere />
      </Canvas>
    </div>
  );
};

export default Logo;
