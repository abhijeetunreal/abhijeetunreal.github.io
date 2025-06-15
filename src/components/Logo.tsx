
import React from 'react';
import { Canvas } from '@react-three/fiber';

const FluidSphere = () => {
  return (
    <mesh scale={5}>
      <circleGeometry args={[0.5, 64]} />
      <meshStandardMaterial color="#A3E635" transparent opacity={0.75} />
    </mesh>
  );
};

const Logo = () => {
  return (
    <div className="w-full h-[300px] md:h-[400px] cursor-pointer">
      <Canvas>
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={0.5}/>
        <FluidSphere />
      </Canvas>
    </div>
  );
};

export default Logo;
