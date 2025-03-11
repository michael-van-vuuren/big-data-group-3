import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Mesh, Object3D, Vector3, SphereGeometry } from "three";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import Planet from "./planet";
import Stars from "./stars";
import CameraController from "./cameracontroller";

export default function Galaxy({
    planetsData,
    targetRef,
    handlePlanetClick,
    reset,
    onResetComplete
}: {
    planetsData: {
        name: string;
        radius: number;
        color: string;
        size: number;
        speed: number;
        meshRef: Mesh | null;
        setMeshRef: (mesh: Mesh | null) => void;
    }[];
    targetRef: Mesh | null;
    handlePlanetClick: (planet: Object3D, name: string) => void;
    reset: boolean;
    onResetComplete: () => void;
}) {
    const controlsRef = useRef<any>(null);

    const backgroundColor = "#203568";
    const initialCameraPosition = new Vector3(0, 60, 90);

    return (
        <Canvas camera={{ position: initialCameraPosition, far: 2000 }} dpr={[2, 4]} style={{ background: backgroundColor }}>
            <pointLight position={[0, 0, 0]} intensity={50} distance={100} />
            <OrbitControls ref={controlsRef} makeDefault />

            <EffectComposer>
                <Bloom intensity={2.0} luminanceThreshold={0.5} luminanceSmoothing={0.2} />
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

            {planetsData.map((planet) => (
                <Planet
                    key={planet.name}
                    {...planet}
                    setMeshRef={planet.setMeshRef}
                    onClick={(mesh) => {
                        if (mesh instanceof Mesh) {
                            planet.meshRef = mesh;
                            handlePlanetClick(mesh, planet.name);
                        }
                    }}
                />
            ))}

        </Canvas>
    );
}
