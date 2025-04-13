import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Mesh, Vector3, SphereGeometry } from "three";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import Planet from "./planet";
import Stars from "./stars";
import CameraController from "./cameracontroller";

import type { PlanetData } from "@/sections/galaxy/types/planetdata";

interface GalaxyProps {
    planetData: PlanetData[];
    targetRef: Mesh | null;
    handleSelection: (planet: PlanetData) => void;
    reset: boolean;
    onResetComplete: () => void;
    path: string;
}

export default function Galaxy({ planetData, targetRef, handleSelection, reset, onResetComplete, path }: GalaxyProps) {
    const controlsRef = useRef<any>(null);

    const colorMap = {
        "Fruity": "#036",
        "Herbal": "#243",
        "Savory": "#413",
        "Warm": "#712",
        "Sweet": "#349",
    }
    const intensityMap = {
        "Fruity": 1.7,
        "Herbal": 1.3,
        "Savory": 1.3,
        "Warm": 1.3,
        "Sweet": 1.3,
    }
    const planetIntensityMap = {
        "Fruity": 9.0,
        "Herbal": 20.0,
        "Savory": 10.0,
        "Warm": 30.0,
        "Sweet": 25.0,
    }
    type PathKeys = keyof typeof colorMap;

    const backgroundColor: string = path in colorMap
            ? colorMap[path as PathKeys]
            : "#036";
    const bloomIntensity: number = path in intensityMap
            ? intensityMap[path as PathKeys]
            : 2.0;
    const planetLightIntensity: number = path in planetIntensityMap
            ? planetIntensityMap[path as PathKeys]
            : 8.0;

    const initialCameraPosition = new Vector3(0, 40, 90);

    return (
        <Canvas camera={{ position: initialCameraPosition, far: 2000 }} dpr={[2, 4]} style={{ background: backgroundColor }}>
            <pointLight position={[0, 0, 0]} intensity={50} distance={100} />
            <OrbitControls ref={controlsRef} makeDefault />

            <EffectComposer>
                <Bloom intensity={bloomIntensity} luminanceThreshold={0.0} luminanceSmoothing={0.2} />
            </EffectComposer>

            <CameraController
                targetRef={targetRef}
                reset={reset}
                onResetComplete={onResetComplete}
                controlsRef={controlsRef}
                planetSize={
                    targetRef && targetRef.geometry instanceof SphereGeometry
                        ? targetRef.geometry.parameters.radius || 1
                        : 1
                }
                defaultPosition={initialCameraPosition}
            />

            <Stars background={backgroundColor} />

            <mesh>
                <sphereGeometry args={[9, 40, 40]} />
                <meshStandardMaterial
                    color="#FFFF00"
                    emissive="#FFFF00"
                    emissiveIntensity={70}
                />
            </mesh>

            {planetData.map((planet) => (
                <Planet
                    key={planet.name}
                    {...planet}
                    setMeshRef={planet.setMeshRef}
                    onClick={() => {
                        if (planet.meshRef) {
                            handleSelection(planet);
                        }
                    }}
                    lightIntensity={planetLightIntensity}
                />
            ))}

        </Canvas>
    );
}
