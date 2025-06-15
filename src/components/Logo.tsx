import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';

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

      const cameraPosition = state.camera.position;
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(meshRef.current.matrixWorld);

      for (let i = 0; i < positions.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(originalPos, i);
        const pWorld = p.clone().applyMatrix4(meshRef.current.matrixWorld);
        
        const viewVector = new THREE.Vector3().subVectors(cameraPosition, pWorld).normalize();
        
        const normal = new THREE.Vector3().fromBufferAttribute(originalPos, i).normalize();
        const worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
        
        const dotProduct = worldNormal.dot(viewVector);
        const edgeFactor = Math.pow(1.0 - Math.abs(dotProduct), 3.0);
        
        const noise = Math.sin(p.x * 8 + time * 2.5) * Math.cos(p.y * 4 + time * 2.5) * 0.15;
        
        p.addScaledVector(normal, noise * edgeFactor);
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
        metalness={0}
        roughness={0}
        transmission={1.0}
        thickness={1.5}
        ior={2.33}
        clearcoat={1}
        clearcoatRoughness={0}
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
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo;
