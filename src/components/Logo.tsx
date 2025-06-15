import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FluidSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mousePosition = useRef({ x: 0, y: 0 });

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
      const x = (mousePosition.current.x / state.size.width) * 2 - 1;
      const y = -(mousePosition.current.y / state.size.height) * 2 + 1;
      
      vec.set(
        (x * state.viewport.width) / 2,
        (y * state.viewport.height) / 2,
        0
      );
      meshRef.current.position.lerp(vec, 0.1);

      const time = state.clock.getElapsedTime();
      
      meshRef.current.scale.set(1.5, 1.5, 1.5);

      const geometry = meshRef.current.geometry;
      const positions = geometry.attributes.position as THREE.BufferAttribute;
      
      if (!geometry.userData.originalPositions) {
          geometry.userData.originalPositions = positions.clone();
      }
      const originalPos = geometry.userData.originalPositions as THREE.BufferAttribute;

      for (let i = 0; i < positions.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(originalPos, i);
        const normal = new THREE.Vector3().fromBufferAttribute(originalPos, i).normalize();
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
      <meshPhysicalMaterial
        roughness={0}
        transmission={1.0}
        thickness={0.7}
        ior={1.5}
       />
    </mesh>
  );
};

const Logo = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <FluidSphere />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo;
