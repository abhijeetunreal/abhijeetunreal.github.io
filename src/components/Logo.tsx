import React, { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';

const FluidSphere = ({ isDark }: { isDark: boolean }) => {
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

        // Reduced the distortion by lowering the noise multiplier
        const noise = Math.sin(p.x * 8 + time * 0.8) * Math.cos(p.y * 4 + time * 0.8) * 0.05;

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
      <sphereGeometry args={[0.5, 48, 48]} />
      <meshPhysicalMaterial
        color={isDark ? '#9c9a9a' : '#e0e0e0'}
        metalness={1}
        roughness={isDark ? 0.8 : 0}
        transmission={1.0}
        thickness={0.5}
        ior={1.4}
        clearcoat={0}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};

// Add support for both HDRI and image environments
const getEnvType = (url?: string) => {
  if (!url) return null;
  const ext = url.split('.').pop()?.toLowerCase();
  if (ext === 'hdr' || ext === 'exr') return 'hdr';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'img';
  return null;
};

const Logo = ({ customEnvLink }: { customEnvLink?: string }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const envType = getEnvType(customEnvLink);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }} gl={{ alpha: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <FluidSphere isDark={isDark} />
          {/*
            To use a custom environment, pass a web URL to the customEnvLink prop, e.g.:
            <Logo customEnvLink="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr" />
            <Logo customEnvLink="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" />
            If customEnvLink is not provided, the default preset ("park") will be used.
          */}
          {!isDark && (
            customEnvLink && envType === 'hdr' ? (
              <Environment files={customEnvLink} background blur={0.8} environmentIntensity={1.5} />
            ) : customEnvLink && envType === 'img' ? (
              <Environment files={[customEnvLink]} background blur={0.8} environmentIntensity={1.5} />
            ) : (
              <Environment preset="park" background blur={0.8} environmentIntensity={1.5} />
            )
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo;
