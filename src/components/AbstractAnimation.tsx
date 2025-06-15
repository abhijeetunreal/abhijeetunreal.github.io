
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
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
        <Icosahedron
            ref={meshRef}
            args={[1.5, 0]}
            onClick={() => setClick(!clicked)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={clicked ? 1.2 : 1}
        >
            <meshStandardMaterial color={hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'} wireframe />
        </Icosahedron>
    );
};

const AbstractAnimation = () => {
    return (
        <div className="h-[300px] md:h-[400px] cursor-pointer">
            <Canvas camera={{ position: [0, 0, 4.5] }}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <AnimatedShape />
            </Canvas>
        </div>
    );
};

export default AbstractAnimation;
