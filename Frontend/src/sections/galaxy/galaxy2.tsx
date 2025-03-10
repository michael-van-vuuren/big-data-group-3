import { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import Planet from "./planet";
import Stars from "./stars";
import CameraController from "./cameracontroller";

const getRandomColor = () => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0")}`;

export default function Galaxy({ 
    planetsData, 
    targetRef, 
    handlePlanetClick,
    reset,
    onResetComplete
}: { 
    planetsData: string[];
    targetRef: THREE.Mesh | null;
    handlePlanetClick: (planet: THREE.Object3D, name: string) => void;
    reset: boolean;
    onResetComplete: () => void;
}) {
    const controlsRef = useRef<any>(null);

    const planetDataRef = useRef(
        planetsData.map((name, index, arr) => {
            const middleIndex = (arr.length - 1) / 2;
            const variance = Math.pow(arr.length / 7, 2);
            const gaussianSize = Math.exp(-Math.pow(index - middleIndex, 2) / (2 * variance));
    
            const randomVariation = (Math.random() - 0.5) * 1.5;

            return {
                radius: 25 + index * 16 + Math.random() * 5,
                color: getRandomColor(),
                size: Math.max(2, 1 + gaussianSize * 5 + randomVariation),
                speed: (0.05 + Math.random() * 0.2) / (index + 1),
                name,
            };
        })
    );

    const backgroundColor = "#203568";
    const initialCameraPosition = new THREE.Vector3(0, 60, 90);

    return (
        <Canvas camera={{ position: initialCameraPosition }} style={{ background: backgroundColor }}>
            <pointLight position={[0, 0, 0]} intensity={50} distance={100} />
            <OrbitControls ref={controlsRef} makeDefault />

            <EffectComposer>
                <Bloom intensity={0.8} luminanceThreshold={0} luminanceSmoothing={0.1} />
            </EffectComposer>

            <CameraController
                targetRef={targetRef}
                reset={reset}
                onResetComplete={onResetComplete}
                controlsRef={controlsRef}
                planetSize={
                    targetRef && targetRef.geometry instanceof THREE.SphereGeometry
                        ? targetRef.geometry.parameters.radius || 1
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

            {planetDataRef.current.map((planet) => (
                <Planet 
                    key={planet.name} 
                    {...planet} 
                    onClick={(mesh) => handlePlanetClick(mesh, planet.name)}
                />
            ))}
        </Canvas>
    );
}


