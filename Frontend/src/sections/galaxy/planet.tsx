import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGradientTexture } from "./utils";

interface PlanetProps {
    radius: number;
    color: string;
    size: number;
    speed: number;
    onClick: (ref: THREE.Mesh, name: string) => void;
    name: string;
}

export default function PlanetSystem({
    radius,
    color,
    size,
    speed,
    onClick,
    name,
}: PlanetProps) {
    const planetRef = useRef<THREE.Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);

    const phase = useMemo(() => (Math.random() * 2 - 1) * Math.PI / 2 - Math.PI / 2, []);
    const gradientTexture = useMemo(() => createGradientTexture(color), [color]);

    useFrame(({ clock }) => {
        if (planetRef.current) {
            const time = clock.getElapsedTime() * speed;
            const angle = time + phase;
            planetRef.current.position.x = radius * Math.cos(angle);
            planetRef.current.position.z = radius * Math.sin(angle);
        }
    });

    // Orbit Ring
    const points = useMemo(() => {
        const pointsArray = [];
        const segments = 200;

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            pointsArray.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }

        return new THREE.BufferGeometry().setFromPoints(pointsArray);
    }, [radius]);

    return (
        <>
            {/* Planet */}
            <mesh
                ref={planetRef}
                onPointerOver={() => setIsHovered(true)}
                onPointerOut={() => setIsHovered(false)}
                onClick={() => onClick(planetRef.current, name)}
            >
                <sphereGeometry args={[size, 38, 38]} />
                <ambientLight intensity={8} />
                <meshStandardMaterial
                    map={gradientTexture}
                    emissive={isHovered ? color : "black"}
                    emissiveIntensity={isHovered ? 3.0 : 0}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>

            {/* Orbit Ring */}
            <line>
                <bufferGeometry attach="geometry" {...points} />
                <lineBasicMaterial attach="material" color="white" transparent opacity={0.05} />
            </line>
        </>
    );
}
