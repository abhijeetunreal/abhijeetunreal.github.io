
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AnimatedShape = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [clicked, setClick] = useState(false);

    useFrame((state, delta) => {
        const speed = hovered ? 1 : 0.2;
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * speed;
            meshRef.current.rotation.y += delta * speed;
        }
    });

    return (
        <mesh
            ref={meshRef}
            onClick={() => setClick(!clicked)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={clicked ? 1.2 : 1}
        >
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color={hovered ? 'royalblue' : '#cccccc'} wireframe />
        </mesh>
    );
};

const AbstractAnimation = () => {
    return (
        <div className="h-[300px] md:h-[400px] cursor-pointer">
            <Canvas camera={{ position: [0, 0, 4.5] }}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} intensity={Math.PI} />
                <AnimatedShape />
            </Canvas>
        </div>
    );
};

export default AbstractAnimation;
