import * as THREE from 'three';
import React, { useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard, Circle, Text } from '@react-three/drei';

type Project = {
  title: string;
  description: string;
  tags: string[];
};

type CirclePackingProps = {
  projects: Project[];
  tags: string[];
};

const CameraController = ({ targetPosition, targetZoom }: { targetPosition: THREE.Vector3, targetZoom: number }) => {
    const { camera, controls } = useThree();

    useFrame(() => {
        camera.position.lerp(targetPosition, 0.05);
        camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, 0.05);
        camera.updateProjectionMatrix();
        if (controls) {
            (controls as any).update();
        }
    });

    return null;
};

const ProjectCircle = ({ project, position }: { project: Project, position: [number, number, number] }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <group position={position}>
            <Circle args={[0.8, 32]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
                <meshStandardMaterial color={hovered ? '#8B5CF6' : '#4B5563'} />
            </Circle>
            <Billboard>
                <Text
                    position={[0, 0, 0.1]}
                    fontSize={0.15}
                    color={'#F9FAFB'}
                    maxWidth={1.4}
                    textAlign="center"
                    anchorY="middle"
                >
                    {project.title.toUpperCase()}
                </Text>
            </Billboard>
        </group>
    );
};

const TagCircle = ({ tag, position, onSelect, projectCount }: { tag: string, position: [number, number, number], onSelect: (tag: string) => void, projectCount: number }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <group position={position}>
            <Circle args={[2, 64]} onClick={() => onSelect(tag)} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
                <meshStandardMaterial color={hovered ? '#8B5CF6' : '#1F2937'} transparent opacity={0.9}/>
            </Circle>
            <Billboard>
                <Text position={[0, 0, 0.1]} fontSize={0.3} color="#E5E7EB" textAlign="center" anchorY="middle">
                    {`${tag.toUpperCase()}\n(${projectCount})`}
                </Text>
            </Billboard>
        </group>
    );
};


export default function CirclePacking({ projects, tags }: CirclePackingProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [target, setTarget] = useState({ position: new THREE.Vector3(0, 0, 20), zoom: 15 });

    const tagData = useMemo(() => {
        const data: { [key: string]: { position: [number, number, number], count: number } } = {};
        const numTags = tags.length;
        const radius = 2.5 + numTags * 0.5;
        tags.forEach((tag, i) => {
            const angle = (i / numTags) * 2 * Math.PI;
            data[tag] = {
                position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
                count: projects.filter(p => p.tags.includes(tag)).length,
            };
        });
        return data;
    }, [tags, projects]);

    const projectsOfActiveTag = useMemo(() => {
        if (!activeTag) return [];
        return projects.filter(p => p.tags.includes(activeTag));
    }, [activeTag, projects]);

    const projectPositions = useMemo(() => {
        if (!activeTag) return [];
        const n = projectsOfActiveTag.length;
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        const scale = 1.2;

        return projectsOfActiveTag.map((project, i) => {
            const radius = scale * Math.sqrt(i);
            const theta = i * phi;
            const center = tagData[activeTag].position;
            const x = center[0] + radius * Math.cos(theta);
            const y = center[1] + radius * Math.sin(theta);
            return { project, position: [x, y, 0] as [number, number, number] };
        });
    }, [activeTag, projectsOfActiveTag, tagData]);


    useEffect(() => {
        if (activeTag) {
            const pos = tagData[activeTag].position;
            setTarget({ position: new THREE.Vector3(pos[0], pos[1], 10), zoom: 40 });
        } else {
            setTarget({ position: new THREE.Vector3(0, 0, 20), zoom: 15 });
        }
    }, [activeTag, tagData]);

    return (
        <div className="w-full h-[50vh] md:h-[60vh] relative border-2 border-border bg-background">
             {activeTag && (
                <button
                    onClick={() => setActiveTag(null)}
                    className="absolute top-4 left-4 z-10 text-xs font-bold border-2 px-3 py-1 bg-background border-accent hover:border-primary hover:text-primary transition-colors"
                >
                    [BACK TO CATEGORIES]
                </button>
            )}
            <Canvas orthographic camera={{ position: [0, 0, 20], zoom: 15 }}>
                <CameraController targetPosition={target.position} targetZoom={target.zoom} />
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={Math.PI} />

                {Object.entries(tagData).map(([tag, data]) => (
                    <TagCircle
                        key={tag}
                        tag={tag}
                        position={data.position}
                        onSelect={setActiveTag}
                        projectCount={data.count}
                    />
                ))}

                {activeTag && projectPositions.map(({ project, position }, i) => (
                    <ProjectCircle key={`${project.title}-${i}`} project={project} position={position} />
                ))}
                
            </Canvas>
        </div>
    );
}
