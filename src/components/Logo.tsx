
import React, { useRef } from 'react';
import { Canvas, useFrame, extend, Node } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Define the type for our custom material's props (the uniforms)
type FluidMaterialType = THREE.ShaderMaterial & {
  u_time: number;
};

const FluidMaterial = shaderMaterial(
  // Uniforms
  {
    u_time: 0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float u_time;
    varying vec2 vUv;

    void main() {
      vec2 centeredUv = vUv - 0.5;
      float dist = length(centeredUv);

      if (dist > 0.5) discard;
      
      float alpha = 1.0 - smoothstep(0.45, 0.5, dist);

      gl_FragColor = vec4(vUv.x, vUv.y, abs(sin(u_time * 0.5)), alpha);
    }
  `
);

// We need to tell react-three-fiber about our custom material
extend({ FluidMaterial });

// Augment the JSX namespace to include our custom material
declare module '@react-three/fiber' {
  interface ThreeElements {
    fluidMaterial: Node<FluidMaterialType, typeof FluidMaterial>
  }
}

const FluidSphere = () => {
  const materialRef = useRef<FluidMaterialType>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={5}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <fluidMaterial ref={materialRef} />
    </mesh>
  );
};

const Logo = () => {
  return (
    <div className="w-full h-[300px] md:h-[400px] cursor-pointer">
      <Canvas>
        <FluidSphere />
      </Canvas>
    </div>
  );
};

export default Logo;
