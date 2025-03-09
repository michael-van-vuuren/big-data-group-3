"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Planet from "./planet";
import Stars from "./stars";


const PLANETS = [
    { radius: 25, color: "#7F5E74", size: 2, speed: -0.07, name: "Planet A" },
    { radius: 45, color: "#726F50", size: 2.5, speed: 0.09, name: "Planet B" },
    { radius: 70, color: "#576981", size: 4, speed: 0.05, name: "Planet C" },
    { radius: 95, color: "#A5685B", size: 6, speed: 0.06, name: "Planet D" },
    { radius: 125, color: "#40E0D0", size: 2, speed: -0.03, name: "Planet E" },
];

export default function Galaxy({ setPlanetName }: { setPlanetName: (name: string | null) => void }) {
    const [targetRef, setTargetRef] = useState<THREE.Mesh | null>(null);
    const [reset, setReset] = useState(false);
    const controlsRef = useRef<any>(null);

    const handlePlanetClick = (planet: THREE.Mesh, name: string) => {
        if (targetRef === planet) {
            setReset(true);
            setPlanetName(null);
        } else {
            setTargetRef(planet);
            setReset(false);
            setPlanetName(name);
        }
    };

    const handleResetComplete = () => {
        setTargetRef(null);
        setReset(false);
        setPlanetName(null);
    };

    return (
        <Canvas camera={{ position: [0, 30, 70] }} style={{ background: "#010817" }}>
            <ambientLight intensity={2} />
            <pointLight position={[0, 0, 0]} intensity={10} distance={100} />
            <OrbitControls ref={controlsRef} makeDefault />

            <EffectComposer>
                <Bloom intensity={2.2} luminanceThreshold={0.8} luminanceSmoothing={0.1} />
            </EffectComposer>

            <Stars count={1600} minRadius={400} maxRadius={600} />

            <mesh>
                <sphereGeometry args={[8, 40, 40]} />
                <meshStandardMaterial
                    color="#FFFF00"
                    emissive="#FFFF00"
                    emissiveIntensity={70}
                />
            </mesh>

            {PLANETS.map((planet) => (
                <Planet key={planet.name} {...planet} onClick={handlePlanetClick} />
            ))}
        </Canvas>
    );
}
