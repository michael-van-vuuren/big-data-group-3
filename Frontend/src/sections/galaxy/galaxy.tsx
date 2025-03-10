"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import Planet from "./planet";
import Stars from "./stars";
import CameraController from "./cameracontroller";


const PLANETS = [
    { radius: 25, color: "#7F5E74", size: 2, speed: 0.07, name: "Planet A" },
    { radius: 45, color: "#726F50", size: 2.5, speed: 0.12, name: "Planet B" },
    { radius: 65, color: "#576981", size: 4, speed: 0.1, name: "Planet C" },
    { radius: 85, color: "#A5685B", size: 6, speed: 0.05, name: "Planet D" },
    { radius: 105, color: "#A020F0", size: 2.5, speed: 0.1, name: "Planet E" },
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

    const backgroundColor = "#203568";
    const initialCameraPosition = new THREE.Vector3(0, 40, 80);

    return (
        <Canvas camera={{ position: initialCameraPosition }} style={{ background: backgroundColor }}>
            <ambientLight intensity={2} />
            <pointLight position={[0, 0, 0]} intensity={10} distance={100} />
            <OrbitControls ref={controlsRef} makeDefault />

            <EffectComposer>
                <Bloom intensity={2.2} luminanceThreshold={0.8} luminanceSmoothing={0.1} />
            </EffectComposer>

            <CameraController
                targetRef={targetRef}
                reset={reset}
                onResetComplete={handleResetComplete}
                controlsRef={controlsRef}
                planetSize={
                    targetRef
                        ? (targetRef.geometry as THREE.SphereGeometry).parameters.radius || 1
                        : 1
                }
                defaultPosition={initialCameraPosition}
            />

            <Stars background={backgroundColor} />

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
