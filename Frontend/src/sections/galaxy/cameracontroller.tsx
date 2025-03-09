import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CameraControllerProps {
    targetRef: THREE.Mesh | null;
    reset: boolean;
    onResetComplete: () => void;
    controlsRef: React.RefObject<any>;
    planetSize: number;
}

export default function CameraController({
    targetRef,
    reset,
    onResetComplete,
    controlsRef,
    planetSize
}: CameraControllerProps) {
    const { camera } = useThree();
    const lerpSpeed = 0.2;
    const defaultPosition = new THREE.Vector3(0, 20, 50);

    useFrame(() => {
        if (reset) {
            camera.position.lerp(defaultPosition, lerpSpeed);
            camera.lookAt(0, 0, 0);

            if (camera.position.distanceTo(defaultPosition) < 0.1) {
                onResetComplete();
                if (controlsRef.current) controlsRef.current.enabled = true;
            }
        } else if (targetRef) {
            const offset = planetSize * 3;
            const targetPosition = targetRef.position.clone().add(new THREE.Vector3(0, offset / 1.5, 0));
            const sunPosition = new THREE.Vector3(0, 0, 0);
            const direction = targetPosition.clone().sub(sunPosition).normalize();
            const newPosition = targetPosition
                .clone()
                .addScaledVector(direction, offset)
                .add(new THREE.Vector3(0, 0, 0));

            camera.position.lerp(newPosition, lerpSpeed);
            camera.lookAt(sunPosition);

            if (controlsRef.current) controlsRef.current.enabled = false;
        }
    });

    return null;
}
