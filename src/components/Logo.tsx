
import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshRefractionMaterial, Environment, useEnvironment } from '@react-three/drei';
import * as THREE from 'three';

const FluidSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mousePosition = useRef({ x: 0, y: 0 });

  const envMap = useEnvironment({
    files: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/hdri/studio_small_03_1k.hdr',
  });

  useEffect(() => {
    const updateMousePosition = (ev: PointerEvent) => {
      mousePosition.current = { x: ev.clientX, y: ev.clientY };
    };
    window.addEventListener('pointermove', updateMousePosition);
    return () => {
      window.removeEventListener('pointermove', updateMousePosition);
    };
  }, []);

  const vec = new THREE.Vector3();

  useFrame((state) => {
    if (meshRef.current) {
      // Convert mouse position from screen pixels to normalized device coordinates
      const x = (mousePosition.current.x / state.size.width) * 2 - 1;
      const y = -(mousePosition.current.y / state.size.height) * 2 + 1;
      
      // Make the sphere follow the mouse
      vec.set(
        (x * state.viewport.width) / 2,
        (y * state.viewport.height) / 2,
        0
      );
      meshRef.current.position.lerp(vec, 0.1);

      const time = state.clock.getElapsedTime();
      
      // Keep scale constant but smaller
      meshRef.current.scale.set(1.5, 1.5, 1.5);

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
      scale={1.5}
    >
      <sphereGeometry args={[0.5, 128, 128]} />
      <MeshRefractionMaterial
        envMap={envMap}
        bounces={2}
        aberrationStrength={0.01}
        ior={1.5}
        fresnel={1}
        color={"white"}
        fastChroma
      />
    </mesh>
  );
};

const Logo = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Environment files="https://raw.githubusercontent.com/pmndrs/drei-assets/master/hdri/studio_small_03_1k.hdr" />
          <FluidSphere />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo;
