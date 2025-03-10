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
    const outlineRef = useRef<THREE.Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);

    const phase = useMemo(() => (Math.random() * 2 - 1) * Math.PI / 2 - Math.PI / 2, []);
    const gradientTexture = useMemo(() => createGradientTexture(color), [color]);

    const rotationAxis = useMemo(() => {
        const axis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
        return axis;
    }, []);

    useFrame(({ clock }) => {
        if (planetRef.current && outlineRef.current) {
            const time = clock.getElapsedTime() * speed;
            const angle = time + phase;

            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);

            planetRef.current.position.set(x, 0, z);
            outlineRef.current.position.set(x, 0, z);

            const rotationSpeed = Math.random() * 2;
            planetRef.current.rotateOnAxis(rotationAxis, rotationSpeed * 0.005);
        }
    });

    const points = useMemo(() => {
        const pointsArray = [];
        const segments = 200;

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            pointsArray.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }

        return new THREE.CatmullRomCurve3(pointsArray);
    }, [radius]);

    const tubeGeometry = useMemo(() => {
        return new THREE.TubeGeometry(points, 200, 0.1, 8, false);
    }, [points]);

    const resolution = 32;

    return (
        <>
            {/* outline */}
            <mesh
                ref={outlineRef}
                onPointerOver={() => setIsHovered(true)}
                onPointerOut={() => setIsHovered(false)}
                onClick={() => onClick(planetRef.current, name)}
                scale={[1.1, 1.1, 1.1]}
            >
                <sphereGeometry args={[size, resolution, resolution]} />
                <meshBasicMaterial color="black" side={THREE.BackSide} />
            </mesh>

            {/* planet */}
            <mesh
                ref={planetRef}
                onPointerOver={() => setIsHovered(true)}
                onPointerOut={() => setIsHovered(false)}
                onClick={() => onClick(planetRef.current, name)}
            >
                <sphereGeometry args={[size, resolution, resolution]} />
                <ambientLight intensity={8} />
                <meshStandardMaterial
                    map={gradientTexture}
                    emissive={isHovered ? "white" : "black"}
                    emissiveIntensity={isHovered ? 0.3 : 0}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>

            {/* orbit path */}
            <mesh>
                <primitive object={tubeGeometry} />
                <meshBasicMaterial color="#000" />
            </mesh>
        </>
    );
}
