import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3, CatmullRomCurve3, TubeGeometry, BackSide } from "three";

import { createGradientTexture } from "@/lib/colorutils";

interface PlanetProps {
    name: string;
    radius: number;
    color: string;
    size: number;
    speed: number;
    setMeshRef: (mesh: Mesh | null) => void;
    onClick: (ref: Mesh, name: string) => void;
}

export default function PlanetSystem({ name, radius, color, size, speed, setMeshRef, onClick }: PlanetProps) {
    const planetRef = useRef<Mesh>(null!);
    const outlineRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (planetRef.current) {
            setMeshRef(planetRef.current);
        }
    }, [setMeshRef]);

    const phase = useMemo(() => (Math.random() * 2 - 1) * Math.PI / 2 - Math.PI / 2, []);
    const gradientTexture = useMemo(() => createGradientTexture(color), [color]);

    const rotationAxis = useMemo(() => {
        return new Vector3(Math.random(), Math.random() * 0.2 + 0.8, Math.random()).normalize();
    }, []);

    useFrame(({ clock }) => {
        if (planetRef.current && outlineRef.current) {
            const time = clock.getElapsedTime() * speed;
            const angle = time + phase;

            const x = -radius * Math.cos(angle);
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
            pointsArray.push(new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }

        return new CatmullRomCurve3(pointsArray);
    }, [radius]);

    const tubeGeometry = useMemo(() => {
        return new TubeGeometry(points, 200, 0.15, 8, false);
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
                scale={[1.15, 1.15, 1.15]}
            >
                <sphereGeometry args={[size, resolution, resolution]} />
                <meshBasicMaterial color="black" side={BackSide} />
            </mesh>

            {/* planet */}
            <mesh
                ref={planetRef}
                onPointerOver={() => setIsHovered(true)}
                onPointerOut={() => setIsHovered(false)}
                onClick={() => onClick(planetRef.current, name)}
            >
                <sphereGeometry args={[size, resolution, resolution]} />
                <ambientLight intensity={9} color={"#999"} />
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
